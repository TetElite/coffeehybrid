import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Strike from '@/models/Strike';
import { ExtendedUser } from '@/types';
import { isExpired } from '@/lib/qr';
import { applyStrike } from '@/lib/strikes';

export const POST = async (req: Request) => {
    try {
        const session = await auth();
        const role = (session?.user as ExtendedUser | undefined)?.role;
        if (!role || !['staff', 'admin'].includes(role)) {
            return NextResponse.json({ success: false, error: 'Unauthorized personnel only' }, { status: 403 });
        }

        await dbConnect();
        const { qrCode } = await req.json();

        if (!qrCode) {
            return NextResponse.json({ success: false, error: 'QR Code is required' }, { status: 400 });
        }

        const order = await Order.findOne({ qrCode }).populate('user');
        if (!order) {
            return NextResponse.json({ success: false, error: 'Invalid QR Code' }, { status: 404 });
        }

        if (order.status === 'completed') {
            return NextResponse.json({ success: false, error: 'Order already picked up' }, { status: 400 });
        }

        if (order.status === 'cancelled') {
            return NextResponse.json({ success: false, error: 'Order was cancelled' }, { status: 400 });
        }

        const orderIsExpired = isExpired(order.expiresAt);

        if (orderIsExpired || order.status === 'expired') {
            // Handle no-show strike logic if not already done by cron
            if (order.status !== 'expired') {
                order.status = 'expired';
                await order.save();

                // Add strike to user
                if (order.user) {
                    // FIX: Replaced 'any' with proper type casting using Types.ObjectId
                    const userId = typeof order.user === 'object' ? order.user._id : order.user;
                    await Strike.create({ user: userId, order: order._id, reason: 'Missed pickup window (Staff scanned expired)' });

                    const user = await User.findById(userId);
                    if (user) {
                        applyStrike(user);
                        await user.save();
                    }
                }
            }
            return NextResponse.json({ success: false, error: 'Order expired. Pickup window closed.', data: order }, { status: 400 });
        }

        // Successfully verified and picked up!
        order.status = 'completed';
        order.qrUsed = true;
        await order.save();

        return NextResponse.json({
            success: true,
            message: 'Order verified successfully',
            data: order
        });

    } catch (error: unknown) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
};
