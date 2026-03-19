// FIX: Removed unused imports, added missing AnimatePresence and Download
'use client';

import { useEffect, useState } from 'react';
import { IOrder, IUser, OrderStatus } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    XCircle,
    CheckCircle,
    RotateCcw,
    Loader2,
    Search,
    Calendar,
    User,
    Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function OrderHistory() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await fetch('/api/admin/orders');
                const data = await res.json();
                if (data.success) setOrders(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    // FIX: Replaced 'any' with proper IUser type
    const filtered = orders.filter(o => {
        const user = o.user as IUser;
        const matchesSearch = o._id.toString().includes(searchQuery) ||
            user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // FIX: Replaced 'any' with proper type definition
    type StatusMapEntry = {
        label: string;
        icon: React.ComponentType<{ className?: string }>;
        color: string;
    };

    const statusMap: Record<OrderStatus, StatusMapEntry> = {
        pending: { label: 'Pending', icon: Clock, color: 'bg-muted border-border/40 text-muted-foreground' },
        confirmed: { label: 'Confirmed', icon: RotateCcw, color: 'bg-amber-500/10 border-amber-500/20 text-amber-500' },
        ready: { label: 'Ready', icon: CheckCircle, color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' },
        completed: { label: 'Completed', icon: CheckCircle, color: 'bg-primary/10 border-primary/20 text-primary' },
        expired: { label: 'Expired', icon: XCircle, color: 'bg-destructive/10 border-destructive/20 text-destructive' },
        cancelled: { label: 'Cancelled', icon: XCircle, color: 'bg-destructive/10 border-destructive/20 text-destructive' },
    };

    if (loading) {
        return (
            <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse font-bold uppercase tracking-widest text-[10px]">Retrieving Order Ledger...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-12 pb-20">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase">Order <span className="text-primary italic">Archive</span></h1>
                    <p className="text-muted-foreground font-medium text-sm">Reviewing historical transactions and user interactions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 rounded-2xl gap-2 font-bold px-6 shadow-xl hover:bg-primary/10">
                        <Download className="w-4 h-4" />
                        Export Ledger
                    </Button>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by Order ID or Identity..."
                        className="pl-12 h-14 bg-card/40 border-border/60 rounded-2xl font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'completed', 'pending', 'expired'].map((filter) => (
                        <Button
                            key={filter}
                            variant={statusFilter === filter ? 'default' : 'outline'}
                            onClick={() => setStatusFilter(filter)}
                            className={`h-14 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] ${statusFilter === filter ? 'shadow-xl shadow-primary/20' : 'bg-card/40'}`}
                        >
                            {filter}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {filtered.map((order) => {
                        const style = statusMap[order.status];
                        return (
                            <motion.div
                                key={order._id.toString()}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                            >
                                <Card className="bg-card/40 backdrop-blur-md border border-border/40 hover:border-primary/40 transition-all duration-300 group overflow-hidden">
                                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
                                        {/* Status & ID */}
                                        <div className="flex flex-col gap-3 min-w-[200px]">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${style.color}`}>
                                                <style.icon className="w-3.5 h-3.5" />
                                                {style.label}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-muted-foreground opacity-60">Sequence Unit</p>
                                                <p className="font-mono text-xs font-bold tracking-widest uppercase">#{order._id.toString().slice(-12).toUpperCase()}</p>
                                            </div>
                                        </div>

                                        <div className="w-px h-12 bg-border/20 hidden md:block" />

                                        {/* User Identity */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-muted/30 flex items-center justify-center text-muted-foreground">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    {/* FIX: Replaced 'any' with IUser type */}
                                                    <p className="font-black text-sm tracking-tight capitalize">{(order.user as IUser)?.name || 'Incognito Guest'}</p>
                                                    <p className="text-[10px] text-muted-foreground font-medium">{(order.user as IUser)?.email || 'Anonymous Session'}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {/* FIX: Added proper type guard to check if product is IProduct */}
                                                {order.items.map((item, idx: number) => {
                                                    const product = typeof item.product === 'object' && item.product && 'name' in item.product ? item.product : null;
                                                    return (
                                                        <Badge key={idx} variant="outline" className="bg-muted/10 border-border/20 text-[8px] font-black uppercase tracking-tighter">
                                                            {item.quantity}x {product?.name || 'Unit'}
                                                        </Badge>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="w-px h-12 bg-border/20 hidden md:block" />

                                        {/* Temporal & Value */}
                                        <div className="flex flex-col md:text-right gap-4 min-w-[150px]">
                                            <div className="space-y-0.5">
                                                <div className="flex md:justify-end items-center gap-2 text-muted-foreground">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex md:justify-end items-center gap-2 text-muted-foreground">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-black tracking-widest">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                            <div className="text-3xl font-black text-primary tracking-tighter italic">
                                                ${order.total.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
