import { z } from 'zod';

const postValidationSchema = z.object({
  body: z.object({
    title: z.string(),
    content: z.string(),
    images: z.string(),
    category: z.enum([
      'Web',
      'Software Engineering',
      'AI',
      'Hardware',
      'Mobile Apps',
      'Tech Gadgets',
    ]),
    tags: z.array(z.string()).optional(),
    isPremium: z.boolean().optional(),
    upVotes: z.number().optional(),
    downVotes: z.number().optional(),
    comments: z.number().optional(),
  }),
});

export default {
  postValidationSchema,
};
