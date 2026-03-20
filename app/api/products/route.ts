import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { mockProducts } from '@/lib/mock-data';

export const GET = async () => {
    try {
        await dbConnect();
        
        const count = await Product.countDocuments();
        
        // Use Mock Data if DB is empty acting as a Seed
        if (count === 0) {
            console.log('Database empty. Seeding mock data...');
            
            // 1. Ensure Categories exist from Mock Data
            const uniqueCategories = Array.from(new Set(mockProducts.map(p => p.category.name)));
            const categoryMap = new Map(); // Name -> _id

            for (const catName of uniqueCategories) {
                let category = await Category.findOne({ name: catName });
                if (!category) {
                    category = await Category.create({
                        name: catName,
                        slug: catName.toLowerCase().replace(/\s+/g, '-'),
                        isActive: true
                    });
                }
                categoryMap.set(catName, category._id);
            }

            // 2. Insert Products with correct Category references
            const seededProducts = await Promise.all(mockProducts.map(async (p) => {
                // Ensure unique name handling if needed, but for seed it's fine
                const newProduct = {
                    ...p,
                    _id: undefined, // Let Mongo generate ID
                    category: categoryMap.get(p.category.name) // Replace mock object with real ID
                };
                return await Product.create(newProduct);
            }));

            // Return the newly created products (populated)
            const populatedProducts = await Product.find({ _id: { $in: seededProducts.map(p => p._id) } })
                .populate('category')
                .sort({ createdAt: -1 });

            return NextResponse.json({ success: true, data: populatedProducts });
        }

        const products = await Product.find({ isAvailable: true }).populate('category').sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: products });
    } catch (error: unknown) {
        console.warn('MongoDB query failed, attempting to return mock data directly. Error:', error);
        // Fallback only if DB connection completely fails
        return NextResponse.json({ success: true, data: mockProducts });
    }
};

export const POST = async (req: Request) => {
    // Admin check logic can go here (role check in middleware or here)
    try {
        await dbConnect();
        const body = await req.json();
        const product = await Product.create(body);
        return NextResponse.json({ success: true, data: product }, { status: 201 });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
};
