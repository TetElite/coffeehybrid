// FIX: Removed unused imports
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { IProduct, ICategory } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Edit2,
    Trash2,
    Loader2,
    Search,
    Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function ProductManagement() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // FIX: Replaced 'any' with proper type definition for formData
    interface ProductFormData {
        name: string;
        description: string;
        basePrice: number;
        image: string;
        category: string;
        isAvailable: boolean;
        customizationOptions: {
            sizes: Array<{ label: string; priceModifier: number }>;
            sugarLevels: string[];
            iceOptions: string[];
            addOns: Array<{ label: string; price: number }>;
        };
    }

    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        basePrice: 0,
        image: '',
        category: '',
        isAvailable: true,
        customizationOptions: {
            sizes: [{ label: 'Small', priceModifier: 0 }, { label: 'Medium', priceModifier: 0.5 }, { label: 'Large', priceModifier: 1.0 }],
            sugarLevels: ['0%', '25%', '50%', '100%'],
            iceOptions: ['No Ice', 'Less Ice', 'Normal', 'Extra Ice'],
            addOns: [{ label: 'Extra Shot', price: 0.75 }, { label: 'Oat Milk', price: 0.50 }]
        }
    });

    const fetchAll = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch('/api/products').then(res => res.json()),
                fetch('/api/categories').then(res => res.json())
            ]);
            if (prodRes.success) setProducts(prodRes.data);
            if (catRes.success) setCategories(catRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const openCreateDialog = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            basePrice: 3.50,
            image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=800',
            category: categories[0]?._id ? String(categories[0]._id) : '',
            isAvailable: true,
            customizationOptions: {
                sizes: [{ label: 'Small', priceModifier: 0 }, { label: 'Medium', priceModifier: 0.5 }, { label: 'Large', priceModifier: 1.0 }],
                sugarLevels: ['0%', '25%', '50%', '100%'],
                iceOptions: ['No Ice', 'Less Ice', 'Normal', 'Extra Ice'],
                addOns: [{ label: 'Extra Shot', price: 0.75 }, { label: 'Oat Milk', price: 0.50 }]
            }
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (product: IProduct) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            basePrice: product.basePrice,
            image: product.image || product.imageUrl || '',
            category: typeof product.category === 'object' ? String((product.category as ICategory)._id) : String(product.category),
            isAvailable: product.isAvailable,
            customizationOptions: product.customizationOptions
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
        const method = editingProduct ? 'PATCH' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Product ${editingProduct ? 'updated' : 'created'}`);
                fetchAll();
                setIsDialogOpen(false);
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error('Something went wrong');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Mark as unavailable?')) return;
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                toast.success('Product updated');
                fetchAll();
            }
        } catch {
            toast.error('Failed to update product');
        }
    };

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse font-bold uppercase tracking-widest text-[10px]">Populating Units...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase">Product <span className="text-primary italic">Inventory</span></h1>
                    <p className="text-muted-foreground font-medium text-sm">Managing the fine details of our sensory offerings.</p>
                </div>
                <Button onClick={openCreateDialog} className="h-12 rounded-2xl gap-2 font-bold px-6 shadow-xl hover:scale-105 transition-transform uppercase italic">
                    <Plus className="w-5 h-5" />
                    Forge Product
                </Button>
            </header>

            <div className="flex flex-col gap-8">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        className="pl-10 h-12 bg-card/40 border-border/60 rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((product) => (
                            <motion.div
                                key={product._id.toString()}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <Card className="overflow-hidden bg-card/40 backdrop-blur-md border border-border/40 hover:border-primary/40 transition-all duration-500 group relative">
                                    <div className="aspect-square overflow-hidden relative">
                                        <Image
                                            src={product.imageUrl} width={240} height={240}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                                        <Badge className={`absolute top-4 right-4 ${product.isAvailable ? 'bg-emerald-500/20 text-emerald-500' : 'bg-destructive/20 text-destructive'} border-none font-black text-[8px] uppercase tracking-widest`}>
                                            {product.isAvailable ? 'Available' : 'Sold Out'}
                                        </Badge>
                                    </div>
                                    <CardContent className="p-5 space-y-4">
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-black text-lg tracking-tight truncate">{product.name}</h3>
                                                <span className="font-black text-primary italic text-lg">${product.basePrice.toFixed(2)}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground font-medium line-clamp-1">{product.description}</p>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-border/10">
                                            <Badge variant="outline" className="text-[10px] font-black uppercase border-border/40 text-muted-foreground/60">
                                                {typeof product.category === 'object' ? (product.category as ICategory).name : 'Internal ID'}
                                            </Badge>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary" onClick={() => openEditDialog(product)}>
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(product._id.toString())}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-2xl bg-card/90 backdrop-blur-2xl border-border/40 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">
                            {editingProduct ? 'Recode Product' : 'Initialize Product Unit'}
                        </DialogTitle>
                        <DialogDescription>
                            Configure the parameters and sensory defaults for this SKU.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-8 py-4 px-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* General Info */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Identity Component</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Product Name"
                                        className="h-12 bg-background/40 border-border/40 font-bold"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Visual URI</Label>
                                    <Input
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="Image URL"
                                        className="h-12 bg-background/40 border-border/40 font-medium text-xs"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Base Value ($)</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={formData.basePrice}
                                            onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                                            className="h-12 bg-background/40 border-border/40 font-black"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Classifier</Label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full h-12 bg-background/40 border-border/40 rounded-md px-3 font-bold text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                        >
                                            {categories.map(c => (
                                                <option key={c._id.toString()} value={c._id.toString()}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Technical Narrative</Label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full h-24 bg-background/40 border-border/40 rounded-md p-3 font-medium text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                        placeholder="Product description and tasting notes..."
                                    />
                                </div>
                            </div>

                            {/* Configuration (Customization) */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 pt-1">Sensory Configuration</h4>

                                <div className="p-4 rounded-3xl bg-muted/20 border border-border/10 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black tracking-wider uppercase opacity-80">Size Options</span>
                                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6"><Plus className="w-3 h-3" /></Button>
                                    </div>
                                    {/* FIX: Removed 'any' type, TypeScript infers from formData.customizationOptions.sizes */}
                                    {formData.customizationOptions.sizes.map((s, i: number) => (
                                        <div key={i} className="flex gap-2">
                                            <Input className="h-8 bg-background/40 text-[10px] font-bold" value={s.label} />
                                            <Input className="h-8 bg-background/40 text-[10px] font-black w-20" type="number" step="0.5" value={s.priceModifier} />
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 rounded-3xl bg-muted/20 border border-border/10 space-y-2">
                                    <span className="text-[10px] font-black tracking-wider uppercase opacity-80">Add-On Modules</span>
                                    <div className="grid grid-cols-2 gap-2">
                                        {/* FIX: Removed 'any' type, TypeScript infers from formData.customizationOptions.addOns */}
                                        {formData.customizationOptions.addOns.map((a, i: number) => (
                                            <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-background/40 border border-border/20">
                                                <span className="text-[9px] font-bold">{a.label}</span>
                                                <span className="text-[9px] font-black text-primary">${a.price.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-3xl bg-primary/5 border border-primary/20">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Active Status</span>
                                    <input
                                        type="checkbox"
                                        checked={formData.isAvailable}
                                        onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                        className="w-5 h-5 rounded-md accent-primary"
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="pt-4 gap-4">
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-14 flex-1 font-bold">Abort Logic</Button>
                            <Button type="submit" className="rounded-xl h-14 flex-1 font-black gap-2 uppercase tracking-tighter italic shadow-xl">
                                {editingProduct ? <Edit2 className="w-5 h-5" /> : <Tag className="w-5 h-5" />}
                                {editingProduct ? 'Commit Changes' : 'Execute Deploy'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
