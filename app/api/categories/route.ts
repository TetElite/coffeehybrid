import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import { mockCategories } from '@/lib/mock-data';

export const GET = async () => {
    try {
        await dbConnect();
        const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
        
        // Use Mock data if DB is empty
        if (categories.length === 0) {
            return NextResponse.json({ success: true, data: mockCategories });
        }

        return NextResponse.json({ success: true, data: categories });
    } catch (error: unknown) {
        console.warn('MongoDB not available or failed, using mock data for testing. Error:', error);
        return NextResponse.json({ success: true, data: mockCategories });
    }
};

export const POST = async (req: Request) => {
    try {
        await dbConnect();
        const body = await req.json();
        const category = await Category.create(body);
        return NextResponse.json({ success: true, data: category }, { status: 201 });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
};
