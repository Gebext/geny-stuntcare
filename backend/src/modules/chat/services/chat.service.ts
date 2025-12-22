import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prismaservice';
import { SendMessageDto } from '../dtos/send.message';

const fetch = require('node-fetch');

@Injectable()
export class ChatService {
  private readonly apiKey = 'AIzaSyBcbh0OXjNi0yVFwM4imn85sOjzXStYUG4';

  private readonly apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${this.apiKey}`;

  constructor(private prisma: PrismaService) {}

  async handleMessage(userId: string, dto: SendMessageDto) {
    const children = await this.prisma.childProfile.findMany({
      where: { mother: { userId } },
      include: {
        anthropometries: { orderBy: { measurementDate: 'desc' }, take: 1 },
        nutritionHistories: { orderBy: { recordedAt: 'desc' }, take: 3 },
      },
    });

    let session;
    if (dto.sessionId) {
      session = await this.prisma.chatSession.findUnique({
        where: { id: dto.sessionId },
      });
      if (!session) throw new NotFoundException('Sesi chat tidak ditemukan');
    } else {
      session = await this.prisma.chatSession.create({
        data: {
          userId: userId,
          contextSnapshot:
            children.length > 0 ? (children as any) : { info: 'No data' },
        },
      });
    }

    await this.prisma.chatMessage.create({
      data: { sessionId: session.id, sender: 'USER', message: dto.message },
    });

    const childrenInfo = children
      .map(
        (c) =>
          `Nama: ${c.name}, Lahir: ${c.birthDate}, Data Fisik: ${JSON.stringify(
            c.anthropometries[0] || 'N/A',
          )}`,
      )
      .join(' | ');

    const systemPrompt = `Anda adalah Geny, asisten pencegahan stunting. 
    User memiliki ${children.length} anak yaitu: [${childrenInfo}]. 
    Gunakan data ini untuk menjawab secara spesifik. Panggil user 'Mama Cantik'.`;

    try {
      console.log('--- Menghubungi Gemini 3 Flash ---');
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `${systemPrompt}\n\nUser: ${dto.message}` }],
            },
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Gagal akses Gemini');
      }

      const aiResponse = data.candidates[0].content.parts[0].text;

      const savedAiMsg = await this.prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          sender: 'GENY_AI',
          message: aiResponse,
        },
      });

      return { sessionId: session.id, message: savedAiMsg };
    } catch (error: any) {
      console.error('Chat Error:', error.message);
      throw new Error(`Geny sedang sibuk: ${error.message}`);
    }
  }

  async getSessionHistory(sessionId: string) {
    return this.prisma.chatMessage.findMany({
      where: { sessionId: sessionId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
