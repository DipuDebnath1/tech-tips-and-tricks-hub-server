/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../ErrorHandler/AppError';
import { CommentCollection } from './comment.model';
import { TComment } from './comment.interface';
import { PostsCollection } from '../post/post.model';
import { Types } from 'mongoose';
import { ObjectId } from 'mongodb';

// ********premium user*********
// find all post with query

// ********all*********
// add comment
const CommentAddIntoDB = async (payload: TComment) => {
  const session = await CommentCollection.startSession();
  try {
    session.startTransaction();

    const post = await PostsCollection.findById(payload.post).session(session);
    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
    }

    const res = await CommentCollection.create([payload], { session });
    const comment = res[0];

    post.comments = post.comments ? post.comments + 1 : 1;

    await post.save({ session });

    await session.commitTransaction();

    const populatedComment = await comment.populate('author post');

    return populatedComment;
  } catch (err: any) {
    await session.abortTransaction();
    throw new AppError(
      httpStatus.CONFLICT,
      err.message || 'Failed to create comment',
    );
  } finally {
    session.endSession();
  }
};

// find comment
const findComment = async (id: string) => {
  const res = await CommentCollection.find({
    post: new Types.ObjectId(id),
  })
    .sort({ createdAt: -1 })
    .populate('author');
  return res;
};

// delete comment
const deleteComment = async ({
  userId,
  commentId,
  postId,
}: {
  userId: string;
  commentId: string;
  postId: string;
}) => {
  const query = {
    _id: new ObjectId(commentId),
    author: new ObjectId(userId),
    post: new ObjectId(postId),
  };
  const session = await CommentCollection.startSession();
  try {
    session.startTransaction();

    const post = await PostsCollection.findById(postId).session(session);
    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
    }

    const comment = await CommentCollection.deleteOne(query).session(session);

    post.comments = post.comments && post.comments - 1;

    await post.save({ session });

    await session.commitTransaction();

    return comment;
  } catch (err: any) {
    await session.abortTransaction();
    throw new AppError(
      httpStatus.CONFLICT,
      err.message || 'Failed to create comment',
    );
  } finally {
    session.endSession();
  }
};

export const CommentServices = {
  CommentAddIntoDB,
  findComment,
  deleteComment,
};
