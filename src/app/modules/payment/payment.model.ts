import { model, Schema } from 'mongoose';
import { TPayment } from './payment.interface';

const paymentSchema = new Schema<TPayment>({
  author: {
    type: Schema.Types.ObjectId,
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
});

export const paymentCollection = model<TPayment>('payment', paymentSchema);
