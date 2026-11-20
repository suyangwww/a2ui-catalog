import { z } from 'zod';
import { DynamicValueSchema } from '../../protocol/index.js';

const SetValuePropsSchema = z
  .object({
    path: z.string().describe('JSON pointer path in the surface DataModel.'),
    value: DynamicValueSchema.describe('REF:#/$defs/DynamicValue|New value to write at path.'),
  })
  .strict();

export const SetValueApi = {
  name: 'setValue',
  returnType: 'void' as const,
  allowedCallers: 'rendererOnly' as const,
  description: 'Updates a path in the local surface DataModel without an agent roundtrip.',
  schema: SetValuePropsSchema,
};
