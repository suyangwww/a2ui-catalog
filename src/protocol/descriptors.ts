import type { z } from 'zod';
import type { ComponentApi, FunctionImplementation } from '@a2ui/web_core';

export type LuminaComponentGroup =
  | 'Layout & Containers'
  | 'Text, Media & Identity'
  | 'Buttons & Form Inputs'
  | 'Agent Thinking & Approvals'
  | 'Sources, Code & Documents'
  | 'Numbers, Charts & Next Steps';

export interface LuminaRenderArgs<ChildNode = unknown> {
  readonly props: Record<string, unknown>;
  readonly buildChild: (id: string, basePath?: string) => ChildNode;
  readonly accessibilityRef?: ((el: Element | null) => void) | undefined;
  readonly validationErrorsRef?: ((el: Element | null) => void) | undefined;
}

export interface CatalogComponentDescriptor<
  S extends z.ZodObject<z.ZodRawShape> = z.ZodObject<z.ZodRawShape>,
  ChildNode = unknown,
> {
  readonly id: string;
  readonly slug: string;
  readonly group: LuminaComponentGroup;
  readonly api: ComponentApi;
  readonly propsSchema: S;
  readonly schemaKeys: Readonly<Record<string, true>>;
  readonly allowedChildren: readonly string[] | 'any' | 'none';
  readonly renderer: (args: LuminaRenderArgs<ChildNode>) => ChildNode;
}

export interface DefineCatalogComponentInput<
  S extends z.ZodObject<z.ZodRawShape>,
  ChildNode = unknown,
> {
  readonly id: string;
  readonly slug: string;
  readonly group: LuminaComponentGroup;
  readonly api: ComponentApi;
  readonly propsSchema: S;
  readonly allowedChildren: readonly string[] | 'any' | 'none';
  readonly renderer: (args: LuminaRenderArgs<ChildNode>) => ChildNode;
}

export function extractSchemaKeys(
  schema: z.ZodObject<z.ZodRawShape>,
): Readonly<Record<string, true>> {
  const keys: Record<string, true> = {};
  for (const key of Object.keys(schema.shape)) {
    keys[key] = true;
  }
  return keys;
}

export function defineCatalogComponent<
  S extends z.ZodObject<z.ZodRawShape>,
  ChildNode = unknown,
>(input: DefineCatalogComponentInput<S, ChildNode>): CatalogComponentDescriptor<S, ChildNode> {
  return {
    id: input.id,
    slug: input.slug,
    group: input.group,
    api: input.api,
    propsSchema: input.propsSchema,
    schemaKeys: extractSchemaKeys(input.propsSchema),
    allowedChildren: input.allowedChildren,
    renderer: input.renderer,
  };
}

export interface CatalogFunctionSliceDescriptor {
  readonly slug: string;
  readonly implementations: readonly FunctionImplementation[];
}

export function defineCatalogFunction(
  input: CatalogFunctionSliceDescriptor,
): CatalogFunctionSliceDescriptor {
  return {
    slug: input.slug,
    implementations: input.implementations,
  };
}
