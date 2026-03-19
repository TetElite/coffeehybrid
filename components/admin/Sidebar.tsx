// FIX: Moved NavContent outside render to avoid creating components during render
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, List, BarChart3, Home, Coffee, LogOut, Menu, X, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react';

const navLinks = [
    { href: '/admin', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/products', label: 'Products', icon: ShoppingBag },
    { href: '/admin/categories', label: 'Categories', icon: List },
    { href: '/admin/orders', label: 'All Orders', icon: LayoutDashboard },
    { href: '/staff', label: 'Staff Hub', icon: Users },
    { href: '/menu', label: 'Store View', icon: Coffee },
    { href: '/', label: 'Home', icon: Home },
];

function NavContent({ pathname, onLinkClick }: { pathname: string; onLinkClick?: () => void }) {
    return (
        <div className="flex flex-col h-full bg-card/60 backdrop-blur-xl border-r border-border/40 p-6 space-y-8">
            <div className="flex items-center gap-3 px-2">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Coffee className="w-6 h-6" />
                </div>
                <div className="font-black text-xl tracking-tighter">
                    ADMIN<span className="text-primary italic">OS</span>
                </div>
            </div>

            <nav className="flex-1 space-y-1.5 font-bold">
                {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={onLinkClick}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                            <span className="text-sm tracking-wide">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-8 border-t border-border/40 px-2 space-y-4">
                <div className="p-4 rounded-3xl bg-primary/5 border border-primary/10">
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-1.5 opacity-60">Admin Access</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-xs font-bold text-foreground/80">Superuser Locked</span>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-2xl hover:bg-destructive/10 hover:text-destructive group h-12 px-4 transition-all"
                    onClick={() => signOut()}
                >
                    <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span className="font-bold text-sm">Log Out</span>
                </Button>
            </div>
        </div>
    );
}

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <aside className="hidden lg:block w-72 h-screen sticky top-0">
                <NavContent pathname={pathname} />
            </aside>

            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border/20 z-50 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary font-black tracking-tighter italic">
                    <Coffee className="w-5 h-5" />
                    ADMINOS
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                    <Menu className="w-6 h-6" />
                </Button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] lg:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute inset-y-0 left-0 w-[85%] max-w-sm"
                        >
                            <NavContent pathname={pathname} onLinkClick={() => setIsOpen(false)} />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 text-white"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
