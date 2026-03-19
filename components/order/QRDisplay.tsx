'use client';

import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Ticket } from 'lucide-react';

interface QRDisplayProps {
    value: string;
    status: string;
}

export default function QRDisplay({ value, status }: QRDisplayProps) {
    const isCompleted = status === 'completed';
    const isExpired = status === 'expired' || status === 'cancelled';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[300px] mx-auto"
        >
            <Card className="bg-white/90 backdrop-blur-sm border-none shadow-2xl overflow-hidden text-slate-900">
                <CardHeader className="text-center pb-2 pt-6">
                    <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center justify-center gap-2">
                        <Ticket className="w-5 h-5" />
                        Pickup Token
                    </CardTitle>
                    <CardDescription className="text-slate-600 font-medium">Scan at the counter</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-8 gap-6">
                    <div className="relative p-4 bg-white rounded-2xl shadow-inner group">
                        <QRCodeSVG
                            value={value}
                            size={180}
                            level="H"
                            includeMargin={false}
                            className={`transition-all duration-1000 ${isExpired ? 'opacity-20 grayscale' : ''}`}
                        />
                        {isCompleted && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[2px]">
                                <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg py-2 px-4 shadow-xl -rotate-12 border-2 border-white uppercase tracking-widest">
                                    Used
                                </Badge>
                            </div>
                        )}
                        {isExpired && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[2px]">
                                <Badge variant="destructive" className="font-black text-lg py-2 px-4 shadow-xl -rotate-12 border-2 border-white uppercase tracking-widest">
                                    Expired
                                </Badge>
                            </div>
                        )}
                    </div>

                    <div className="text-center space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Unique Token</div>
                        <div className="text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                            {value.slice(0, 8)}...{value.slice(-8)}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
