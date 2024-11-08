import express from 'express';
import { UserController } from './user.controller';
import validationRequest from '../../utills/validationRequest';
import userValidation from './user.validation';
import {
  verifyAdmin,
  verifyLoginUser,
  verifyUser,
} from '../../../midlewere/auth';
const router = express.Router();

//******* user ***********
router.post(
  '/signup',
  validationRequest(userValidation.userValidationSchema),
  UserController.createStudent,
);
router.post('/signin', UserController.LoginUser);
router.post('/following', verifyUser(), UserController.FollowingUser);
router.post('/un-following', verifyUser(), UserController.UnFollowingUser);
router.post('/update-role', verifyAdmin(), UserController.ChangeUserRole);
router.post('/unblock', verifyAdmin(), UserController.UnBlockedUser);
router.post('/block', verifyAdmin(), UserController.BlockedUser);

router.get('/all-users', verifyAdmin(), UserController.FindAllUser);
router.get('/:id', verifyLoginUser(), UserController.FindSingleUser);

router.put('/update-profile', verifyUser(), UserController.UpdateUserProfile);

export const UserRoute = router;
