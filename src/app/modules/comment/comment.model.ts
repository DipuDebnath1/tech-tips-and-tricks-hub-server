import { Schema, model } from 'mongoose';
import { TComment } from './comment.interface';

const userSchema = new Schema<TComment>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'post', required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const CommentCollection = model<TComment>('comment', userSchema);
