// Script to fix product images and seed new data
// Usage: tsx scripts/update-products.ts (or copy logic to an API route)

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { mockProducts } from '@/lib/mock-data';

export const GET = async () => {
    try {
        await dbConnect();
        
        console.log('Starting Force Product Update/Seed...');

        // 1. Ensure Categories exist
        const uniqueCategories = Array.from(new Set(mockProducts.map(p => p.category.name)));
        const categoryMap = new Map();

        for (const catName of uniqueCategories) {
            let category = await Category.findOne({ name: catName });
            if (!category) {
                console.log(`Creating category: ${catName}`);
                category = await Category.create({
                    name: catName,
                    slug: catName.toLowerCase().replace(/\s+/g, '-'),
                    isActive: true
                });
            }
            categoryMap.set(catName, category._id);
        }

        // 2. Upsert Products
        const results = [];
        for (const p of mockProducts) {
            const categoryId = categoryMap.get(p.category.name);
            
            // Check if product exists by name
            let existingProduct = await Product.findOne({ name: p.name });

            const productData = {
                name: p.name,
                description: p.description,
                basePrice: p.basePrice,
                imageUrl: p.imageUrl, // Ensure image URL is updated
                category: categoryId,
                isAvailable: p.isAvailable,
                customizationOptions: p.customizationOptions
            };

            if (existingProduct) {
                console.log(`Updating existing product: ${p.name}`);
                // Update with new data (especially Image URL)
                existingProduct = await Product.findByIdAndUpdate(
                   existingProduct._id,
                   { $set: productData },
                   { new: true }
                );
                results.push({ name: p.name, status: 'updated' });
            } else {
                console.log(`Creating new product: ${p.name}`);
                await Product.create(productData);
                results.push({ name: p.name, status: 'created' });
            }
        }

        return NextResponse.json({ success: true, message: "Products updated successfully", data: results });
    } catch (error: any) {
        console.error('Seed Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
};
