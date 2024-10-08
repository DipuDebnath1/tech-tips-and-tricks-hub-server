import { z } from 'zod';

const postValidationSchema = z.object({
  body: z.object({
    post: z.string(),
    content: z.string(),
  }),
});

export default {
  postValidationSchema,
};
