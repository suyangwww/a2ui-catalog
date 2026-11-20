import { z } from 'zod';
import { DynamicStringSchema } from '../../protocol/index.js';

const CopyToClipboardPropsSchema = z
  .object({
    text: DynamicStringSchema.describe('REF:#/$defs/DynamicString|Text to copy to clipboard.'),
    label: DynamicStringSchema.describe(
      'REF:#/$defs/DynamicString|Optional confirmation toast text.',
    ).optional(),
  })
  .strict();

export const CopyToClipboardApi = {
  name: 'copyToClipboard',
  returnType: 'void' as const,
  allowedCallers: 'rendererOnly' as const,
  requiresUserActivation: true,
  description: 'Copies text to the system clipboard and displays a confirmation toast.',
  schema: CopyToClipboardPropsSchema,
};
