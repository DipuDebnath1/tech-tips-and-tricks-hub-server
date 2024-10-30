/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from 'express';
import catchAsync from '../../utills/catchAsync';
import sendResponse from '../../utills/sendResponse';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../ErrorHandler/AppError';
import { PostServices } from './post.service';
import { tokenDecoded } from '../../utills/tokenDecoded';

// *************user*********
// create a post
const AddPost: RequestHandler = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'you are unauthorized user ');
  }
  const decoded = tokenDecoded(token) as JwtPayload;

  if (!decoded) {
    new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized, missing token');
  }

  const result = await PostServices.postAddIntoDB({
    ...req.body,
    author: decoded?.data._id,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'post successfully',
    success: true,
    data: result,
  });
});

//get all post
const FindAllPost = catchAsync(async (req, res, next) => {
  const query = req.query;
  const token = req.headers.authorization;
  if (token) {
    const decoded = tokenDecoded(token) as JwtPayload;

    if (!decoded) {
      new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized, missing token');
    }

    const result = await PostServices.findAllPost(
      decoded?.data?.isPremium || false,
      (query?.category as string) || '',
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'post retrieved successfully',
      success: true,
      data: result,
    });
  } else {
    const result = await PostServices.findAllPost(
      false,
      (query?.category as string) || '',
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'post retrieved successfully',
      success: true,
      data: result,
    });
  }
});

//get all post
const FindSinglePost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;

  const result = await PostServices.findSinglePost(postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'post retrieved  successfully',
    success: true,
    data: result,
  });
});

//add upvote

const AddUpVote: RequestHandler = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization;
  const { postId } = req.params;
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'you are unauthorized user ');
  }
  const decoded = tokenDecoded(token) as JwtPayload;

  if (!decoded) {
    new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized, missing token');
  }

  const result = await PostServices.upvoteAPost({
    userId: decoded?.data._id,
    postId,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'upVoted successfully',
    success: true,
    data: result,
  });
});
//add downvote

const AddDownVote: RequestHandler = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization;
  const { postId } = req.params;
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'you are unauthorized user ');
  }
  const decoded = tokenDecoded(token) as JwtPayload;

  if (!decoded) {
    new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized, missing token');
  }

  const result = await PostServices.downvoteAPost({
    userId: decoded?.data._id,
    postId,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'down Voted successfully',
    success: true,
    data: result,
  });
});

export const PostController = {
  AddPost,
  FindAllPost,
  FindSinglePost,
  AddUpVote,
  AddDownVote,
};
