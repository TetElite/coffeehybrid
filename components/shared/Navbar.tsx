'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Coffee, ShoppingCart, LogOut, Menu as MenuIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart.store';
import CartDrawer from '@/components/cart/CartDrawer';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ExtendedUser } from '@/types';

export default function Navbar() {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const { items } = useCartStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const isLoggedIn = status === 'authenticated';
    const role = (session?.user as ExtendedUser | undefined)?.role || 'customer';

    const NavLinks = [
        { href: '/menu', label: 'Menu' },
        ...(isLoggedIn && (role === 'staff' || role === 'admin') ? [{ href: '/staff', label: 'Staff Portal' }] : []),
        ...(isLoggedIn && role === 'admin' ? [{ href: '/admin', label: 'Admin View' }] : []),
    ];

    return (
        <nav className="sticky top-0 z-50 w-full bg-background/60 backdrop-blur-xl border-b border-border/40">
            <div className="container px-4 h-16 flex items-center justify-between mx-auto">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        <Coffee className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        CoffeeHybrid <span className="text-primary font-black">v2</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    {NavLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <CartDrawer>
                        <Button variant="ghost" size="icon" className="relative hover:bg-primary/5">
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <Badge className="absolute -top-1.5 -right-1.5 h-4.5 min-w-[18px] flex items-center justify-center p-0.5 text-[10px] bg-primary border-none font-bold">
                                    {cartCount}
                                </Badge>
                            )}
                        </Button>
                    </CartDrawer>

                    {isLoggedIn ? (
                        <div className="flex items-center gap-2 ml-2">
                            <span className="hidden lg:inline text-xs font-semibold text-muted-foreground truncate max-w-[100px]">
                                {session.user?.name || session.user?.email}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => signOut()}
                                className="hover:text-destructive hover:bg-destructive/5 transition-colors"
                                title="Sign Out"
                            >
                                <LogOut className="w-4.5 h-4.5" />
                            </Button>
                        </div>
                    ) : (
                        <Button variant="default" size="sm" asChild className="ml-2 font-bold px-4 h-9 shadow-sm">
                            <Link href="/login">Sign In</Link>
                        </Button>
                    )}

                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-background border-b border-border/20 p-4 space-y-4"
                >
                    {NavLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-sm font-medium p-2 hover:bg-muted rounded-lg"
                        >
                            {link.label}
                        </Link>
                    ))}
                    {!isLoggedIn && (
                        <Button className="w-full" asChild>
                            <Link href="/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                        </Button>
                    )}
                </motion.div>
            )}
        </nav>
    );
}
