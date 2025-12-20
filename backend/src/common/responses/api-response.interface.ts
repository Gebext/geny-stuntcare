// src/common/responses/api-response.interface.ts

export interface ApiResponse<T> {
  success: boolean; // Menggantikan 'status' JSend
  message: string; // Pesan yang dikirimkan ke frontend (wajib ada)
  data: T | T[] | null; // Data utama (payload)
}