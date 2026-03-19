import { Schema, model, models } from 'mongoose';
import { IProduct } from '@/types';

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        basePrice: { type: Number, required: true },
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        imageUrl: { type: String, required: true },
        isAvailable: { type: Boolean, default: true },
        customizationOptions: {
            sizes: [{ label: { type: String, required: true }, priceModifier: { type: Number, required: true } }],
            sugarLevels: { type: [String], default: [] },
            iceOptions: { type: [String], default: [] },
            addOns: [{ label: { type: String, required: true }, price: { type: Number, required: true } }],
        },
    },
    { timestamps: true }
);

const Product = models.Product || model<IProduct>('Product', ProductSchema);
export default Product;
