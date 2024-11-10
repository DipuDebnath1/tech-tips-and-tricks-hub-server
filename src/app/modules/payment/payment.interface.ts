import { Types } from 'mongoose';

export type TPayment = {
  author: Types.ObjectId;
  txtId: string;
  amount: number;
  isPayment: boolean;
  paymentMethod: string;
};
