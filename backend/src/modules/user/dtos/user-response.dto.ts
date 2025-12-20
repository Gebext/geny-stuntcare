import { Exclude, Expose } from 'class-transformer';
import { User } from '@prisma/client';

// Tipe data dasar yang kita harapkan
export type UserResponseData = Omit<User, 'passwordHash' | 'roles' | 'motherProfile' | 'chatSessions'>;

export class UserResponseDto implements UserResponseData {
  
  // ===================================
  // FIELD YANG DIKIRIM KE FRONTEND (@Expose)
  // ===================================
  
  @Expose()
  id: string; // ID unik user

  @Expose()
  name: string; // Nama user

  @Expose()
  email: string; // Email user

  @Expose()
  phone: string | null; // Nomor telepon user (opsional)

  @Expose()
  isActive: boolean; // Status aktif user

  @Expose()
  createdAt: Date; // Waktu pembuatan data

  @Expose()
  updatedAt: Date; // Waktu update data
  
  // ===================================
  // FIELD YANG DISEMBUHNYIKAN (@Exclude)
  // ===================================

  // Field ini ada di objek mentah Prisma, 
  // tetapi secara otomatis TIDAK akan muncul di response JSON.
  @Exclude()
  passwordHash: string; 
  
  // Field relasi lainnya yang mungkin tidak ingin ditampilkan secara default:
  // @Exclude()
  // roles: any[]; 
  // @Exclude()
  // motherProfile: any; 

  // Constructor yang diperlukan oleh class-transformer untuk inisialisasi
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}