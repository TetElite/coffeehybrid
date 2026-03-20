import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        await dbConnect();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Admin Logic:
        // Only if email contains 'admin', make them admin (e.g. admin@coffee.com).
        // Otherwise, default to customer.
        const isAdminEmail = email.toLowerCase().includes('admin');
        const role = isAdminEmail ? 'admin' : 'customer';

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        return NextResponse.json(
            { message: 'User registered successfully', userId: user._id },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Registration error:', error);
        
        // Check for MongoDB connection errors
        if (error.name === 'MongooseServerSelectionError' || error.message.includes('buffering timed out')) {
            return NextResponse.json(
                { message: 'Database Connection Failed. Your IP might not be whitelisted on MongoDB Atlas.' },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
