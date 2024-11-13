/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from 'express';
import catchAsync from '../../utills/catchAsync';
import httpStatus from 'http-status';
import sendResponse from '../../utills/sendResponse';
import { PaymentService } from './paymnet.service';
import { cancelledPayment, failedPayment, success } from './responsePage';

const PaymentRequest: RequestHandler = catchAsync(async (req, res, next) => {
  const data = req.body;
  const result = await PaymentService.paymentRequest(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'pay requested receive success',
    data: result,
  });
});

// get success Url
const PaymentSuccess: RequestHandler = catchAsync(async (req, res, next) => {
  const { txnId } = req.query;

  // const result = true;
  const result = await PaymentService.paymentSuccess(txnId as string);
  // res.send(result);
  // if (result) {
  res.send(success(result));
  // } else {
  //   sendResponse(res, {
  //     // statusCode: httpStatus.OK,
  //     statusCode: httpStatus.FAILED_DEPENDENCY,
  //     // success: true,
  //     success: false,
  //     // message: 'payment success',
  //     message: 'pay filed',
  //     data: result,
  //   });
  // }
});

// get paymentFailedUrl
const paymentFailed: RequestHandler = catchAsync(async (req, res, next) => {
  res.send(failedPayment());
});
// get payment cancelled
const paymentCancelled: RequestHandler = catchAsync(async (req, res, next) => {
  res.send(cancelledPayment());
});

const GetMonthlyPayment: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await PaymentService.getMonthlyPayment();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'pay requested receive success',
    data: result,
  });
});

export const paymentController = {
  PaymentRequest,
  paymentCancelled,
  paymentFailed,
  PaymentSuccess,
  GetMonthlyPayment,
};
