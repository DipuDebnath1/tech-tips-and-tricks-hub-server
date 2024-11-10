import { z } from 'zod';

export const paymentValidation = z.object({
  body: z.object({
    userId: z.string(),
    amount: z.number(),
  }),
});
