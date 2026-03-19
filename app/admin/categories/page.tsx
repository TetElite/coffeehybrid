// FIX: Removed unused imports Check and X
'use client';

import { useState, useEffect } from 'react';
import { ICategory } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Edit2,
    Trash2,
    ChevronRight,
    Loader2,
    LayoutGrid,
    Search
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

export default function CategoryManagement() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        sortOrder: 0,
        isActive: true
    });

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            if (data.success) setCategories(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const openCreateDialog = () => {
        setEditingCategory(null);
        setFormData({ name: '', description: '', sortOrder: categories.length, isActive: true });
        setIsDialogOpen(true);
    };

    const openEditDialog = (category: ICategory) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            sortOrder: category.sortOrder,
            isActive: category.isActive
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
        const method = editingCategory ? 'PATCH' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Category ${editingCategory ? 'updated' : 'created'}`);
                fetchCategories();
                setIsDialogOpen(false);
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error('Something went wrong');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will deactivate the category.')) return;
        try {
            const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                toast.success('Category deactivated');
                fetchCategories();
            }
        } catch {
            toast.error('Failed to deactivate category');
        }
    };

    const filtered = categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse font-bold uppercase tracking-widest text-[10px]">Configuring Schemas...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase">Category <span className="text-primary italic">Architecture</span></h1>
                    <p className="text-muted-foreground font-medium text-sm">Managing the structural organization of our menu.</p>
                </div>
                <Button onClick={openCreateDialog} className="h-12 rounded-2xl gap-2 font-bold px-6 shadow-xl hover:scale-105 transition-transform">
                    <Plus className="w-5 h-5" />
                    New Category
                </Button>
            </header>

            <div className="flex flex-col gap-8">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search categories..."
                        className="pl-10 h-12 bg-card/40 border-border/60 rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((category) => (
                            <motion.div
                                key={category._id.toString()}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="group p-6 rounded-3xl bg-card/40 backdrop-blur-md border border-border/40 hover:border-primary/40 transition-all flex items-center justify-between shadow-lg"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                        <LayoutGrid className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-black tracking-tight">{category.name}</h3>
                                            <span className="bg-muted px-2 py-0.5 rounded-full text-[10px] font-black uppercase text-muted-foreground opacity-60">Order: {category.sortOrder}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground font-medium">{category.description || 'No description provided.'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary" onClick={() => openEditDialog(category)}>
                                        <Edit2 className="w-5 h-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(category._id.toString())}>
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                    <div className="w-px h-8 bg-border/20 mx-2" />
                                    <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md bg-card/90 backdrop-blur-2xl border-border/40">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">
                            {editingCategory ? 'Modify Category' : 'Architect Context'}
                        </DialogTitle>
                        <DialogDescription>
                            Define the structure for a new group of products.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest opacity-60">Category Identity</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Espresso Collective"
                                className="h-12 bg-background/40 border-border/40 font-bold"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest opacity-60">Context Description</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Core espresso-based experience."
                                className="h-12 bg-background/40 border-border/40 font-medium"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="sortOrder" className="text-[10px] font-black uppercase tracking-widest opacity-60">Sequence Rank</Label>
                                <Input
                                    id="sortOrder"
                                    type="number"
                                    value={formData.sortOrder}
                                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                                    className="h-12 bg-background/40 border-border/40 font-black"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="isActive" className="text-[10px] font-black uppercase tracking-widest opacity-60">System State</Label>
                                <div className="flex items-center h-12 gap-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-5 h-5 rounded-md border-border/40 bg-background/40"
                                    />
                                    <span className="font-bold text-sm">Active in Storefront</span>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-12 flex-1">Abort</Button>
                            <Button type="submit" className="rounded-xl h-12 flex-1 font-black gap-2 uppercase tracking-tighter">
                                {editingCategory ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                {editingCategory ? 'Update Unit' : 'Deploy Category'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
