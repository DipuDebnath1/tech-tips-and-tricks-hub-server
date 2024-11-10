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

//payment success
// const paymentSuccess = async (txnId: string) => {
//   const session = await paymentCollection.startSession();
//   try {
//     session.startTransaction();
//     const verifyPay = await verifyPayment(txnId);

//     if (verifyPay.pay_status === 'Successful') {
//       // update user payment status
//       const paymentData = await paymentCollection.findOneAndUpdate(
//         { txtId: txnId },
//         { isPayment: true, paymentMethod: verifyPay?.payment_type },
//         { new: true, session },
//       );
//       // console.log(paymentData);
//       if (paymentData) {
//         // update user verified status
//         await User.findByIdAndUpdate(
//           paymentData.author,
//           { isVerified: true },
//           { new: true, session },
//         );
//       }
//       session.commitTransaction();
//       return verifyPay;
//     } else {
//       return false;
//     }
//   } catch (err: any) {
//     session.abortTransaction();
//     throw new AppError(httpStatus.BAD_REQUEST, err.message);
//   } finally {
//     session.endSession();
//   }
// };

// paymentSuccess function to verify and update payment status
const paymentSuccess = async (txnId: string) => {
  const session = await paymentCollection.startSession();
  try {
    session.startTransaction();

    // Verify payment status via external API
    const verifyPay = await verifyPayment(txnId);

    if (verifyPay.pay_status === 'Successful') {
      // Update payment status in paymentCollection
      const paymentData = await paymentCollection.findOneAndUpdate(
        { txtId: txnId },
        { isPayment: true, paymentMethod: verifyPay?.payment_type },
        { new: true, populate: 'author', session },
      );

      if (paymentData) {
        // Update user verified status
        await User.findByIdAndUpdate(
          paymentData.author._id,
          { isVerified: true },
          { new: true, session },
        );
      }

      // Commit transaction if all updates are successful
      await session.commitTransaction();
      return verifyPay;
    } else {
      // Payment was not successful; handle accordingly
      await session.abortTransaction();
      return false;
    }
  } catch (err: any) {
    // Roll back transaction on error
    await session.abortTransaction();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Payment verification failed: ${err.message}`,
    );
  } finally {
    // End session
    session.endSession();
  }
};

export const PaymentService = {
  paymentSuccess,
  paymentRequest,
};
