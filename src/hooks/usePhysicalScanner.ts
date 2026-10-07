import { useEffect, useRef } from 'react';

interface UsePhysicalScannerOptions {
  onScan: (barcode: string) => void;
  /**
   * Batas waktu antar ketikan dalam milidetik.
   * Scanner fisik mengetik sangat cepat (biasanya < 20ms).
   * 50ms adalah ambang batas yang aman untuk membedakan scanner dari ketikan manusia.
   */
  delay?: number;
}

export function usePhysicalScanner({ onScan, delay = 50 }: UsePhysicalScannerOptions) {
  const buffer = useRef('');
  const lastKeyTime = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      
      // Jika pengguna sedang fokus di dalam input teks atau textarea (misal kotak pencarian atau nominal),
      // biarkan input tersebut yang menangani (karena scanner fisik akan mengetik di sana).
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const currentTime = Date.now();
      
      // Jika jeda waktu terlalu lama (ketikan manusia), reset buffer
      if (currentTime - lastKeyTime.current > delay) {
        buffer.current = '';
      }
      
      lastKeyTime.current = currentTime;

      // Scanner selalu diakhiri dengan tombol Enter
      if (e.key === 'Enter') {
        if (buffer.current.length > 2) {
          onScan(buffer.current);
          buffer.current = '';
          e.preventDefault();
        }
      } else if (e.key.length === 1) {
        // Kumpulkan karakter-karakter yang diketik oleh scanner
        buffer.current += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onScan, delay]);
}
