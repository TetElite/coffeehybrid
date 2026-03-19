'use client';

import { useState, useMemo } from 'react';
import { IProduct, ISize } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useCartStore } from '@/store/cart.store';
import { toast } from 'sonner';

interface ProductModalProps {
    product: IProduct | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ProductModal({ product, open, onOpenChange }: ProductModalProps) {
    const addItem = useCartStore((state) => state.addItem);

    // Customization states initialized from product prop
    // Since this component is keyed by product ID, it will re-initialize when product changes
    const [selectedSize, setSelectedSize] = useState<ISize | null>(product?.customizationOptions.sizes[0] || null);
    const [selectedSugar, setSelectedSugar] = useState<string>(product?.customizationOptions.sugarLevels[0] || '');
    const [selectedIce, setSelectedIce] = useState<string>(product?.customizationOptions.iceOptions[0] || '');
    const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

    // Calculate total price as derived state
    const totalPrice = useMemo(() => {
        if (!product) return 0;

        let price = product.basePrice;
        if (selectedSize) price += selectedSize.priceModifier;

        selectedAddOns.forEach(addOnLabel => {
            const addOn = product.customizationOptions.addOns.find(a => a.label === addOnLabel);
            if (addOn) price += addOn.price;
        });

        return price;
    }, [product, selectedSize, selectedAddOns]);

    if (!product) return null;

    const handleAddToCart = () => {
        addItem(product, {
            size: selectedSize?.label,
            sugarLevel: selectedSugar,
            iceOption: selectedIce,
            addOns: selectedAddOns
        }, totalPrice);

        toast.success(`Added ${product.name} to cart!`);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-card/90 backdrop-blur-lg border-border/40 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
                    <DialogDescription>${totalPrice.toFixed(2)} — Personalize your drink</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Size Selection */}
                    {product.customizationOptions.sizes.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Select Size</h4>
                            <RadioGroup
                                value={selectedSize?.label}
                                onValueChange={(val) => setSelectedSize(product.customizationOptions.sizes.find(s => s.label === val) || null)}
                                className="flex flex-col gap-2"
                            >
                                {product.customizationOptions.sizes.map((size) => (
                                    <div key={size.label} className="flex items-center space-x-3 rounded-lg border border-border/40 p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                                        <RadioGroupItem value={size.label} id={`size-${size.label}`} />
                                        <Label htmlFor={`size-${size.label}`} className="flex-grow flex justify-between cursor-pointer">
                                            <span>{size.label}</span>
                                            <span className="text-muted-foreground">+{size.priceModifier.toFixed(2)}</span>
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    )}

                    {/* Sugar Levels */}
                    {product.customizationOptions.sugarLevels.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Sugar Level</h4>
                            <RadioGroup value={selectedSugar} onValueChange={setSelectedSugar} className="flex flex-wrap gap-2">
                                {product.customizationOptions.sugarLevels.map((level) => (
                                    <div key={level}>
                                        <RadioGroupItem value={level} id={`sugar-${level}`} className="sr-only" />
                                        <Label
                                            htmlFor={`sugar-${level}`}
                                            className={`px-4 py-2 rounded-full border border-border/60 text-xs font-bold transition-all cursor-pointer ${selectedSugar === level ? 'bg-primary text-primary-foreground border-primary' : 'bg-card/40'
                                                }`}
                                        >
                                            {level}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    )}

                    {/* Ice Options */}
                    {product.customizationOptions.iceOptions.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Ice Level</h4>
                            <RadioGroup value={selectedIce} onValueChange={setSelectedIce} className="flex flex-wrap gap-2">
                                {product.customizationOptions.iceOptions.map((option) => (
                                    <div key={option}>
                                        <RadioGroupItem value={option} id={`ice-${option}`} className="sr-only" />
                                        <Label
                                            htmlFor={`ice-${option}`}
                                            className={`px-4 py-2 rounded-full border border-border/60 text-xs font-bold transition-all cursor-pointer ${selectedIce === option ? 'bg-primary text-primary-foreground border-primary' : 'bg-card/40'
                                                }`}
                                        >
                                            {option}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    )}

                    {/* Add-ons */}
                    {product.customizationOptions.addOns.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Add-ons</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {product.customizationOptions.addOns.map((addOn) => (
                                    <div key={addOn.label} className="flex items-center space-x-3 rounded-lg border border-border/40 p-3 hover:bg-muted/50 transition-colors">
                                        <Checkbox
                                            id={`addon-${addOn.label}`}
                                            checked={selectedAddOns.includes(addOn.label)}
                                            onCheckedChange={(checked) => {
                                                if (checked) setSelectedAddOns([...selectedAddOns, addOn.label]);
                                                else setSelectedAddOns(selectedAddOns.filter(a => a !== addOn.label));
                                            }}
                                        />
                                        <Label htmlFor={`addon-${addOn.label}`} className="flex-grow flex justify-between cursor-pointer">
                                            <span>{addOn.label}</span>
                                            <span className="text-muted-foreground">+${addOn.price.toFixed(2)}</span>
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="sm:flex-1 h-12">Cancel</Button>
                    <Button onClick={handleAddToCart} className="sm:flex-1 h-12 font-bold gap-2">
                        Add to Order — Total: ${totalPrice.toFixed(2)}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
