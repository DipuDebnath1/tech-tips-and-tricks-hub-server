/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from 'express';
import catchAsync from '../../utills/catchAsync';
import sendResponse from '../../utills/sendResponse';
import httpStatus from 'http-status';
import config from '../../../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../../ErrorHandler/AppError';
import { PostServices } from './post.service';

// *************user*********
const AddPost: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await PostServices.postAddIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'post successfully',
    success: true,
    // data: req.body,
    data: result,
  });
});

export const PostController = {
  AddPost,
};
