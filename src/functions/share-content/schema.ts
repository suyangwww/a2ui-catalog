import { z } from 'zod';
import { DynamicStringSchema } from '../../protocol/index.js';

const ShareContentPropsSchema = z
  .object({
    title: DynamicStringSchema.describe('REF:#/$defs/DynamicString|Share title.'),
    text: DynamicStringSchema.describe('REF:#/$defs/DynamicString|Optional share body.').optional(),
    url: DynamicStringSchema.describe('REF:#/$defs/DynamicString|Optional URL to share.').optional(),
  })
  .strict();

export const ShareContentApi = {
  name: 'shareContent',
  returnType: 'boolean' as const,
  allowedCallers: 'rendererOnly' as const,
  requiresUserActivation: true,
  description:
    'Invokes native Web Share API on mobile devices or falls back to copying link/text.',
  schema: ShareContentPropsSchema,
};
