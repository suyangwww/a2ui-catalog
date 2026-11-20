import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, dynString, spec } from '../../protocol/index.js';

export const RouteMapPropsSchema = z
  .object({
    title: dynString('Optional map card heading.').optional(),
    subtitle: dynString('Optional route overview caption.').optional(),
    value: dynString('Two-way bound selected stop ID.').optional(),
    categoryFilter: dynString('Optional active category filter ("all" by default).').optional(),
    bounds: spec(
      z.object({
        minLat: z.number().min(-90).max(90),
        maxLat: z.number().min(-90).max(90),
        minLng: z.number().min(-180).max(180),
        maxLng: z.number().min(-180).max(180),
      }),
      { closure: 'additionalProperties' },
    )
      .describe(
        'Optional geographic bounding box; when omitted, bounds are computed automatically from stops.',
      )
      .optional(),
    features: z
      .array(
        spec(
          z.object({
            kind: z.enum(['water', 'land', 'park', 'road', 'bridge', 'label']),
            d: z.string().optional(),
            x: z.number().optional(),
            y: z.number().optional(),
            x1: z.number().optional(),
            y1: z.number().optional(),
            x2: z.number().optional(),
            y2: z.number().optional(),
            width: z.number().optional(),
            height: z.number().optional(),
            r: z.number().optional(),
            strokeWidth: z.number().optional(),
            text: z.string().optional(),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .describe(
        'Optional declarative cartographic backdrop features in 640x340 viewport space.',
      )
      .optional(),
    routeStyle: z
      .enum(['orthogonal', 'direct'])
      .default('orthogonal')
      .describe('Connecting route path geometry between stops.')
      .optional(),
    stops: z
      .array(
        spec(
          z.object({
            id: z.string().describe('Unique stop identifier.'),
            title: dynString('Landmark or stop name.'),
            subtitle: dynString('Short activity summary for this stop.').optional(),
            time: dynString('Optional schedule window (e.g., "9:00–9:45 AM").').optional(),
            category: z.string().describe('Category tag (e.g., "Food", "Views").').optional(),
            lat: z.number().min(-90).max(90).describe('Latitude in decimal degrees.'),
            lng: z.number().min(-180).max(180).describe('Longitude in decimal degrees.'),
            icon: z.string().optional(),
            badge: dynString('Optional badge pill.').optional(),
            detourNote: dynString('Optional note on what is worth a nearby detour.').optional(),
          }),
          { closure: 'additionalProperties' },
        ),
      )
      .min(1)
      .max(20)
      .describe('Ordered route stops plotted along the itinerary.'),
    expandable: z.boolean().default(true).optional(),
    height: z.number().min(180).max(520).default(290).optional(),
    weight: WeightSchema.optional(),
  })
  .describe(
    'Data-driven interactive cartographic route and stop-pin Component with automatic lat/lng projection, category filter, and adaptive expand overlay.',
  )
  .strict();

export type RouteMapProps = z.infer<typeof RouteMapPropsSchema>;

export const RouteMapApi = {
  name: 'RouteMap',
  schema: spec(RouteMapPropsSchema),
} satisfies ComponentApi;

export const ROUTE_MAP_ALLOWED_CHILDREN = 'none' as const;
