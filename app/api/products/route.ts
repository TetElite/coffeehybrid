import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export const GET = async () => {
    try {
        await dbConnect();
        const products = await Product.find({ isAvailable: true }).populate('category').sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: products });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
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
