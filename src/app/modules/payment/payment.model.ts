import { model, Schema } from 'mongoose';
import { TPayment } from './payment.interface';

const paymentSchema = new Schema<TPayment>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    txtId: {
      type: String,
    },
    amount: {
      type: Number,
    },
    paymentMethod: {
      type: String,
    },
    isPayment: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

export const paymentCollection = model<TPayment>('payment', paymentSchema);
