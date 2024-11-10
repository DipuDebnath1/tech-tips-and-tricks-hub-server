/* eslint-disable @typescript-eslint/no-explicit-any */
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
  } catch (err: any) {
    throw new AppError(
      httpStatus.CONFLICT,
      err.message || 'post create failed',
    );
  }
};

// *********find operation *********

// find User PostAllData
const findMyAllPost = async (author: string) => {
  const query = { author: new ObjectId(author) };
  try {
    const post = await PostsCollection.find(query)
      .sort({ createdAt: -1 })
      .populate('author');
    return post;
  } catch (err: any) {
    throw new AppError(
      httpStatus.CONFLICT,
      err.message || 'post retrieved failed',
    );
  }
};

// find all post with query
const findAllPost = async (
  role: string,
  isVerified: boolean,
  category?: string,
) => {
  try {
    const params: {
      category?: string;
      isPremium?: boolean;
      isDeleted: boolean;
    } = { isDeleted: false };

    if (category) {
      params.category = category;
    }
    if (!isVerified && role !== 'admin') {
      params.isPremium = false;
    }

    const res = await PostsCollection.find(params)
      .sort({ createdAt: -1 })
      .populate('author');
    return res;
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

//find all deleted product
const findAllDeletedPost = async (category: string) => {
  const params: {
    category?: string;
    isDeleted: boolean;
  } = { isDeleted: true };

  if (category) {
    params.category = category;
  }
  const res = await PostsCollection.find(params).populate('author');
  if (!res) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }
  return res;
};

// *********update operation *********

// upvote
const updatePost = async (
  userId: string,
  postId: string,
  payload: Partial<TPosts>,
) => {
  const session = await PostsCollection.startSession();
  try {
    session.startTransaction();
    const post = await PostsCollection.findById(postId).session(session);
    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, 'post Data not found');
    }

    if (post?.author.toString() !== userId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'you can not access this post !',
      );
    }

    const res = await PostsCollection.findByIdAndUpdate(postId, payload, {
      new: true,
      session,
    });

    await session.commitTransaction();
    return res;
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

//delete
const deletePost = async (
  postId: string,
  userId: string,
  role: 'user' | 'admin',
) => {
  const session = await PostsCollection.startSession();
  try {
    session.startTransaction();
    const post = await PostsCollection.findById(postId).session(session);
    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, 'post Data not found');
    }

    if (post?.author.toString() !== userId && role !== 'admin') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'you can not access this post !',
      );
    }

    post.isDeleted = true;
    post.deletedBy = role;
    await post.save({ session });

    // const res = await PostsCollection.findByIdAndDelete(postId, { session });

    await session.commitTransaction();
    return post;
  } catch (err: any) {
    session.abortTransaction();
    console.log(err);
    throw new AppError(
      httpStatus.CONFLICT,
      err.message || 'upvote delete failed',
    );
  } finally {
    session.endSession();
  }
};

//*********admin ******** */
export const PostServices = {
  postAddIntoDB,
  findMyAllPost,
  findAllDeletedPost,
  updatePost,
  deletePost,
  findAllPost,
  findSinglePost,
  upvoteAPost,
  downvoteAPost,
};
