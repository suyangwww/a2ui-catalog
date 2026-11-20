import { z } from 'zod';
import {
  ActionSchema,
  CheckRuleSchema,
  ChildListSchema,
  ChildSchema,
  DataBindingSchema,
  DynamicBooleanSchema,
  DynamicNumberSchema,
  DynamicStringListSchema,
  DynamicStringSchema,
  DynamicValueSchema,
  WeightSchema,
  spec as rawSpec,
} from '@a2ui/web_core/v1_0';

export function spec<T extends z.ZodTypeAny>(
  schema: T,
  options: Parameters<typeof rawSpec>[1] = {},
): T {
  return rawSpec(schema, options);
}

export {
  ActionSchema,
  CheckRuleSchema,
  ChildListSchema,
  ChildSchema,
  DataBindingSchema,
  DynamicBooleanSchema,
  DynamicNumberSchema,
  DynamicStringListSchema,
  DynamicStringSchema,
  DynamicValueSchema,
  WeightSchema,
};

export function dynString(description?: string) {
  return description
    ? DynamicStringSchema.describe(`REF:#/$defs/DynamicString|${description}`)
    : DynamicStringSchema.describe('REF:#/$defs/DynamicString');
}

export function dynNumber(description?: string) {
  return description
    ? DynamicNumberSchema.describe(`REF:#/$defs/DynamicNumber|${description}`)
    : DynamicNumberSchema.describe('REF:#/$defs/DynamicNumber');
}

export function dynBoolean(description?: string) {
  return description
    ? DynamicBooleanSchema.describe(`REF:#/$defs/DynamicBoolean|${description}`)
    : DynamicBooleanSchema.describe('REF:#/$defs/DynamicBoolean');
}

export function dynStringList(description?: string) {
  return description
    ? DynamicStringListSchema.describe(`REF:#/$defs/DynamicStringList|${description}`)
    : DynamicStringListSchema.describe('REF:#/$defs/DynamicStringList');
}

export function dynValue(description?: string) {
  return description
    ? DynamicValueSchema.describe(`REF:#/$defs/DynamicValue|${description}`)
    : DynamicValueSchema.describe('REF:#/$defs/DynamicValue');
}

export function childRef(description?: string) {
  return description
    ? ChildSchema.describe(`REF:#/$defs/Child|${description}`)
    : ChildSchema.describe('REF:#/$defs/Child');
}

export function childListRef(description?: string) {
  return description
    ? ChildListSchema.describe(`REF:#/$defs/ChildList|${description}`)
    : ChildListSchema.describe('REF:#/$defs/ChildList');
}

export function actionRef(description?: string) {
  return description
    ? ActionSchema.describe(`REF:#/$defs/Action|${description}`)
    : ActionSchema.describe('REF:#/$defs/Action');
}

export const checksField = z
  .array(CheckRuleSchema.describe('REF:#/$defs/CheckRule'))
  .describe('Validation check rules to evaluate on this component.')
  .optional();

export const CommonProps = {
  id: z.string().optional(),
  weight: WeightSchema.optional(),
};

export const CheckableProps = {
  ...CommonProps,
  checks: checksField,
};

export const GapEnum = z.enum(['none', 'xs', 'sm', 'md', 'lg', 'xl']);
export const ToneEnum = z.enum(['neutral', 'info', 'accent', 'success', 'warning', 'critical']);
export const ChartColorEnum = z.enum(['blue', 'indigo', 'emerald', 'amber', 'rose', 'cyan', 'slate']);

export const BASIC_ICON_NAMES = [
  'accountCircle', 'add', 'arrowBack', 'arrowForward', 'attachFile',
  'calendarToday', 'call', 'camera', 'check', 'close',
  'delete', 'download', 'edit', 'event', 'error',
  'fastForward', 'favorite', 'favoriteOff', 'folder', 'help',
  'home', 'info', 'locationOn', 'lock', 'lockOpen',
  'mail', 'menu', 'moreVert', 'moreHoriz', 'notificationsOff',
  'notifications', 'pause', 'payment', 'person', 'phone',
  'photo', 'play', 'print', 'refresh', 'rewind',
  'search', 'send', 'settings', 'share', 'shoppingCart',
  'skipNext', 'skipPrevious', 'star', 'starHalf', 'starOff',
  'stop', 'upload', 'visibility', 'visibilityOff', 'volumeDown',
  'volumeMute', 'volumeOff', 'volumeUp', 'warning',
] as const;

export const AGENTIC_ICON_NAMES = [
  'sparkles', 'brain', 'terminal', 'code', 'gitPullRequest',
  'shieldCheck', 'flight', 'hotel', 'trendingUp', 'trendingDown',
  'globe', 'fileText', 'copy', 'externalLink', 'clock',
  'zap', 'sliders', 'layers', 'wallet', 'chartBar',
  'alertTriangle', 'checkCircle', 'xCircle', 'compass', 'database',
] as const;

export const ALL_ICON_NAMES = [...BASIC_ICON_NAMES, ...AGENTIC_ICON_NAMES] as const;
export type LuminaIconName = (typeof ALL_ICON_NAMES)[number];
