import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import {
  WeightSchema,
  dynNumber,
  dynString,
  spec,
} from '../../protocol/index.js';

export const AnnotatedDiagramPropsSchema = z
  .object({
    title: dynString('Optional diagram header title (e.g., "7-Speed Bicycle").').optional(),
    subtitle: dynString('Optional diagram summary caption.').optional(),
    preset: z
      .enum(['bicycle-7speed', 'architecture', 'custom'])
      .default('custom')
      .describe('Built-in technical illustration preset or custom declarative shapes.')
      .optional(),
    value: dynString('Two-way bound active subsystem group ID ("all" or a group/hotspot ID).').optional(),
    groups: z
      .array(
        spec(
          z.object({
            id: z.string().describe('Group identifier (e.g., "all", "frame", "drivetrain").'),
            label: dynString('Pill label.'),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .max(10)
      .optional(),
    hotspots: z
      .array(
        spec(
          z.object({
            id: z.string().describe('Unique hotspot identifier.'),
            group: z.string().describe('Subsystem group ID this hotspot belongs to.').optional(),
            x: z.number().min(0).max(100).describe('Horizontal percentage coordinate (0..100).'),
            y: z.number().min(0).max(100).describe('Vertical percentage coordinate (0..100).'),
            label: dynString('System or part title (e.g., "Seven ways to move").'),
            badge: dynString('Optional short tag (e.g., "Drivetrain").').optional(),
            detail: dynString('Plain-language explanation of this subsystem.'),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .min(1)
      .max(16)
      .describe('Interactive callout pins and subsystem descriptions.'),
    shapes: z
      .array(
        spec(
          z.object({
            kind: z.enum(['line', 'circle', 'rect', 'path']),
            group: z.string().optional(),
            d: z.string().optional(),
            x1: z.number().optional(),
            y1: z.number().optional(),
            x2: z.number().optional(),
            y2: z.number().optional(),
            cx: z.number().optional(),
            cy: z.number().optional(),
            r: z.number().optional(),
            x: z.number().optional(),
            y: z.number().optional(),
            width: z.number().optional(),
            height: z.number().optional(),
            stroke: z.string().optional(),
            fill: z.string().optional(),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .optional(),
    activeStep: dynNumber('Optional numeric gear or step (e.g., 1..7) highlighted in the diagram.').optional(),
    cadence: dynNumber('Optional RPM cadence driving motion speed.').optional(),
    weight: WeightSchema.optional(),
  })
  .describe(
    'Interactive technical SVG schematic with subsystem filter pills and clickable hotspot callouts.',
  )
  .strict();

export type AnnotatedDiagramProps = z.infer<typeof AnnotatedDiagramPropsSchema>;

export const AnnotatedDiagramApi = {
  name: 'AnnotatedDiagram',
  schema: spec(AnnotatedDiagramPropsSchema),
} satisfies ComponentApi;

export const ANNOTATED_DIAGRAM_ALLOWED_CHILDREN = 'none' as const;
