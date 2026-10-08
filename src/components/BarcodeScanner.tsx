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
            const createScanner = () => {
                return new Html5Qrcode('reader', {
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
                    ],
                });
            };

            html5QrCode = createScanner();

            const config = {
                fps: 10,
                qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
                    return {
                        width: Math.floor(viewfinderWidth * 0.85),
                        height: Math.floor(Math.min(250, viewfinderHeight * 0.5)),
                    };
                },
            };

            const successCallback = (decodedText: string) => {
                if (isComponentMounted) onScanSuccess(decodedText);
            };

            const errorCallback = (error: any) => {
                if (isComponentMounted && onScanFailure) {
                    onScanFailure(error);
                }
            };

            const startCamera = async () => {
                try {
                    // Attempt 1: High resolution for better distant scanning
                    await html5QrCode!.start({ facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } as MediaTrackConstraints, config, successCallback, errorCallback);
                } catch (err1) {
                    console.warn('High-res camera request failed, falling back to standard constraints:', err1);
                    if (!isComponentMounted) return;

                    try {
                        if (html5QrCode?.isScanning) {
                            await html5QrCode.stop();
                        }
                        html5QrCode?.clear();
                    } catch (e) {
                        console.warn('Cleanup error (safe to ignore):', e);
                    }

                    if (!isComponentMounted) return;

                    try {
                        // Re-instantiate for attempt 2 to avoid "already under transition" error
                        html5QrCode = createScanner();
                        // Attempt 2: Basic environment camera (fixes iPhone constraint errors)
                        await html5QrCode!.start({ facingMode: 'environment' }, config, successCallback, errorCallback);
                    } catch (err2) {
                        throw err2;
                    }
                }
            };

            startPromise = startCamera();

            startPromise
                .then(() => {
                    if (isComponentMounted) {
                        setIsStarting(false);
                    } else {
                        // Component unmounted while starting, stop it now
                        html5QrCode
                            ?.stop()
                            .then(() => html5QrCode?.clear())
                            .catch(console.error);
                    }
                })
                .catch((err) => {
                    if (isComponentMounted) {
                        setIsStarting(false);
                        setCameraError('Gagal mengakses kamera. Pastikan browser memiliki izin, atau buka melalui localhost/HTTPS. Error: ' + (err?.message || err));
                        console.error('Camera start error:', err);
                    }
                });
        } catch (e) {
            console.error('Failed to initialize Html5Qrcode', e);
        }

        return () => {
            isComponentMounted = false;
            if (html5QrCode) {
                if (html5QrCode.isScanning) {
                    html5QrCode
                        .stop()
                        .then(() => {
                            html5QrCode?.clear();
                        })
                        .catch((err) => console.error('Failed to stop scanner', err));
                }
                // If it's not scanning but startPromise is running,
                // the .then() block above will handle the cleanup.
            }
        };
    }, [onScanSuccess, onScanFailure]);

    return (
        <div className="w-full relative bg-slate-900 rounded-xl overflow-hidden border border-slate-200 min-h-[250px] flex items-center justify-center">
            {isStarting && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-100 text-slate-500">
                    <Loader2 className="animate-spin mb-2" size={24} />
                    <span className="text-sm font-semibold">Menyalakan kamera...</span>
                </div>
            )}

            {cameraError && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-red-50 text-red-600 p-4 text-center">
                    <p className="text-sm font-semibold">{cameraError}</p>
                </div>
            )}

            <style>{`
        #reader video {
          object-fit: cover !important;
          width: 100% !important;
          border-radius: 0.75rem !important; /* rounded-xl */
        }
        /* Hide the default shaded region drawn by html5-qrcode */
        #qr-shaded-region {
          display: none !important;
        }
        /* If there's a duplicate video somehow due to React Strict Mode, hide it */
        #reader video ~ video {
          display: none !important;
        }
      `}</style>

            <div id="reader" className="w-full mx-auto"></div>

            {/* Custom UI Overlay for Barcode Scanner */}
            {!isStarting && !cameraError && (
                <div className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center">
                    {/* The scanning reticle with 4 corners */}
                    <div
                        className="relative"
                        style={{
                            width: '85%',
                            height: '250px',
                            maxHeight: '50%',
                            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                            borderRadius: '12px',
                        }}
                    >
                        {/* Top Left Corner */}
                        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-xl"></div>
                        {/* Top Right Corner */}
                        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-xl"></div>
                        {/* Bottom Left Corner */}
                        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-xl"></div>
                        {/* Bottom Right Corner */}
                        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-xl"></div>

                        {/* Optional: Add a scanning laser animation line */}
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500 opacity-50 shadow-[0_0_8px_2px_rgba(239,68,68,0.5)] animate-[scan_2s_ease-in-out_infinite]"></div>
                    </div>

                    {/* Helper text overlay at the bottom */}
                    <div className="absolute bottom-6 left-0 right-0 text-center">
                        <span className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">Arahkan kamera ke barcode produk</span>
                    </div>
                </div>
            )}

            {/* Define the scanning animation */}
            <style>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
}
