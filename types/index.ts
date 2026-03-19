import { Types } from 'mongoose';

export type Role = 'customer' | 'staff' | 'admin';
export type OrderStatus = 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled' | 'expired';

export interface ExtendedUser {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: Role;
    strikes: number;
    suspendedUntil: Date | null;
}

export interface IUser {
    _id: string | Types.ObjectId;
    name: string;
    email: string;
    image?: string;
    role: Role;
    strikes: number;
    suspendedUntil: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICategory {
    _id: string | Types.ObjectId;
    name: string;
    slug: string;
    description?: string; // FIX: Added optional description field used in admin pages
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISize {
    label: string;
    priceModifier: number;
}

export interface IAddOn {
    label: string;
    price: number;
}

export interface ICustomizationOptions {
    sizes: ISize[];
    sugarLevels: string[];
    iceOptions: string[];
    addOns: IAddOn[];
}

export interface IProduct {
    _id: string | Types.ObjectId;
    name: string;
    description: string;
    basePrice: number;
    category: string | Types.ObjectId | ICategory;
    imageUrl: string; // Used in most places
    image?: string; // FIX: Added for backward compatibility with admin form
    isAvailable: boolean;
    customizationOptions: ICustomizationOptions;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrderItem {
    product: string | Types.ObjectId | IProduct;
    quantity: number;
    customizations: {
        size?: string;
        sugarLevel?: string;
        iceOption?: string;
        addOns?: string[];
    };
    unitPrice: number; // calculated at creation time
}

export interface IOrder {
    _id: string | Types.ObjectId;
    user: string | Types.ObjectId | IUser;
    items: IOrderItem[];
    subtotal: number;
    total: number;
    status: OrderStatus;
    qrCode: string;
    qrUsed: boolean;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IStrike {
    _id: string | Types.ObjectId;
    user: string | Types.ObjectId | IUser;
    order: string | Types.ObjectId | IOrder;
    reason: string;
    createdAt: Date;
}
