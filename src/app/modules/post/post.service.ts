/* eslint-disable no-console */
import httpStatus from 'http-status';
import AppError from '../../ErrorHandler/AppError';
import { TPosts } from './post.interface';
import { PostsCollection } from './post.model';
import { ObjectId } from 'mongodb';

// ******** user*********

// post a data
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
// find all post with query
const findAllPost = async (isPremium: boolean, category?: string) => {
  console.log(isPremium);

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

    const res = await PostsCollection.find(params)
      .sort({ createdAt: -1 })
      .populate('author');
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

//find single product
const findSinglePost = async (id: string) => {
  const res = PostsCollection.findById(id).populate('author');
  if (!res) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }
  return res;
};

// upvote
const upvoteAPost = async ({
  userId,
  postId,
}: {
  userId: string;
  postId: string;
}) => {
  const session = await PostsCollection.startSession();
  try {
    session.startTransaction();
    const post = await PostsCollection.findById(postId).session(session);
    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, 'post Data not found');
    }
    const isVoted = post.upVotes?.some((item) => item.equals(userId));

    if (isVoted) {
      await session.commitTransaction();
      return post;
    }
    // remove  downVotes
    post.downVotes = post.downVotes?.filter((item) => !item.equals(userId));
    // add  upVotes
    post.upVotes?.push(new ObjectId(userId));

    await post.save({ session });
    await session.commitTransaction();
    return post;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    session.abortTransaction();
    console.log(err);
    throw new AppError(
      httpStatus.CONFLICT,
      err.message || 'upvote create failed',
    );
  } finally {
    session.endSession();
  }
};
// downvote
const downvoteAPost = async ({
  userId,
  postId,
}: {
  userId: string;
  postId: string;
}) => {
  const session = await PostsCollection.startSession();
  try {
    session.startTransaction();
    const post = await PostsCollection.findById(postId).session(session);
    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, 'post Data not found');
    }
    const isDownVoted = post.downVotes?.some((item) => item.equals(userId));

    if (isDownVoted) {
      await session.commitTransaction();
      return post;
    }
    // remove  downVotes
    post.upVotes = post.upVotes?.filter((item) => !item.equals(userId));
    // add  upVotes
    post.downVotes?.push(new ObjectId(userId));

    await post.save({ session });
    await session.commitTransaction();
    return post;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    session.abortTransaction();
    console.log(err);
    throw new AppError(
      httpStatus.CONFLICT,
      err.message || 'upvote create failed',
    );
  } finally {
    session.endSession();
  }
};

//*********admin ******** */
export const PostServices = {
  postAddIntoDB,
  findAllPost,
  findSinglePost,
  upvoteAPost,
  downvoteAPost,
};
