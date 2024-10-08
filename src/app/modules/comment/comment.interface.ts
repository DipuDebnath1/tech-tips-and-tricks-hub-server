import { Types } from 'mongoose';

export type TComment = {
  author: Types.ObjectId;
  post: Types.ObjectId;
  content: string;
};
