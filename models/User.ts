import { Schema, model, models } from 'mongoose';
import { IUser } from '@/types';

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        image: { type: String },
        role: {
            type: String,
            enum: ['customer', 'staff', 'admin'],
            default: 'customer'
        },
        strikes: { type: Number, default: 0 },
        suspendedUntil: { type: Date, default: null },
    },
    { timestamps: true }
);

// Optimize: Unique index on email
UserSchema.index({ email: 1 });

const User = models.User || model<IUser>('User', UserSchema);
export default User;
