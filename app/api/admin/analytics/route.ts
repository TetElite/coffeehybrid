import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Category from '@/models/Category';
import { ExtendedUser } from '@/types';

export const GET = async () => {
    try {
        const session = await auth();
        const role = (session?.user as ExtendedUser | undefined)?.role;
        if (role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Forbidden. Admin access required.' }, { status: 403 });
        }

        await dbConnect();

        // Basic analytics: total revenue, order count, breakdown by status
        const [revenueTotal, orderCount, statusBreakdown, categoryStats] = await Promise.all([
            Order.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
            Order.countDocuments(),
            Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
            Order.aggregate([
                { $unwind: "$items" },
                { $lookup: { from: "products", localField: "items.product", foreignField: "_id", as: "productDetails" } },
                { $unwind: "$productDetails" },
                { $group: { _id: "$productDetails.category", count: { $sum: "$items.quantity" }, revenue: { $sum: { $multiply: ["$items.unitPrice", "$items.quantity"] } } } }
            ])
        ]);

        // Populate category names for category breakdown
        const populatedCategories = await Category.find({ _id: { $in: categoryStats.map(s => s._id) } });
        const categoryBreakdown = categoryStats.map(stat => {
            const cat = populatedCategories.find(c => c._id.toString() === stat._id.toString());
            return {
                categoryId: stat._id,
                name: cat ? cat.name : 'Unknown',
                count: stat.count,
                revenue: stat.revenue
            };
        });

        return NextResponse.json({
            success: true,
            data: {
                totalRevenue: revenueTotal[0]?.total || 0,
                totalOrders: orderCount,
                statusBreakdown: statusBreakdown.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
                categoryBreakdown: categoryBreakdown
            }
        });

    } catch (error: unknown) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
};
