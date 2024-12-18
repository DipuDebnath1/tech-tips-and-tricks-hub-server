import express from 'express';
import validationRequest from '../../utills/validationRequest';
import {
  verifyAdmin,
  verifyLoginUser,
  verifyUser,
} from '../../../midlewere/auth';
import postValidation from './post.validation';
import { PostController } from './post.controller';
const router = express.Router();

//******* user ***********
// post a data
router.post(
  '/',
  validationRequest(postValidation.postValidationSchema),
  verifyUser(),
  PostController.AddPost,
);
// upvote
router.post('/upvote/:postId', verifyLoginUser(), PostController.AddUpVote);
// downvote;
router.post('/downvote/:postId', verifyLoginUser(), PostController.AddDownVote);

// FindAllPost
router.get('/', PostController.FindAllPost);
router.get('/my-post', PostController.FindMyAllPost);
router.get('/deleted-posts', verifyAdmin(), PostController.FindAllDeletedPost);
router.get('/:postId', PostController.FindSinglePost);
router.put('/:postId', verifyLoginUser(), PostController.UpdatePost);
router.delete('/:postId', verifyLoginUser(), PostController.DeletePost);

export const PostRoute = router;
