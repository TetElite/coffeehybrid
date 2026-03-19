import { Schema, model, models } from 'mongoose';
import { IOrder } from '@/types';

const OrderItemSchema = new Schema(
    {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        customizations: {
            size: String,
            sugarLevel: String,
            iceOption: String,
            addOns: [String],
        },
        unitPrice: { type: Number, required: true },
    },
    { _id: false }
);

const OrderSchema = new Schema<IOrder>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        items: [OrderItemSchema],
        subtotal: { type: Number, required: true },
        total: { type: Number, required: true },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'ready', 'completed', 'cancelled', 'expired'],
            default: 'pending'
        },
        qrCode: { type: String, required: true, unique: true },
        qrUsed: { type: Boolean, default: false },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true }
);

// Indexes
OrderSchema.index({ status: 1 });
OrderSchema.index({ user: 1 });
OrderSchema.index({ expiresAt: 1 });
OrderSchema.index({ qrCode: 1 }, { unique: true });

const Order = models.Order || model<IOrder>('Order', OrderSchema);
export default Order;
