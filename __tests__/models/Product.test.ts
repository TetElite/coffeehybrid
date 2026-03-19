import { describe, it, expect } from 'vitest';
import Product from '@/models/Product';
import { Types } from 'mongoose';

type ValidationError = {
    errors: Record<string, unknown>;
};

describe('Product Model', () => {
    it('should be invalid if name, description, or basePrice is missing', async () => {
        const product = new Product({});
        let err: ValidationError | null = null;
        try {
            await product.validate();
        } catch (error: unknown) {
            err = error as ValidationError;
        }
        expect(err?.errors.name).toBeDefined();
        expect(err?.errors.description).toBeDefined();
        expect(err?.errors.basePrice).toBeDefined();
        expect(err?.errors.category).toBeDefined();
        expect(err?.errors.imageUrl).toBeDefined();
    });

    it('should be valid with required fields', async () => {
        const product = new Product({
            name: 'Espresso',
            description: 'Strong coffee',
            basePrice: 2.5,
            category: new Types.ObjectId(),
            imageUrl: '/images/espresso.jpg',
        });
        let err: ValidationError | null = null;
        try {
            await product.validate();
        } catch (error: unknown) {
            err = error as ValidationError;
        }
        expect(err).toBeNull();
    });
});
