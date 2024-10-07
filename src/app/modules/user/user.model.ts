import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';
// import config from "../../config";
import bcrypt from 'bcrypt';
import config from '../../../config';

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
    },
    totalFollower: {
      type: Number,
      default: 0,
    },
    totalFollowing: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const userData = this;
  userData.password = await bcrypt.hash(
    userData.password,
    Number(config.saltRounds),
  );
  next();
});

userSchema.set('toJSON', {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform: function (doc, ret, options) {
    ret.password = undefined; // or delete ret.password;
    return ret;
  },
});

export const User = model<TUser>('user', userSchema);
