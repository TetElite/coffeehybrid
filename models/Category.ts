import { Schema, model, models } from 'mongoose';
import { ICategory } from '@/types';

const CategorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        sortOrder: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Category = models.Category || model<ICategory>('Category', CategorySchema);
export default Category;
