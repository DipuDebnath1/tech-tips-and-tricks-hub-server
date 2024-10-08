/* eslint-disable no-console */
import httpStatus from 'http-status';
import AppError from '../../ErrorHandler/AppError';
import { TPosts } from './post.interface';
import { PostsCollection } from './post.model';

// ********premium user*********
// find all post with query

const findAllPost = async (isPremium: boolean, category?: string) => {
  console.log(isPremium, category);

  try {
    const params: {
      category?: string;
      isPremium?: boolean;
    } = {};

    if (category) {
      params.category = category;
    }
    if (!isPremium) {
      params.isPremium = false;
    }

    const res = await PostsCollection.find(params);
    return res;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err);
    throw new AppError(
      httpStatus.CONFLICT,
      err.message || 'post create failed',
    );
  }
};

// ********all*********
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
  findAllPost,
};
