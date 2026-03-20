import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import { ExtendedUser } from '@/types';

export const dynamic = 'force-dynamic';

export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const dbUser = await User.findOne({ email: session.user.email });
        if (!dbUser) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        const order = await Order.findById(id).populate('items.product');
        if (!order) {
            return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
        }

        // Check if owner or staff/admin
        const isOwner = order.user.toString() === dbUser._id.toString();
        const isAuthorized = isOwner || ['staff', 'admin'].includes(session.user.role as string);

        if (!isAuthorized) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json({ success: true, data: order });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
};

export const PATCH = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        const session = await auth();
        // Staff/Admin only for status updates
        const role = (session?.user as ExtendedUser | undefined)?.role;
        if (!role || !['staff', 'admin'].includes(role)) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        await dbConnect();
        const body = await req.json();
        const { status, qrUsed } = body;

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { ...(status && { status }), ...(qrUsed !== undefined && { qrUsed }) },
            { new: true }
        );

        return NextResponse.json({ success: true, data: updatedOrder });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
};
