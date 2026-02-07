import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prismaservice';
import { SendMessageDto } from '../dtos/send.message';
import Groq from 'groq-sdk';

@Injectable()
export class ChatService implements OnModuleInit {
  private readonly logger = new Logger(ChatService.name);
  private groq: Groq;

  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey) this.groq = new Groq({ apiKey });
  }

  async handleMessage(userId: string, dto: SendMessageDto) {
    // 1. Ambil Data Super Lengkap sesuai Schema Prisma kamu
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        motherProfile: {
          include: {
            environment: true,
            childProfiles: {
              include: {
                anthropometries: {
                  orderBy: { measurementDate: 'desc' },
                  take: 5,
                },
                nutritionHistories: {
                  orderBy: { recordedAt: 'desc' },
                  take: 3,
                },
                aiAnalysis: true, // Akses skor gizi & z-score
                healthHistories: {
                  orderBy: { diagnosisDate: 'desc' },
                  take: 2,
                },
              },
            },
          },
        },
      },
    });

    if (!user?.motherProfile)
      throw new NotFoundException('Profil belum lengkap');

    // 2. Data Contextual untuk AI
    const familyContext = {
      mama: {
        nama: user.name,
        isHamil: user.motherProfile.isPregnant,
        trimester: user.motherProfile.trimester,
        sanitasi: user.motherProfile.environment?.sanitation || 'Belum diisi',
        airBersih: user.motherProfile.environment?.cleanWater
          ? 'Ada'
          : 'Tidak Ada',
      },
      anakAnak: user.motherProfile.childProfiles.map((c) => ({
        nama: c.name,
        usia: this.calculateAge(c.birthDate) + ' bulan',
        gender: c.gender,
        hasilAI: c.aiAnalysis
          ? {
              status: c.aiAnalysis.status,
              skorGizi: c.aiAnalysis.score,
              zScore: c.aiAnalysis.zScore,
              rekomendasi: c.aiAnalysis.recommendations,
            }
          : 'Belum ada analisis mendalam',
        riwayatFisik: c.anthropometries.map((a) => ({
          bb: a.weightKg,
          tb: a.heightCm,
          tgl: a.measurementDate,
        })),
        makanTerakhir: c.nutritionHistories[0]?.foodType || 'Belum tercatat',
      })),
    };

    // 3. Manage Session
    let session;
    if (dto.sessionId) {
      session = await this.prisma.chatSession.findUnique({
        where: { id: dto.sessionId },
      });
    }
    if (!session) {
      session = await this.prisma.chatSession.create({
        data: { userId, contextSnapshot: familyContext as any },
      });
    }

    // 4. Advanced System Prompt
    const systemPrompt = `
      Anda adalah GENY, AI Dokter Spesialis Anak & Nutrisi. 
      Tugas: Bantu Mama ${user.name} memantau tumbuh kembang anaknya.
      
      KONTEKS DATA KELUARGA:
      ${JSON.stringify(familyContext, null, 2)}

      ATURAN:
      - Gunakan data 'hasilAI' (zScore & skorGizi) untuk memberikan diagnosa.
      - Jika Mama tanya soal gizi, hubungkan dengan riwayat makan dan sanitasi rumahnya.
      - Panggil "Mama ${
        user.name
      }". Bahasa harus empati, detail, dan profesional.
      - Gunakan Bullet Points.
    `;

    // 5. Groq Llama-3.3-70b
    if (!this.groq) {
      this.logger.error('GROQ_API_KEY is not configured');
      throw new NotFoundException(
        'Layanan AI belum dikonfigurasi. Hubungi administrator.',
      );
    }

    const completion = await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: dto.message },
      ],
      temperature: 0.5,
    });

    const aiMsg = completion.choices[0].message.content;

    // 6. Simpan pesan & return sesuai format yang diminta Controller
    await this.prisma.chatMessage.create({
      data: { sessionId: session.id, sender: 'USER', message: dto.message },
    });

    const savedAi = await this.prisma.chatMessage.create({
      data: { sessionId: session.id, sender: 'GENY_AI', message: aiMsg },
    });

    return { sessionId: session.id, message: savedAi };
  }

  private calculateAge(birth: Date) {
    const diff = Date.now() - birth.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
  }

  async getSessionHistory(sessionId: string) {
    return await this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
