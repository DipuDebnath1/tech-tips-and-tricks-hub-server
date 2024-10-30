import express from 'express';
import validationRequest from '../../utills/validationRequest';
import { verifyUser } from '../../../midlewere/auth';
import postValidation from './comment.validation';
import { CommentController } from './comment.controller';
const router = express.Router();

//******* user ***********
router.post(
  '/',
  validationRequest(postValidation.postValidationSchema),
  verifyUser(),
  CommentController.AddComment,
);
router.get('/:postId', CommentController.FindComment);
router.delete('/:commentId', CommentController.DeleteComment);

export const CommentRoute = router;
