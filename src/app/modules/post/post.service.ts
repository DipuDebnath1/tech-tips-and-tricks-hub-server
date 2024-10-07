/* eslint-disable no-console */
import httpStatus from 'http-status';
import AppError from '../../ErrorHandler/AppError';
import { TPosts } from './post.interface';
import { PostsCollection } from './post.model';

// ********user*********
const postAddIntoDB = async (payload: TPosts) => {
  try {
    const post = (await PostsCollection.create(payload)).populate('author');
    return post;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err);
    throw new AppError(
      httpStatus.CONFLICT,
      err.message || 'post create failed',
    );
  }
};

export const PostServices = {
  postAddIntoDB,
};
