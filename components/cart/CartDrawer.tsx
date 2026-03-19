'use client';

import Image from 'next/image';
import { useCartStore } from '@/store/cart.store';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartDrawer({ children }: { children: React.ReactNode }) {
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
    const router = useRouter();

    const handleCheckout = () => {
        router.push('/checkout');
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md bg-card/60 backdrop-blur-xl flex flex-col p-0 border-l border-border/20">
                <SheetHeader className="p-6 border-b border-border/20">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tighter italic">
                            <ShoppingCart className="w-6 h-6 text-primary" />
                            Active <span className="text-foreground italic">Cart</span>
                        </SheetTitle>
                        <Button variant="ghost" size="sm" onClick={clearCart} disabled={items.length === 0} className="hover:text-destructive transition-colors font-bold text-[10px] uppercase tracking-widest gap-2">
                            <Trash2 className="w-4 h-4" />
                            Clear
                        </Button>
                    </div>
                </SheetHeader>

                <ScrollArea className="flex-grow p-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                            <div className="p-6 rounded-3xl bg-primary/5 text-primary/20 border border-primary/10">
                                <ShoppingCart className="w-16 h-16" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-black text-lg uppercase tracking-widest italic opacity-40">Cart is empty</p>
                                <p className="text-xs text-muted-foreground font-medium">Your coffee adventure starts on the menu.</p>
                            </div>
                            <Button variant="link" onClick={() => router.push('/menu')} className="font-black text-primary uppercase text-[10px] tracking-widest">Browse Menu</Button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {items.map((item, index) => (
                                <div key={index} className="flex gap-4 group">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-border/20 shadow-lg">
                                        <Image src={item.productImage} alt={item.productName} width={80} height={80} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                                    </div>
                                    <div className="flex-grow space-y-1">
                                        <div className="flex justify-between font-black text-sm tracking-tight uppercase italic">
                                            <span>{item.productName}</span>
                                            <span className="text-primary">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex flex-wrap gap-x-2 opacity-60">
                                            {item.customizations.size && <span>{item.customizations.size}</span>}
                                            {item.customizations.sugarLevel && <span className="before:content-['•'] before:mr-2">{item.customizations.sugarLevel} Sugar</span>}
                                            {item.customizations.iceOption && <span className="before:content-['•'] before:mr-2">{item.customizations.iceOption} Ice</span>}
                                        </div>
                                        <div className="flex items-center gap-4 mt-4">
                                            <div className="flex items-center bg-muted/30 border border-border/10 rounded-xl overflow-hidden shadow-inner">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-none hover:bg-primary/10 hover:text-primary transition-colors"
                                                    onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>
                                                <span className="w-8 text-center text-[10px] font-black tabular-nums">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-none hover:bg-primary/10 hover:text-primary transition-colors"
                                                    onClick={() => updateQuantity(index, item.quantity + 1)}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-[10px] font-black uppercase text-muted-foreground hover:text-destructive h-8 px-2 tracking-widest"
                                                onClick={() => removeItem(index)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <SheetFooter className="p-8 border-t border-border/20 bg-background/60 shadow-2xl">
                    <div className="w-full space-y-6">
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Subtotal Estimation</span>
                                <div className="text-3xl font-black text-primary tracking-tighter italic">
                                    ${getTotal().toFixed(2)}
                                </div>
                            </div>
                        </div>
                        <Button
                            className="w-full h-14 font-black uppercase tracking-tighter italic text-lg gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                            disabled={items.length === 0}
                            onClick={handleCheckout}
                        >
                            Proceed to Checkout
                            <ArrowRight className="w-5 h-5 ml-1" />
                        </Button>
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                            <div className="text-[10px] text-primary/60 font-medium leading-relaxed">
                                {/* FIX: Escaped quotes to fix react/no-unescaped-entities */}
                                Pick up within <span className="font-black">30 minutes</span> of your status turning &quot;Ready&quot; to avoid account strikes.
                            </div>
                        </div>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
