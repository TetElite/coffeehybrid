import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
interface MongooseGlobal {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: MongooseGlobal;
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 3000, // Reduced from 15s to 3s for faster fallback
            socketTimeoutMS: 5000,
            connectTimeoutMS: 3000,
            family: 4, // Use IPv4, skip trying IPv6
        };

        // Added catch block to prevent unhandled promise rejections crashing the app
        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            console.log("MongoDB Connected Successfully");
            return mongoose;
        }).catch(err => {
            console.error("MongoDB Connection Failed (Check IP Whitelist):", err.message);
            throw err;
        }) as any;
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
