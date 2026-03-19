import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';
import { v4 as uuidv4 } from 'uuid';
import { IOrderItem, IProduct } from '@/types';

export const POST = async (req: Request) => {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Check user suspension
        const dbUser = await User.findOne({ email: session.user.email });
        if (dbUser && dbUser.suspendedUntil && new Date(dbUser.suspendedUntil) > new Date()) {
            return NextResponse.json({
                success: false,
                error: 'Account suspended',
                suspendedUntil: dbUser.suspendedUntil
            }, { status: 403 });
        }

        const body = await req.json();
        const { items } = body as { items: IOrderItem[] };

        if (!items || items.length === 0) {
            return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
        }

        // Phase 5: Step 1 - Calculate total server-side
        let calculatedTotal = 0;
        const processedItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product) as IProduct;
            if (!product || !product.isAvailable) {
                throw new Error(`Product ${item.product} is not available`);
            }

            let itemUnitPrice = product.basePrice;

            // Validate size price modifier
            if (item.customizations.size) {
                const sizeOption = product.customizationOptions.sizes.find(s => s.label === item.customizations.size);
                if (sizeOption) itemUnitPrice += sizeOption.priceModifier;
            }

            // Validate add-ons price
            if (item.customizations.addOns) {
                for (const addOnLabel of item.customizations.addOns) {
                    const addOnOption = product.customizationOptions.addOns.find(a => a.label === addOnLabel);
                    if (addOnOption) itemUnitPrice += addOnOption.price;
                }
            }

            calculatedTotal += itemUnitPrice * item.quantity;
            processedItems.push({
                product: product._id,
                quantity: item.quantity,
                unitPrice: itemUnitPrice,
                customizations: item.customizations
            });
        }

        const next30Mins = new Date(Date.now() + 30 * 60000);
        const qrCode = uuidv4();

        const order = await Order.create({
            user: dbUser?._id,
            items: processedItems,
            subtotal: calculatedTotal,
            total: calculatedTotal, // Future: add tax/discounts here
            qrCode,
            expiresAt: next30Mins,
            status: 'pending'
        });

        return NextResponse.json({ success: true, data: order }, { status: 201 });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
};

export const GET = async () => {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const dbUser = await User.findOne({ email: session.user.email });

        const orders = await Order.find({ user: dbUser?._id }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: orders });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
};
