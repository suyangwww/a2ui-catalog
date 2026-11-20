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
    title: dynString('Optional diagram header title.').optional(),
    subtitle: dynString('Optional diagram summary caption.').optional(),
    viewBox: z
      .string()
      .default('0 0 640 280')
      .describe('SVG coordinate viewBox string (default "0 0 640 280").')
      .optional(),
    statusBadge: dynString(
      'Optional corner HUD status pill rendered inside the schematic stage.',
    ).optional(),
    value: dynString(
      'Two-way bound active subsystem group ID ("all" or a group/hotspot ID).',
    ).optional(),
    activeStep: dynNumber(
      'Optional 1-based stage or step index highlighting shapes whose step matches.',
    ).optional(),
    groups: z
      .array(
        spec(
          z.object({
            id: z.string().describe('Subsystem group identifier (e.g., "all", "ingress", "compute").'),
            label: dynString('Filter pill label.'),
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
            label: dynString('Subsystem or component title.'),
            badge: dynString('Optional short tag pill.').optional(),
            detail: dynString('Plain-language explanation of this subsystem.'),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .min(1)
      .max(16)
      .describe('Interactive numbered callout pins and subsystem detail cards.'),
    shapes: z
      .array(
        spec(
          z.object({
            kind: z.enum(['line', 'circle', 'rect', 'path']),
            group: z.string().optional(),
            step: z.number().int().optional(),
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
            rx: z.number().optional(),
            stroke: z.string().optional(),
            activeStroke: z.string().optional(),
            strokeWidth: z.number().optional(),
            strokeDasharray: z.string().optional(),
            fill: z.string().optional(),
            fillOpacity: z.number().min(0).max(1).optional(),
            animatedFlow: z.boolean().optional(),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .optional(),
    weight: WeightSchema.optional(),
  })
  .describe(
    'Data-driven interactive SVG schematic with subsystem filter pills, declarative vector shapes, and clickable hotspot callouts.',
  )
  .strict();

export type AnnotatedDiagramProps = z.infer<typeof AnnotatedDiagramPropsSchema>;

export const AnnotatedDiagramApi = {
  name: 'AnnotatedDiagram',
  schema: spec(AnnotatedDiagramPropsSchema),
} satisfies ComponentApi;

export const ANNOTATED_DIAGRAM_ALLOWED_CHILDREN = 'none' as const;
