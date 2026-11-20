import { z } from 'zod';
import type { ComponentApi } from '@a2ui/web_core';
import { WeightSchema, dynString, spec } from '../../protocol/index.js';

export const RouteMapPropsSchema = z
  .object({
    title: dynString('Optional map card heading.').optional(),
    subtitle: dynString('Optional route overview caption.').optional(),
    regionPreset: z
      .enum(['sf-bay', 'pnw', 'auto'])
      .default('auto')
      .describe('Cartographic basemap preset or automatic lat/lng bounding projection.')
      .optional(),
    value: dynString('Two-way bound selected stop ID.').optional(),
    categoryFilter: dynString('Optional active category filter ("all" by default).').optional(),
    stops: z
      .array(
        spec(
          z.object({
            id: z.string().describe('Unique stop identifier.'),
            title: dynString('Landmark or stop name (e.g., "Ferry Building").'),
            subtitle: dynString('Short activity summary for this stop.').optional(),
            time: dynString('Optional schedule window (e.g., "9:00–9:45 AM").').optional(),
            category: z.string().describe('Category tag (e.g., "Food", "Landmark", "Views").').optional(),
            lat: z.number().min(-90).max(90).describe('Latitude in decimal degrees.'),
            lng: z.number().min(-180).max(180).describe('Longitude in decimal degrees.'),
            icon: z.string().optional(),
            badge: dynString('Optional badge pill (e.g., "Must see").').optional(),
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
    'Interactive cartographic route and stop-pin Component with category filter and adaptive expand overlay.',
  )
  .strict();

export type RouteMapProps = z.infer<typeof RouteMapPropsSchema>;

export const RouteMapApi = {
  name: 'RouteMap',
  schema: spec(RouteMapPropsSchema),
} satisfies ComponentApi;

export const ROUTE_MAP_ALLOWED_CHILDREN = 'none' as const;
