// FIX: Removed unused imports
'use client';

import { useState, useEffect, useCallback } from 'react';
import { IOrder } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, CheckCircle, Clock, ChevronRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function OrderQueue() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await fetch('/api/staff/orders');
            const data = await res.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error("Fetch orders failed", error);
        } finally {
            if (!silent) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(() => fetchOrders(true), 15000);
        return () => clearInterval(interval);
    }, [fetchOrders]);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                // FIX: Replaced 'any' with proper OrderStatus type from types
                setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus as IOrder['status'] } : o));
                toast.success(`Order #${id.slice(-4)} updated to ${newStatus}`);
            } else {
                toast.error(data.error || 'Failed to update order');
            }
        } catch {
            toast.error('Something went wrong');
        }
    };

    if (loading && orders.length === 0) {
        return (
            <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse font-medium uppercase tracking-[0.2em] text-xs">Synchronizing Queue...</p>
            </div>
        );
    }

    const pendingOrders = orders.filter(o => o.status === 'pending');
    const confirmedOrders = orders.filter(o => o.status === 'confirmed');
    const readyOrders = orders.filter(o => o.status === 'ready');

    // FIX: Replaced 'any' with proper type definition
    interface ColumnProps {
        title: string;
        icon: React.ComponentType<{ className?: string }>;
        color: string;
        list: IOrder[];
        nextStatus?: string;
        nextLabel?: string;
    }

    const Column = ({ title, icon: Icon, color, list, nextStatus, nextLabel }: ColumnProps) => (
        <div className="flex flex-col gap-6">
            <div className={`p-4 rounded-3xl border flex items-center justify-between shadow-sm ${color}`}>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-background/50 backdrop-blur-sm">
                        <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-black uppercase tracking-widest text-[10px]">{title}</span>
                </div>
                <Badge variant="outline" className="bg-background/20 font-black border-none">{list.length}</Badge>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {list.map((order: IOrder) => (
                        <motion.div
                            key={order._id.toString()}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <Card className="bg-card/40 backdrop-blur-md border-border/40 hover:border-primary/40 transition-all duration-300 group shadow-lg">
                                <CardHeader className="pb-3 border-b border-border/10">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <CardTitle className="text-xs font-black text-muted-foreground uppercase flex items-center gap-2">
                                                <ShoppingBag className="w-3 h-3 text-primary" />
                                                Order #{order._id.toString().slice(-6).toUpperCase()}
                                            </CardTitle>
                                            <CardDescription className="text-[10px] font-bold">
                                                Placed: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </CardDescription>
                                        </div>
                                        <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase py-0.5 px-2">
                                            {order.items.reduce((a, b) => a + b.quantity, 0)} Items
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="py-4 space-y-3">
                                    {/* FIX: Added proper type guard to check if product is IProduct */}
                                    {order.items.map((item, idx: number) => {
                                        const product = typeof item.product === 'object' && item.product && 'name' in item.product ? item.product : null;
                                        return (
                                            <div key={idx} className="flex justify-between items-start text-xs bg-muted/20 p-2.5 rounded-xl border border-border/20 group-hover:bg-muted/30 transition-colors">
                                                <div className="font-bold flex gap-2 items-center">
                                                    <span className="text-primary">{item.quantity}x</span>
                                                    <span className="text-foreground/90">{product?.name || 'Item'}</span>
                                                </div>
                                                <div className="text-[9px] uppercase tracking-tighter text-muted-foreground hidden sm:block">
                                                    {item.customizations.size} {item.customizations.sugarLevel} {item.customizations.iceOption}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </CardContent>
                                <CardFooter className="pt-2">
                                    {nextStatus && (
                                        <Button
                                            size="sm"
                                            className="w-full font-bold uppercase tracking-widest text-[10px] h-10 gap-2 shadow-inner"
                                            onClick={() => updateStatus(order._id.toString(), nextStatus)}
                                        >
                                            {nextLabel}
                                            <ChevronRight className="w-3 h-3" />
                                        </Button>
                                    )}
                                    {order.status === 'ready' && (
                                        <div className="w-full flex flex-col items-center gap-1">
                                            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center w-full gap-2 border border-emerald-500/10">
                                                <Clock className="w-4 h-4 animate-pulse" />
                                                <span className="text-[10px] font-black uppercase">Awaiting Scan</span>
                                            </div>
                                        </div>
                                    )}
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );

    return (
        <div className="max-w-[1600px] mx-auto space-y-12">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">ORDER <span className="text-primary italic">QUEUE</span></h1>
                    <p className="text-muted-foreground font-medium text-sm">Managing the workflow for today&apos;s brews.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => fetchOrders()} className="h-10 rounded-2xl gap-2 font-bold px-4 hover:bg-primary/10">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                <Column
                    title="Inbound Requests"
                    icon={RefreshCw}
                    color="bg-muted/40 border-muted-foreground/10 text-muted-foreground/80"
                    list={pendingOrders}
                    nextStatus="confirmed"
                    nextLabel="Acknowledge Order"
                />
                <Column
                    title="Active Brewing"
                    icon={Clock}
                    color="bg-amber-500/10 border-amber-500/20 text-amber-500"
                    list={confirmedOrders}
                    nextStatus="ready"
                    nextLabel="Mark as Ready"
                />
                <Column
                    title="Ready for Pickup"
                    icon={CheckCircle}
                    color="bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                    list={readyOrders}
                />
            </div>
        </div>
    );
}
