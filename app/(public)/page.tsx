'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Coffee, ArrowRight, Zap, ShieldCheck, Clock, LayoutDashboard } from 'lucide-react';
import { useSession } from 'next-auth/react'; // Added useSession
import { Button } from '@/components/ui/button';
import DrinkCarousel from '@/components/menu/DrinkCarousel'; // Added DrinkCarousel

export default function LandingPage() {
    const { data: session } = useSession(); // Access session data

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative flex flex-col items-center justify-center px-4 py-24 text-center md:py-32 overflow-hidden">
                {/* Background blobs for premium feel */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="container flex flex-col items-center gap-6"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium">
                        <Zap className="w-3 h-3" />
                        <span>Smart Coffee Ordering v2.0</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl">
                        Order Ahead, <span className="text-primary italic">Skip the Queue.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                        The premium coffee experience for the modern enthusiast. Freshly brewed,
                        digitally verified, and ready when you are.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <Button size="lg" asChild className="h-12 px-8 text-base shadow-lg shadow-primary/20">
                            <Link href="/menu">
                                Order Now <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                        {!session ? (
                            <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base hover:bg-secondary/50">
                                <Link href="/login">Sign In</Link>
                            </Button>
                        ) : (
                             // Only show Dashboard button if admin/staff, otherwise just Order Now is enough or Profile link?
                             // But request was "not show the sign in button".
                             // Maybe add a "My Orders" or simply nothing extra as "Order Now" covers it.
                             // I'll add a Dashboard link if they have access, otherwise nothing.
                             (session.user as any)?.role !== 'customer' && (
                                <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base hover:bg-secondary/50">
                                    <Link href={(session.user as any)?.role === 'admin' ? '/admin' : '/staff'}>
                                        <LayoutDashboard className="mr-2 w-4 h-4" /> Dashboard
                                    </Link>
                                </Button>
                             )
                        )}
                    </div>
                </motion.div>
            </section>

            {/* Drink Carousel Section */}
            <DrinkCarousel />

            {/* Features Section */}
            <section className="py-20 bg-card/30 border-y border-border/40">
                <div className="container px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Clock className="w-6 h-6" />}
                            title="Zero Wait Time"
                            description="Order ahead and your drink will be ready for pickup exactly when you arrive."
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="w-6 h-6" />}
                            title="Verified Pickup"
                            description="Secure QR code system ensures your drink never goes to the wrong person."
                        />
                        <FeatureCard
                            icon={<Coffee className="w-6 h-6" />}
                            title="Premium Quality"
                            description="Our strike system ensures beverages are picked up fresh, reducing waste."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="p-8 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm flex flex-col gap-4"
        >
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                {icon}
            </div>
            <h3 className="text-xl font-semibold underline decoration-primary/30 underline-offset-4">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
        </motion.div>
    );
}
