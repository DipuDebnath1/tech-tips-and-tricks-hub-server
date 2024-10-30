/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from 'express';
import catchAsync from '../../utills/catchAsync';
import sendResponse from '../../utills/sendResponse';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../ErrorHandler/AppError';
import { tokenDecoded } from '../../utills/tokenDecoded';
import { CommentServices } from './comment.service';

// *************user*********
// create a post
const AddComment: RequestHandler = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'you are unauthorized user ');
  }
  const decoded = tokenDecoded(token) as JwtPayload;

  if (!decoded) {
    new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized, missing token');
  }

  const result = await CommentServices.CommentAddIntoDB({
    ...req.body,
    author: decoded?.data._id,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'comment add successfully',
    success: true,
    data: result,
  });
});

// find post
const FindComment: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await CommentServices.findComment(req.params.postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'comment retrieved successfully',
    success: true,
    data: result,
  });
});

// delete post
const DeleteComment: RequestHandler = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'you are unauthorized user ');
  }
  const decoded = tokenDecoded(token) as JwtPayload;

  if (!decoded) {
    new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized, missing token');
  }
  const result = await CommentServices.deleteComment({
    postId: req.body.postId,
    commentId: req.params.commentId,
    userId: decoded?.data._id,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'comment delete successfully',
    success: true,
    data: result,
  });
});

export const CommentController = {
  AddComment,
  FindComment,
  DeleteComment,
};
