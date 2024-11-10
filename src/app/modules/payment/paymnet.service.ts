/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../ErrorHandler/AppError';
import { User } from '../user/user.model';
import config from '../../../config';
import { paymentCollection } from './payment.model';
import { initialPayment, verifyPayment } from './payment.utills';

type TPaymentRequestData = {
  userId: string;
  amount: number;
};

// paymentRequest;
const paymentRequest = async (data: TPaymentRequestData) => {
  const session = await paymentCollection.startSession();
  try {
    session.startTransaction();
    const user = await User.findById(data.userId).session(session);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'user not found !!');
    }

    const transactionId = `TXN-${Date.now()}`;

    const defaultPay = {
      author: data.userId,
      txtId: transactionId,
      amount: data.amount,
      isPayment: false,
      paymentMethod: '',
    };

    await paymentCollection.create([defaultPay], { session });

    //  initial payment

    const paymentData = {
      transactionId,
      totalPrice: data.amount || '',
      customerName: user.name || '',
      customerEmail: user.email || '',
      customerPhone: user.phone || '',
      customerAddress: user.address || '',
      paymentSuccessUrl: `${config.server_url}/payment/success?txnId=${transactionId}`,
      paymentFailedUrl: `${config.server_url}/payment/failed`,
      paymentCancelledUrl: `${config.server_url}/payment/cancelled`,
    };

    //   payment
    const paymentSession = await initialPayment(paymentData);
    await session.commitTransaction();

    return paymentSession;
  } catch (err: any) {
    await session.abortTransaction();
    throw new AppError(httpStatus.NOT_FOUND, err.message);
  } finally {
    session.endSession();
  }
};

//payment success
const paymentSuccess = async (txnId: string) => {
  const session = await paymentCollection.startSession();
  try {
    session.startTransaction();
    const verifyPay = await verifyPayment(txnId);

    if (verifyPay.pay_status === 'Successful') {
      // update user payment status
      const paymentData = await paymentCollection.findOneAndUpdate(
        { transactionId: txnId },
        { isPayment: true },
        { new: true, session },
      );
      if (!paymentData) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'verified status update failed',
        );
      }
      // update user verified status
      await User.findByIdAndUpdate(
        paymentData.author,
        { isVerified: true },
        { new: true, session },
      );

      return verifyPay;
    } else {
      return false;
    }
  } catch (err: any) {
    throw new AppError(httpStatus.BAD_REQUEST, err.message);
  }
};

export const PaymentService = {
  paymentSuccess,
  paymentRequest,
};
