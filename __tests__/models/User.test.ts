import { describe, it, expect } from 'vitest';
import User from '@/models/User';

type ValidationError = {
    errors: Record<string, unknown>;
};

describe('User Model', () => {
    it('should be invalid if name is missing', async () => {
        const user = new User({ email: 'test@example.com' });
        let err: ValidationError | null = null;
        try {
            await user.validate();
        } catch (error: unknown) {
            err = error as ValidationError;
        }
        expect(err?.errors.name).toBeDefined();
    });

    it('should be invalid if email is missing', async () => {
        const user = new User({ name: 'Test User' });
        let err: ValidationError | null = null;
        try {
            await user.validate();
        } catch (error: unknown) {
            err = error as ValidationError;
        }
        expect(err?.errors.email).toBeDefined();
    });

    it('should have default role as customer', () => {
        const user = new User({ name: 'Test User', email: 'test@example.com' });
        expect(user.role).toBe('customer');
    });

    it('should have default strikes as 0', () => {
        const user = new User({ name: 'Test User', email: 'test@example.com' });
        expect(user.strikes).toBe(0);
    });
});
