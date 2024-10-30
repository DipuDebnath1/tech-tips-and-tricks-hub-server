import { CommentRoute } from '../comment/comment.route';
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
];

moduleRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
