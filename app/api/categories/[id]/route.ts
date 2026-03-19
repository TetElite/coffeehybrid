import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import { ExtendedUser } from '@/types';

export const PATCH = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        const session = await auth();
        const role = (session?.user as ExtendedUser | undefined)?.role;
        if (role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const body = await req.json();
        const category = await Category.findByIdAndUpdate(id, body, { new: true });
        if (!category) {
            return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: category });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
};

export const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        const session = await auth();
        const role = (session?.user as ExtendedUser | undefined)?.role;
        if (role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        // Instead of hard delete, maybe just mark as inactive
        const category = await Category.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!category) {
            return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: { message: 'Category deactivated' } });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
};
