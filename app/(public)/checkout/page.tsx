'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart.store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Loader2, AlertTriangle, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useState } from 'react';
import { ExtendedUser } from '@/types';
import { isSuspended } from '@/lib/strikes';

export default function CheckoutPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { items, getTotal, clearCart } = useCartStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (status === 'loading') {
        return (
            <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse font-black uppercase tracking-widest text-[10px]">Authorizing Transaction...</p>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        router.push(`/login?callbackUrl=/checkout`);
        return null;
    }

    const { suspendedUntil } = (session?.user as ExtendedUser) || {};
    const isUserSuspended = isSuspended(suspendedUntil);

    if (isUserSuspended) {
        return (
            <div className="container px-4 py-20 flex flex-col items-center text-center gap-8 max-w-xl mx-auto">
                <div className="p-8 rounded-[2rem] bg-destructive/10 text-destructive border border-destructive/20 shadow-2xl flex flex-col items-center gap-6">
                    <AlertTriangle className="w-16 h-16 animate-bounce" />
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic">Account Locked</h1>
                        <p className="text-muted-foreground font-bold text-sm tracking-tight leading-relaxed">
                            Your account has been suspended due to excessive no-show orders.
                            Access resumes on <span className="text-destructive">{new Date(suspendedUntil!).toLocaleString()}</span>.
                        </p>
                    </div>
                    <Button asChild variant="outline" className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] border-destructive/20 hover:bg-destructive/10">
                        <Link href="/menu">Return to Marketplace</Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container px-4 py-20 flex flex-col items-center text-center gap-8 max-w-xl mx-auto">
                <div className="p-8 rounded-[2rem] bg-card/40 backdrop-blur-md border border-border/40 shadow-xl flex flex-col items-center gap-6">
                    <div className="p-6 rounded-3xl bg-primary/5 text-primary/30 border border-primary/10">
                        <ShoppingBag className="w-16 h-16" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic">Manifest Empty</h1>
                        <p className="text-muted-foreground font-medium text-sm tracking-tight">Add some sensory components to your cart to begin the sequence.</p>
                    </div>
                    <Button asChild className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] italic shadow-lg shadow-primary/20">
                        <Link href="/menu">Explore Menu</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items, subtotal: getTotal(), total: getTotal() })
            });
            const data = await response.json();

            if (data.success) {
                toast.success('Order Sequence Initiated!');
                clearCart();
                router.push(`/order/${data.data._id}`);
            } else {
                toast.error(data.error || 'Sequence failure. Check availability.');
            }
        } catch (error: unknown) {
            toast.error((error as Error).message || 'Server-side protocol error.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container px-4 py-10 max-w-2xl mx-auto space-y-10">
            <header className="flex flex-col gap-4">
                <Link href="/menu" className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Abort Sequence / Back to Menu
                </Link>
                <h1 className="text-5xl font-black tracking-tighter uppercase italic">Order <span className="text-primary italic">Checkout</span></h1>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
                <Card className="bg-card/40 backdrop-blur-3xl border-border/40 shadow-2xl overflow-hidden rounded-[2rem]">
                    <CardHeader className="p-8 border-b border-border/10">
                        <CardTitle className="text-lg font-black uppercase tracking-tighter italic flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                            Manifest Verification
                        </CardTitle>
                        <CardDescription className="text-xs font-medium">Verify your selection before executing the order.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="space-y-6">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex gap-4 group">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border/20 shadow-md">
                                        <Image src={item.productImage} alt={item.productName} width={64} height={64} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                                    </div>
                                    <div className="flex-grow space-y-1">
                                        <div className="flex justify-between font-black text-sm tracking-tight uppercase italic transition-colors group-hover:text-primary">
                                            <div className="flex items-center gap-2">
                                                <span className="text-primary opacity-60 tabular-nums">{item.quantity}×</span>
                                                <span>{item.productName}</span>
                                            </div>
                                            <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                                        </div>
                                        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex flex-wrap gap-x-2 opacity-50">
                                            {item.customizations.size} {item.customizations.sugarLevel} Sugar {item.customizations.iceOption} Ice
                                            {item.customizations.addOns && item.customizations.addOns.length > 0 && (
                                                <span className="text-primary/60">+ {item.customizations.addOns.join(', ')}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Separator className="bg-border/20" />

                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Subtotal</span>
                                <span className="font-bold tabular-nums text-sm">${getTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center p-6 rounded-3xl bg-primary/5 border border-primary/20 shadow-inner">
                                <span className="text-lg font-black uppercase tracking-tighter italic">Total Value</span>
                                <span className="text-3xl font-black text-primary tracking-tighter tabular-nums">${getTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="p-8 pt-0 flex flex-col gap-6">
                        <Button
                            className="w-full h-16 text-xl font-black uppercase tracking-tighter italic gap-3 shadow-2xl shadow-primary/30 hover:scale-[1.01] transition-transform active:scale-95 duration-300"
                            size="lg"
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Synchronizing Protocol...
                                </>
                            ) : (
                                <>
                                    Execute Order
                                    <ArrowRight className="w-6 h-6 ml-1 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </Button>
                        <div className="p-4 rounded-2xl bg-muted/20 border border-border/10 flex items-start gap-4">
                            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-widest text-amber-500/80">Automated Striking Protocol Active</p>
                                <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                                    By executing, you acknowledge the <span className="font-black">30-minute pickup window</span>. Missing this window will result in a strike. 3 strikes lead to a 24h account lock.
                                </p>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
