import { useEffect, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Loader2 } from 'lucide-react';

interface BarcodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: any) => void;
}

export function BarcodeScanner({ onScanSuccess, onScanFailure }: BarcodeScannerProps) {
  const [isStarting, setIsStarting] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let isComponentMounted = true;
    let html5QrCode: Html5Qrcode | null = null;
    let startPromise: Promise<any> | null = null;

    try {
      html5QrCode = new Html5Qrcode("reader", {
        verbose: false,
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.CODE_93,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.ITF,
          Html5QrcodeSupportedFormats.CODABAR,
        ]
      });
      
      // Auto start the scanner
      startPromise = html5QrCode.start(
        { 
          facingMode: "environment",
          width: { ideal: 1920 }, // Higher resolution for sharper distant scanning
          height: { ideal: 1080 }
        } as MediaTrackConstraints,
        {
          fps: 10,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            // Make the scanning box responsive, wide enough for 1D barcodes
            return {
              width: Math.floor(viewfinderWidth * 0.85),
              height: Math.floor(Math.min(250, viewfinderHeight * 0.5))
            };
          },
        },
        (decodedText) => {
          // Success
          if (isComponentMounted) onScanSuccess(decodedText);
        },
        (error) => {
          // Failure (this fires very often when it doesn't find a code, so we ignore it usually)
          if (isComponentMounted && onScanFailure) {
            onScanFailure(error);
          }
        }
      );

      startPromise.then(() => {
        if (isComponentMounted) {
          setIsStarting(false);
        } else {
          // Component unmounted while starting, stop it now
          html5QrCode?.stop().then(() => html5QrCode?.clear()).catch(console.error);
        }
      }).catch((err) => {
        if (isComponentMounted) {
          setIsStarting(false);
          setCameraError("Gagal mengakses kamera. Pastikan browser memiliki izin, atau buka melalui localhost/HTTPS.");
          console.error(err);
        }
      });
    } catch (e) {
      console.error("Failed to initialize Html5Qrcode", e);
    }

    return () => {
      isComponentMounted = false;
      if (html5QrCode) {
        if (html5QrCode.isScanning) {
          html5QrCode.stop().then(() => {
            html5QrCode?.clear();
          }).catch(err => console.error("Failed to stop scanner", err));
        }
        // If it's not scanning but startPromise is running, 
        // the .then() block above will handle the cleanup.
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

      <style>{`
        #reader video {
          object-fit: cover !important;
          width: 100% !important;
          border-radius: 0.75rem !important; /* rounded-xl */
        }
        /* If there's a duplicate video somehow due to React Strict Mode, hide it */
        #reader video ~ video {
          display: none !important;
        }
      `}</style>
      <div id="reader" className="w-full mx-auto"></div>
    </div>
  );
}
