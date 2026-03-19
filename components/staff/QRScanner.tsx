// FIX: Replaced 'any' with proper type definition for scanResult
'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, CheckCircle, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface ScanResult {
    success: boolean;
    error?: string;
    data?: {
        _id: string;
    };
}

export default function QRScanner() {
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        scannerRef.current = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        const onScanSuccess = async (decodedText: string) => {
            if (isVerifying) return;
            setIsVerifying(true);

            try {
                const response = await fetch('/api/staff/verify-qr', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ qrCode: decodedText })
                });
                const data = await response.json();

                if (data.success) {
                    setScanResult({ success: true, data: data.data });
                    toast.success('Order Verified!');
                } else {
                    setScanResult({ success: false, error: data.error, data: data.data });
                    toast.error(data.error || 'Verification failed');
                }
            } catch {
                toast.error('Network error during verification');
            } finally {
                setIsVerifying(false);
            }
        };

        const onScanFailure = () => {
            // Silence errors as they happen constantly during seek
        };

        scannerRef.current.render(onScanSuccess, onScanFailure);

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch((err: Error) => console.error("Failed to clear scanner", err));
            }
        };
    }, [isVerifying]);

    const resetScan = () => {
        setScanResult(null);
        // Reinstate scanner if needed, but it stays active unless we clear it.
        // Actually, html5-qrcode implementation details might differ, let's keep it simple.
    };

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <header className="flex items-center gap-4">
                <Link href="/staff">
                    <Button variant="outline" size="icon" className="rounded-full h-12 w-12 hover:bg-primary/10">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-black tracking-tighter">QR VERIFICATION</h1>
                    <p className="text-muted-foreground text-sm font-medium">Verify pickup tokens instantly.</p>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {scanResult ? (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="p-8 rounded-[2rem] bg-card/60 backdrop-blur-xl border border-border/40 shadow-2xl flex flex-col items-center text-center gap-8"
                    >
                        {scanResult.success ? (
                            <>
                                <div className="p-6 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/10">
                                    <CheckCircle className="w-16 h-16" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black tracking-tighter text-emerald-500 uppercase">Verified</h2>
                                    <p className="font-mono text-xs opacity-60">ORDER #{scanResult.data?._id.toString().slice(-8).toUpperCase()}</p>
                                </div>
                                <div className="w-full p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between font-bold">
                                    <span>Customer Ready</span>
                                    <span className="text-emerald-500">Pick up now</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="p-6 rounded-full bg-destructive/10 text-destructive border border-destructive/10">
                                    <XCircle className="w-16 h-16" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black tracking-tighter text-destructive uppercase">Error</h2>
                                    <p className="font-bold text-lg opacity-80">{scanResult.error}</p>
                                    {scanResult.data?._id && (
                                        <p className="font-mono text-xs opacity-60">ORDER #{scanResult.data._id.toString().slice(-8).toUpperCase()}</p>
                                    )}
                                </div>
                                <div className="w-full p-4 rounded-3xl bg-destructive/5 text-destructive font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Strike Applied Automatically
                                </div>
                            </>
                        )}

                        <Button
                            onClick={resetScan}
                            className={`w-full h-16 text-xl font-black gap-2 transition-all duration-500 ${scanResult.success ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-primary'}`}
                        >
                            <RefreshCw className="w-6 h-6" />
                            Next Customer
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="scanner"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-card/40 backdrop-blur-md shadow-2xl"
                    >
                        <div id="reader" className="overflow-hidden" />

                        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-background to-transparent pointer-events-none">
                            <div className="flex items-center justify-center gap-3 text-muted-foreground animate-pulse">
                                <span className="w-2 h-2 rounded-full bg-primary" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Scanning for QR Tokens...</span>
                            </div>
                        </div>

                        {isVerifying && (
                            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-50">
                                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                                <p className="font-black text-sm uppercase tracking-widest text-primary animate-pulse">Verifying...</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
