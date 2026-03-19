'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock as ClockIcon, AlertCircle as AlertCircleIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CountdownTimerProps {
    expiresAt: string | Date;
    status: string;
}

export default function CountdownTimer({ expiresAt, status }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [percentage, setPercentage] = useState<number>(100);

    const isRunning = status === 'pending' || status === 'confirmed' || status === 'ready';

    useEffect(() => {
        if (!isRunning) return;

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const expiration = new Date(expiresAt).getTime();
            const difference = expiration - now;

            if (difference <= 0) {
                setTimeLeft(0);
                setPercentage(0);
                return;
            }

            setTimeLeft(Math.floor(difference / 1000));
            // Calculating percentage assuming 30 min (1800s) default window
            const originalWindow = 1800; // seconds
            setPercentage(Math.min(100, (difference / 1000 / originalWindow) * 100));
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();

        return () => clearInterval(timer);
    }, [expiresAt, isRunning]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (timeLeft <= 0 && isRunning) {
        // Only show expired if it was running and reached 0
        const isActuallyExpired = new Date(expiresAt).getTime() < new Date().getTime();
        if (isActuallyExpired) {
            return (
                <div className="flex flex-col items-center gap-4 py-8 bg-destructive/10 rounded-2xl border border-destructive/20 text-destructive text-center">
                    <AlertCircleIcon className="w-8 h-8" />
                    <div className="space-y-1">
                        <p className="font-bold text-lg">Order Expired</p>
                        <p className="text-sm px-4">Pickup window has closed. A strike was applied.</p>
                    </div>
                </div>
            );
        }
    }

    if (!isRunning) return null;

    const isLowTime = timeLeft < 300; // < 5 mins

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full max-w-md mx-auto p-6 rounded-2xl border ${isLowTime ? 'border-destructive/30 bg-destructive/5' : 'border-primary/20 bg-primary/5'} flex flex-col items-center gap-6 shadow-xl`}
        >
            <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-muted-foreground font-black uppercase tracking-widest text-[10px]">
                    <ClockIcon className="w-3 h-3" />
                    Pickup Window Closing In
                </div>
                <div className={`text-5xl font-black tabular-nums tracking-tighter ${isLowTime ? 'text-destructive' : 'text-primary'}`}>
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="w-full space-y-2">
                <Progress
                    value={percentage}
                    className={`h-2.5 ${isLowTime ? '[&>div]:bg-destructive' : '[&>div]:bg-primary'}`}
                />
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                    <span>Just Ordered</span>
                    <span>No-Show Strike</span>
                </div>
            </div>
        </motion.div>
    );
}
