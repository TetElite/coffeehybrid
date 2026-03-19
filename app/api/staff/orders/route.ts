import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { ExtendedUser } from '@/types';

export const GET = async () => {
    try {
        const session = await auth();
        const role = (session?.user as ExtendedUser | undefined)?.role;

        if (!role || !['staff', 'admin'].includes(role)) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();

        // Fetch active orders (non-completed and non-cancelled)
        const orders = await Order.find({
            status: { $nin: ['completed', 'cancelled', 'expired'] }
        }).sort({ createdAt: 1 }).populate('items.product');

        return NextResponse.json({ success: true, data: orders });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
};
