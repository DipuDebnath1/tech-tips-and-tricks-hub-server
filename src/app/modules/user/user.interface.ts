export type TUser = {
  name: string;
  email: string;
  password: string;
  phone: string;
  img: string;
  role: 'user' | 'admin';
  isPremium: boolean;
  isVerified: boolean;
  isBlocked: boolean;
  address: string;
  totalFollower: number;
  totalFollowing: number;
};
