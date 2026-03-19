import { Schema, model, models } from 'mongoose';
import { IStrike } from '@/types';

const StrikeSchema = new Schema<IStrike>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
        reason: { type: String, required: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

const Strike = models.Strike || model<IStrike>('Strike', StrikeSchema);
export default Strike;
