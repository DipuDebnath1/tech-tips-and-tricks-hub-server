import express from 'express';
import validationRequest from '../../utills/validationRequest';
import { verifyUser } from '../../../midlewere/auth';
import postValidation from './post.validation';
import { PostController } from './post.controller';
const router = express.Router();

//******* user ***********
router.post(
  '/',
  validationRequest(postValidation.postValidationSchema),
  verifyUser(),
  PostController.AddPost,
);

export const PostRoute = router;
