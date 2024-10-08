/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../ErrorHandler/AppError';
import { CommentCollection } from './comment.model';
import { TComment } from './comment.interface';
import { PostsCollection } from '../post/post.model';
import { Types } from 'mongoose';

// ********premium user*********
// find all post with query

// ********all*********
const CommentAddIntoDB = async (payload: TComment) => {
  const session = await CommentCollection.startSession();
  try {
    session.startTransaction();

    const res = await CommentCollection.create([payload], { session });
    const comment = res[0];

    const post = await PostsCollection.findById(payload.post).session(session);
    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
    }

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
    // End the session
    session.endSession();
  }
};

const findComment = async (id: string) => {
  const res = await CommentCollection.find({
    post: new Types.ObjectId(id),
  }).populate('author');
  return res;
};
export const CommentServices = {
  CommentAddIntoDB,
  findComment,
};
