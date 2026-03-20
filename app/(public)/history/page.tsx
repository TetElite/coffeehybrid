'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Loader2, Calendar, DollarSign, Package, ArrowRight, Clock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IOrder } from '@/types';

// Extend IOrder slightly for display or map correctly
interface HistoryOrder extends IOrder {
    itemsCount: number;
}

export default function OrderHistoryPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<HistoryOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=/history');
            return;
        }

        if (status === 'authenticated') {
            fetchOrders();
        }
    }, [status, router]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
             console.log(data); // Debugging

            if (data.success) {
                // Assuming data.data is an array of orders
                // We might need to adjust based on the exact API response shape from GET /api/orders
                setOrders(data.data.map((order: any) => ({
                    ...order,
                    itemsCount: order.items.reduce((acc: number, item: any) => acc + item.quantity, 0)
                })));
            } else {
                setError(data.error || 'Failed to load orders');
            }
        } catch (err) {
            setError('An error occurred while fetching orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) { // 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled' | 'expired'
            case 'completed': return 'default'; // dark/primary
            case 'ready': return 'secondary'; // green-ish in custom CSS maybe, or secondary
            case 'confirmed': return 'outline';
            case 'pending': return 'secondary';
            case 'cancelled': return 'destructive';
            case 'expired': return 'destructive';
            default: return 'outline';
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading your history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container max-w-4xl py-10 px-4 text-center">
                <div className="p-6 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive">
                    <Info className="h-10 w-10 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
                    <p>{error}</p>
                    <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary/10 pb-20">
            <div className="bg-background border-b border-border/50 py-12">
                <div className="container max-w-5xl px-4">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Order History</h1>
                    <p className="text-muted-foreground">View and track all your past coffee orders.</p>
                </div>
            </div>

            <div className="container max-w-5xl px-4 py-8">
                {orders.length === 0 ? (
                    <div className="text-center py-20 px-4 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                            <Package className="h-10 w-10" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">No past orders</h2>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                            Looks like you haven&apos;t ordered anything yet. Time to get some coffee!
                        </p>
                        <Button size="lg" asChild className="rounded-full px-8">
                            <Link href="/menu">Browse Menu</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                        {orders.map((order) => (
                            <Card key={order._id} className="group overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                                <CardHeader className="bg-secondary/20 pb-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                                                Order #{order._id.toString().slice(-6)}
                                            </p>
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                {format(new Date(order.createdAt), 'MMM d, yyyy')}
                                                <span className="text-muted-foreground text-sm font-normal">
                                                    at {format(new Date(order.createdAt), 'h:mm a')}
                                                </span>
                                            </CardTitle>
                                        </div>
                                        <Badge variant={getStatusVariant(order.status) as any} className="capitalize px-3 py-1">
                                            {order.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                                                <Package className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground font-medium">Items</p>
                                                <p className="font-semibold text-lg">{order.itemsCount}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                                                <DollarSign className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground font-medium">Total</p>
                                                <p className="font-semibold text-lg">${order.total?.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-2 bg-secondary/5 border-t border-border/30">
                                    <Button asChild className="w-full group-hover:bg-primary group-hover:text-white transition-colors" variant="ghost">
                                        <Link href={`/order/${order._id}`}>
                                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
