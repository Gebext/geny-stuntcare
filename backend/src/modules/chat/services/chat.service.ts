import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prismaservice';
import { SendMessageDto } from '../dtos/send.message';
import fetch from 'node-fetch';

@Injectable()
export class ChatService {
  /**
   * ⚠️ HARD CODE (DEV ONLY)
   */
  private readonly apiKey = 'AIzaSyBcbh0OXjNi0yVFwM4imn85sOjzXStYUG4';

  /**
   * URUTAN MODEL (PRIORITAS → HEMAT)
   */
  private readonly GEMINI_MODELS = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-3-flash',
  ];

  constructor(private prisma: PrismaService) {}

  /* =====================================================
   * MAIN CHAT HANDLER
   * ===================================================== */
  async handleMessage(userId: string, dto: SendMessageDto) {
    /* 1️⃣ Ambil data anak */
    const children = await this.prisma.childProfile.findMany({
      where: { mother: { userId } },
      include: {
        anthropometries: { orderBy: { measurementDate: 'desc' }, take: 1 },
        nutritionHistories: { orderBy: { recordedAt: 'desc' }, take: 2 },
        healthHistories: { orderBy: { diagnosisDate: 'desc' }, take: 1 },
      },
    });

    /* 2️⃣ Kelola sesi */
    let session;
    if (dto.sessionId) {
      session = await this.prisma.chatSession.findUnique({
        where: { id: dto.sessionId },
      });
      if (!session) {
        throw new NotFoundException('Sesi chat tidak ditemukan');
      }
    } else {
      session = await this.prisma.chatSession.create({
        data: {
          userId,
          contextSnapshot: children.length ? children : { info: 'No data' },
        },
      });
    }

    /* 3️⃣ Simpan pesan user */
    await this.prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        sender: 'USER',
        message: dto.message,
      },
    });

    /* 4️⃣ Ringkas context anak (hemat token) */
    const childrenContext = children
      .map((c, i) => {
        const fisik = c.anthropometries[0]
          ? `BB ${c.anthropometries[0].weightKg}kg, TB ${c.anthropometries[0].heightCm}cm`
          : 'Belum ada data fisik';

        const kesehatan = c.healthHistories[0]
          ? c.healthHistories[0].diseaseName
          : 'Tidak ada riwayat penyakit';

        return `ANAK ${i + 1}
Nama: ${c.name}
JK: ${c.gender}
TTL: ${c.birthDate}
Fisik: ${fisik}
Kesehatan: ${kesehatan}`;
      })
      .join('\n\n');

    /* 5️⃣ System Prompt */
    const systemPrompt = `
Anda adalah GENY, asisten ahli kesehatan anak & pencegahan stunting.
User dipanggil "Mama Cantik".

DATA ANAK:
${childrenContext}

ATURAN WAJIB:
- Jawaban ramah & empatik
- Gunakan bullet point
- Jika ada indikasi stunting → peringatan lembut
- Jangan menakut-nakuti
`;

    const finalPrompt = `
${systemPrompt}

PERTANYAAN MAMA CANTIK:
${dto.message}
`;

    /* 6️⃣ Call Gemini (Fallback) */
    const ai = await this.callGeminiWithFallback(finalPrompt);

    /* 7️⃣ Simpan jawaban AI */
    const saved = await this.prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        sender: 'GENY_AI',
        message: ai.text,
      },
    });

    return {
      sessionId: session.id,
      modelUsed: ai.model,
      message: saved,
    };
  }

  /* =====================================================
   * MULTI MODEL FALLBACK ENGINE
   * ===================================================== */
  private async callGeminiWithFallback(
    prompt: string,
  ): Promise<{ model: string; text: string }> {
    let lastError: any;

    for (const model of this.GEMINI_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          const status = data?.error?.status;
          const message = data?.error?.message;

          if (res.status === 429 || status === 'RESOURCE_EXHAUSTED') {
            console.warn(
              `[Geny] Model ${model} limit tercapai, pindah model...`,
            );
            lastError = message;
            continue;
          }

          throw new Error(message || 'Gemini error');
        }

        return {
          model,
          text: data.candidates[0].content.parts[0].text,
        };
      } catch (err: any) {
        lastError = err.message;
      }
    }

    throw new Error('Geny sedang istirahat 😴. Semua model sedang kelelahan.');
  }

  /* =====================================================
   * CHAT HISTORY
   * ===================================================== */
  async getSessionHistory(sessionId: string) {
    return this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
