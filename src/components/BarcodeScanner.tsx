import { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Loader2 } from 'lucide-react';

interface BarcodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: any) => void;
}

export function BarcodeScanner({ onScanSuccess, onScanFailure }: BarcodeScannerProps) {
  const [isStarting, setIsStarting] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    
    // Auto start the scanner
    html5QrCode.start(
      { facingMode: "environment" }, // Use back camera if available
      {
        fps: 10,
        qrbox: { width: 250, height: 150 }
      },
      (decodedText) => {
        // Success
        onScanSuccess(decodedText);
      },
      (error) => {
        // Failure (this fires very often when it doesn't find a code, so we ignore it usually)
        if (onScanFailure) {
          onScanFailure(error);
        }
      }
    ).then(() => {
      setIsStarting(false);
    }).catch((err) => {
      setIsStarting(false);
      setCameraError("Gagal mengakses kamera. Pastikan browser memiliki izin, atau buka melalui localhost/HTTPS.");
      console.error(err);
    });

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
          html5QrCode.clear();
        }).catch(err => console.error("Failed to stop scanner", err));
      }
    };
  }, [onScanSuccess, onScanFailure]);

  return (
    <div className="w-full relative bg-slate-900 rounded-xl overflow-hidden border border-slate-200 min-h-[250px] flex items-center justify-center">
      {isStarting && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-100 text-slate-500">
          <Loader2 className="animate-spin mb-2" size={24} />
          <span className="text-sm font-semibold">Menyalakan kamera...</span>
        </div>
      )}
      
      {cameraError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-red-50 text-red-600 p-4 text-center">
          <p className="text-sm font-semibold">{cameraError}</p>
        </div>
      )}

      <div id="reader" className="w-full h-full"></div>
    </div>
  );
}
