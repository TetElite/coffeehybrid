'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { IProduct } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductCardProps {
    product: IProduct;
    onAdd: (product: IProduct) => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="h-full"
        >
            <Card className="overflow-hidden border-border/40 bg-card/60 backdrop-blur-sm h-full flex flex-col group hover:shadow-lg transition-all duration-300">
                <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {!product.isAvailable && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] flex items-center justify-center p-4 text-center z-10">
                            <Badge variant="destructive" className="text-sm font-bold shadow-sm">Sold Out</Badge>
                        </div>
                    )}
                </div>
                
                <CardHeader className="p-4 flex-grow space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                        <CardTitle className="text-base sm:text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {product.name}
                        </CardTitle>
                        <span className="text-primary font-bold text-base sm:text-lg shrink-0">
                            ${product.basePrice.toFixed(2)}
                        </span>
                    </div>
                    <CardDescription className="line-clamp-2 text-xs sm:text-sm text-muted-foreground/80">
                        {product.description}
                    </CardDescription>
                </CardHeader>

                <CardFooter className="p-4 pt-0 mt-auto">
                    <Button
                        onClick={() => onAdd(product)}
                        disabled={!product.isAvailable}
                        className="w-full h-10 sm:h-11 gap-2 font-medium shadow-sm active:scale-95 transition-all hover:shadow-md"
                        size="sm"
                    >
                        <Plus className="w-4 h-4" />
                        Customize
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
