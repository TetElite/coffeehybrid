import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { ExtendedUser } from '@/types';

export const GET = async () => {
    try {
        const session = await auth();
        const role = (session?.user as ExtendedUser | undefined)?.role;

        if (role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();

        // Fetch all orders with user and product population
        const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .limit(100)
            .populate('user', 'name email')
            .populate('items.product');

        return NextResponse.json({ success: true, data: orders });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
};
