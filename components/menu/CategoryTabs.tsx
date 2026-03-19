'use client';

import { ICategory } from '@/types';
import { motion } from 'framer-motion';

interface CategoryTabsProps {
    categories: ICategory[];
    activeCategory: string | null;
    onSelect: (categoryId: string | null) => void;
}

export default function CategoryTabs({ categories, activeCategory, onSelect }: CategoryTabsProps) {
    return (
        <div className="flex flex-wrap gap-2 mb-8 justify-center items-center py-4 px-2">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(null)}
                className={`px-4 py-2 rounded-full border border-border/60 text-sm font-bold transition-all ${activeCategory === null
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card/40 hover:bg-card/60'
                    }`}
            >
                All Drinks
            </motion.button>
            {categories.map((category) => (
                <motion.button
                    key={category._id as string}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect(category._id as string)}
                    className={`px-6 py-2 rounded-full border border-border/60 text-sm font-bold transition-all ${activeCategory === category._id as string
                        ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                        : 'bg-card/40 hover:bg-card/60'
                        }`}
                >
                    {category.name}
                </motion.button>
            ))}
        </div>
    );
}
