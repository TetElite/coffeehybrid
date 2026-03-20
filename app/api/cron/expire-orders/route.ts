import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Strike from '@/models/Strike';
import { applyStrike } from '@/lib/strikes';

export const GET = async (req: Request) => {
    // Basic CRON security check via CRON_SECRET header
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        await dbConnect();
        const now = new Date();

        // Find all orders that are overdue and haven't been completed/cancelled/expired
        const overdueOrders = await Order.find({
            expiresAt: { $lt: now },
            status: { $in: ['pending', 'confirmed', 'ready'] }
        });

        const results = { expired: 0, strikes: 0 };

        for (const order of overdueOrders) {
            order.status = 'expired';
            await order.save();
            results.expired++;

            // Apply strike to user
            if (order.user) {
                const userId = order.user;
                await Strike.create({ user: userId, order: order._id, reason: 'Missed pickup window (CRON expired)' });
                results.strikes++;

                const user = await User.findById(userId);
                if (user) {
                    applyStrike(user);
                    await user.save();
                }
            }
        }

        return NextResponse.json({ success: true, results });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
};
