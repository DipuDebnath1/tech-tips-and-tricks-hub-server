import { Types } from 'mongoose';

export type TPosts = {
  author: Types.ObjectId;
  title: string;
  content: string;
  images: string;
  category:
    | 'Web'
    | 'Software Engineering'
    | 'AI'
    | 'Hardware'
    | 'Mobile Apps'
    | 'Tech Gadgets';
  tags?: string[];
  isPremium: boolean;
  upVotes?: Types.ObjectId[];
  downVotes?: Types.ObjectId[];
  comments?: number;
};
