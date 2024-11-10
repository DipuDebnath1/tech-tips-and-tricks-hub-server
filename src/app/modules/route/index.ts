import { CommentRoute } from '../comment/comment.route';
import { paymentRouter } from '../payment/payment.route';
import { PostRoute } from '../post/post.route';
import { UserRoute } from '../user/user.route';
import express from 'express';

const router = express.Router();
const moduleRoute = [
  {
    path: '/auth',
    route: UserRoute,
  },
  {
    path: '/posts',
    route: PostRoute,
  },
  {
    path: '/comments',
    route: CommentRoute,
  },
  {
    path: '/payment',
    route: paymentRouter,
  },
];

moduleRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
