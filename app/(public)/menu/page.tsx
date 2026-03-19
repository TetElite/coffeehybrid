'use client';

import { useState, useEffect } from 'react';
import { IProduct, ICategory } from '@/types';
import CategoryTabs from '@/components/menu/CategoryTabs';
import ProductCard from '@/components/menu/ProductCard';
import ProductModal from '@/components/menu/ProductModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Search, Coffee } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function MenuPage() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    fetch('/api/products').then(res => res.json()),
                    fetch('/api/categories').then(res => res.json())
                ]);

                if (productsRes.success) setProducts(productsRes.data);
                if (categoriesRes.success) setCategories(categoriesRes.data);
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === null || product.category === activeCategory ||
            (typeof product.category === 'object' && (product.category as ICategory)._id === activeCategory);
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch && product.isAvailable;
    });

    const categoriesList = categories.filter(c => c.isActive);

    return (
        <div className="min-h-screen bg-background pb-20 pt-10">
            <div className="container px-4 mx-auto max-w-6xl">
                {/* Header */}
                <div className="flex flex-col items-center mb-10 text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 bg-primary/10 rounded-2xl text-primary"
                    >
                        <Coffee className="w-8 h-8" />
                    </motion.div>
                    <h1 className="text-4xl font-bold tracking-tight">Our Menu</h1>
                    <p className="text-muted-foreground max-w-lg">From classic espresso to artisanal blends, discover your next favorite cup.</p>
                </div>

                {/* Filters */}
                <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md pb-4 pt-2 -mx-4 px-4 border-b border-border/20 mb-8">
                    <div className="max-w-xl mx-auto space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search our drinks..."
                                className="pl-10 h-12 bg-card/40 border-border/60 rounded-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <CategoryTabs
                            categories={categoriesList}
                            activeCategory={activeCategory}
                            onSelect={setActiveCategory}
                        />
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <p className="text-muted-foreground animate-pulse font-medium">Brewing the menu...</p>
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product._id as string}
                                    product={product}
                                    onAdd={(p) => {
                                        setSelectedProduct(p);
                                        setIsModalOpen(true);
                                    }}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {!loading && filteredProducts.length === 0 && (
                    <div className="text-center py-20 bg-card/20 rounded-3xl border border-dashed border-border/40">
                        <p className="text-xl font-medium text-muted-foreground">No matches found. Try another selection!</p>
                    </div>
                )}
            </div>

            {/* Customization Modal */}
            <ProductModal
                key={selectedProduct?._id?.toString() || 'none'}
                product={selectedProduct}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </div>
    );
}
