/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../ErrorHandler/AppError';
import { User } from '../user/user.model';
import config from '../../../config';
import { paymentCollection } from './payment.model';
import { initialPayment, verifyPayment } from './payment.utills';
// import { join } from 'path';
// import { readFileSync } from 'fs';

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
      // paymentSuccessUrl: `http://localhost:5000/payment/success?txnId=${transactionId}`,
      paymentSuccessUrl: `${config.server_url}/payment/success?txnId=${transactionId}`,
      paymentFailedUrl: `${config.server_url}/payment/failed`,
      paymentCancelledUrl: `${config.server_url}/payment/cancelled`,
    };

    // console.log(paymentData);

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

const paymentSuccess = async (txnId: string) => {
  const session = await paymentCollection.startSession();
  try {
    session.startTransaction();

    const verifyPay = await verifyPayment(txnId);

    if (verifyPay.pay_status === 'Successful') {
      const paymentData = await paymentCollection.findOneAndUpdate(
        { txtId: txnId },
        { isPayment: true, paymentMethod: verifyPay?.payment_type },
        { new: true, populate: 'author', session },
      );

      if (paymentData) {
        await User.findByIdAndUpdate(
          paymentData.author._id,
          { isVerified: true },
          { new: true, session },
        );
      }

      await session.commitTransaction();
      // return template;
      return paymentData;
    } else {
      await session.abortTransaction();
      return false;
    }
  } catch (err: any) {
    await session.abortTransaction();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Payment verification failed: ${err.message}`,
    );
  } finally {
    session.endSession();
  }
};

//get monthlyPayment
const getMonthlyPayment = async () => {
  try {
    const monthlyTotals = await paymentCollection.aggregate([
      {
        // Match only successful payments
        $match: { isPayment: true },
      },
      {
        // Group by year and month, and calculate the total amount
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        // Sort by year and month in descending order
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    return monthlyTotals;
  } catch (err: any) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      err.message || 'all payment monthly query failed',
    );
  }
};

export const PaymentService = {
  paymentSuccess,
  paymentRequest,
  getMonthlyPayment,
};
