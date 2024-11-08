import { Schema, model } from 'mongoose';
import { TPosts } from './post.interface';

const userSchema = new Schema<TPosts>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    images: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Web',
        'Software Engineering',
        'AI',
        'Hardware',
        'Mobile Apps',
        'Tech Gadgets',
      ],
    },
    tags: { type: [String], default: [] },
    isPremium: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    upVotes: { type: [Schema.Types.ObjectId], default: [] },
    downVotes: { type: [Schema.Types.ObjectId], default: [] },
    comments: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

export const PostsCollection = model<TPosts>('post', userSchema);
