'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { mockProducts } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function DrinkCarousel() {
    // Duplicate the array 3 times to ensure smooth infinite scrolling on wide screens
    // Filtering only available products
    const availableProducts = mockProducts.filter(p => p.isAvailable);
    const marqueeProducts = [...availableProducts, ...availableProducts, ...availableProducts];

    return (
        <div className="w-full overflow-hidden bg-secondary/20 py-12 border-y border-border/50">
            <div className="container px-4 mb-8 flex items-center justify-between">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Premium Selections
                </h2>
                <Button variant="ghost" asChild className="hidden sm:inline-flex text-primary hover:text-primary/80 hover:bg-primary/5">
                    <Link href="/menu">
                        View Full Menu <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </Button>
            </div>

            <div className="relative w-full mask-gradient-x">
                <motion.div
                    className="flex gap-6 pl-4"
                    animate={{ x: ["0%", "-33.33%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30, // Adjust speed here
                    }}
                    style={{ width: "fit-content" }}
                >
                    {marqueeProducts.map((product, idx) => (
                        <Link key={`${product._id}-${idx}`} href={`/menu?product=${product._id}`} className="block group">
                            <Card className="w-[280px] h-[320px] overflow-hidden border-border/40 hover:border-primary/50 transition-colors bg-card/50 backdrop-blur-sm">
                                <div className="h-48 overflow-hidden relative">
                                    <Image
                                        src={product.imageUrl || '/placeholder-coffee.jpg'}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                        <span className="text-white font-medium text-sm">Order Now</span>
                                    </div>
                                </div>
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                                            {product.name}
                                        </h3>
                                        <span className="font-semibold text-primary">
                                            ${product.basePrice.toFixed(2)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {product.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </motion.div>
            </div>

            <div className="container px-4 mt-6 sm:hidden flex justify-center">
                <Button variant="outline" asChild className="w-full">
                    <Link href="/menu">View Menu</Link>
                </Button>
            </div>
        </div>
    );
}
