'use client';

import Image from 'next/image';

// FIX: Removed unused IOrderItem import
import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { IOrder, IProduct } from '@/types';
import QRDisplay from '@/components/order/QRDisplay';
import CountdownTimer from '@/components/order/CountdownTimer';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, RefreshCw, XCircle, CheckCircle, Coffee, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function OrderPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<IOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrder = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await fetch(`/api/orders/${id}`);
            const data = await res.json();
            if (data.success) {
                setOrder(data.data);
                setError('');
            } else {
                setError(data.error);
            }
        } catch (err: unknown) {
            setError((err as Error).message || 'Failed to sync with command center.');
        } finally {
            if (!silent) setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchOrder();
    }, [id, fetchOrder]);

    useEffect(() => {
        if (!order || ['completed', 'expired', 'cancelled'].includes(order.status)) return;

        const interval = setInterval(() => {
            fetchOrder(true);
        }, 10000);

        return () => clearInterval(interval);
    }, [order, fetchOrder]);

    if (loading && !order) {
        return (
            <div className="flex h-[70vh] flex-col items-center justify-center gap-6">
                <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <Coffee className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/40" />
                </div>
                <p className="text-muted-foreground animate-pulse font-black uppercase tracking-[0.2em] text-[10px]">Synchronizing Order Data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container px-4 py-20 flex flex-col items-center text-center gap-8 max-w-xl mx-auto">
                <div className="p-8 rounded-[2rem] bg-destructive/10 text-destructive border border-destructive/20 shadow-2xl flex flex-col items-center gap-6">
                    <XCircle className="w-16 h-16" />
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic">Protocol Error</h1>
                        <p className="text-muted-foreground font-bold text-sm tracking-tight">{error}</p>
                    </div>
                    <Button asChild variant="outline" className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] border-destructive/20 hover:bg-destructive/10">
                        <Link href="/menu">Return to Marketplace</Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (!order) return null;

    const statusMap = {
        pending: { label: 'Awaiting Confirmation', icon: <Loader2 className="w-4 h-4 animate-spin" />, color: 'bg-muted border-border/40 text-muted-foreground' },
        confirmed: { label: 'Brewing in Progress', icon: <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />, color: 'bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-amber-500/5' },
        ready: { label: 'Ready for Pickup', icon: <CheckCircle className="w-4 h-4 text-emerald-500" />, color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-emerald-500/5' },
        completed: { label: 'Pickup Successful', icon: <CheckCircle className="w-4 h-4 text-primary" />, color: 'bg-primary/10 border-primary/20 text-primary shadow-primary/5' },
        expired: { label: 'Pickup Window Lapsed', icon: <XCircle className="w-4 h-4 text-destructive" />, color: 'bg-destructive/10 border-destructive/20 text-destructive' },
        cancelled: { label: 'Order Terminated', icon: <XCircle className="w-4 h-4 text-destructive" />, color: 'bg-destructive/10 border-destructive/20 text-destructive' },
    };

    const statusStyle = statusMap[order.status as keyof typeof statusMap];

    return (
        <div className="container px-4 py-10 max-w-2xl mx-auto space-y-12 pb-20">
            <header className="flex flex-col gap-6 items-center text-center">
                <Link href="/menu" className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors group self-start">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Marketplace
                </Link>

                <div className="space-y-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={order.status}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full border shadow-xl font-black uppercase tracking-widest text-[10px] italic ${statusStyle.color}`}
                        >
                            {statusStyle.icon}
                            {statusStyle.label}
                        </motion.div>
                    </AnimatePresence>
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic">Order <span className="text-primary">Status</span></h1>
                    <p className="text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase opacity-40">Verification Token ID: #{order._id.toString().slice(-12).toUpperCase()}</p>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-12">
                {/* QR Section */}
                <div className="space-y-8 flex flex-col items-center">
                    <div className="p-4 rounded-[3rem] bg-card/40 backdrop-blur-md border border-border/40 shadow-2xl relative group">
                        <QRDisplay value={order.qrCode} status={order.status} />
                        <div className="absolute inset-0 rounded-[3rem] border-2 border-primary/10 group-hover:border-primary/30 transition-colors pointer-events-none" />
                    </div>
                    <div className="text-center space-y-3 px-8">
                        <p className="text-xs font-bold text-muted-foreground leading-relaxed max-w-sm mx-auto">
                            Present this encrypted token to the barista to authorize your pickup.
                        </p>
                        <div className="inline-flex items-center gap-2 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                            <Clock className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">30-Minute Security Window Active</span>
                        </div>
                    </div>
                </div>

                {/* Status & Summary Cards */}
                <div className="space-y-6">
                    <CountdownTimer expiresAt={order.expiresAt} status={order.status} />

                    <Card className="bg-card/40 backdrop-blur-md border-border/40 shadow-xl overflow-hidden rounded-[2rem]">
                        <CardHeader className="p-8 border-b border-border/10 bg-muted/5">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg font-black uppercase tracking-tighter italic">Selection Manifest</CardTitle>
                                <div className="text-3xl font-black text-primary tracking-tighter italic">${order.total.toFixed(2)}</div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-4">
                                {/* FIX: Replaced 'any' type with proper IOrderItem type from order.items */}
                                {order.items.map((item, idx: number) => {
                                    const product = item.product as IProduct;
                                    return (
                                        <div key={idx} className="flex gap-4 group">
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-border/20 shadow-md">
                                                <Image src={product?.imageUrl || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=200'} alt={product?.name || 'Unknown'} width={56} height={56} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                                            </div>
                                            <div className="flex-grow space-y-1">
                                                <div className="flex justify-between font-black text-sm tracking-tight uppercase italic group-hover:text-primary transition-colors">
                                                    <span>{item.quantity}x {product?.name || 'Unknown Protocol'}</span>
                                                    <span className="opacity-60 tabular-nums">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                                                </div>
                                                <div className="text-[9px] text-muted-foreground uppercase font-black tracking-widest flex flex-wrap gap-x-2 opacity-50">
                                                    {item.customizations.size} {item.customizations.sugarLevel} {item.customizations.iceOption}
                                                    {item.customizations.addOns && item.customizations.addOns.length > 0 && (
                                                        <span className="text-primary/40">+ {item.customizations.addOns.join(', ')}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
