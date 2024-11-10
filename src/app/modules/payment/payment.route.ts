import express from 'express';
import { verifyUser } from '../../../midlewere/auth';
import { paymentController } from './payment.controller';
import validationRequest from '../../utills/validationRequest';
import { paymentValidation } from './payment.validation';

const router = express.Router();

router.post(
  '/',
  validationRequest(paymentValidation),
  verifyUser(),
  paymentController.PaymentRequest,
);
router.get('/success', paymentController.PaymentSuccess);
router.get('/failed', paymentController.paymentFailed);
router.get('/cancelled', paymentController.paymentCancelled);

export const paymentRouter = router;
