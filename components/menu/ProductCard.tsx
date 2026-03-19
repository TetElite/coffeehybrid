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
        >
            <Card className="overflow-hidden border-border/40 bg-card/60 backdrop-blur-sm h-full flex flex-col">
                <div className="relative h-48 w-full group overflow-hidden">
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {!product.isAvailable && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center p-4 text-center">
                            <Badge variant="destructive" className="text-sm font-bold">Sold Out</Badge>
                        </div>
                    )}
                </div>
                <CardHeader className="p-4 flex-grow">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
                        <span className="text-primary font-bold">${product.basePrice.toFixed(2)}</span>
                    </div>
                    <CardDescription className="line-clamp-2 text-xs mt-2">
                        {product.description}
                    </CardDescription>
                </CardHeader>
                <CardFooter className="p-4 pt-0">
                    <Button
                        onClick={() => onAdd(product)}
                        disabled={!product.isAvailable}
                        className="w-full h-10 gap-2 font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Customize
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
