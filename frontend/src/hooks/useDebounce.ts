import { useEffect, useState } from "react";

/**
 * Hook untuk menunda update nilai sampai waktu tertentu berlalu.
 * Berguna untuk membatasi jumlah API call saat user mengetik.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set timer untuk mengupdate debouncedValue setelah delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Bersihkan timer jika value berubah sebelum delay selesai (cleanup)
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
