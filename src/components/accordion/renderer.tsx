import React from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import {
  LuminaIconGlyph,
  readBoolean,
  readOptionalString,
  readRecordArray,
  readString,
  renderChildRef,
  springFluid,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function AccordionRenderer({ props, buildChild }: LuminaReactRenderArgs): React.ReactNode {
  const items = readRecordArray(props.items);
  const variant = readString(props.variant, 'grouped');
  const allowMultiple = readBoolean(props.allowMultiple, false);
  const defaultOpenIds = items
    .filter((item) => readBoolean(item.defaultOpen, false))
    .map((item) => readString(item.id))
    .filter(Boolean);

  const renderItems = () =>
    items.map((item, idx) => {
      const id = readString(item.id, `item-${idx}`);
      const icon = readOptionalString(item.icon);
      const subtitle = readOptionalString(item.subtitle);
      return (
        <RadixAccordion.Item key={id} value={id} className="lumina-accordion-item">
          <RadixAccordion.Header className="lumina-accordion-header">
            <RadixAccordion.Trigger className="lumina-accordion-trigger">
              <div className="lumina-accordion-trigger-left">
                {icon && <LuminaIconGlyph name={icon} size="sm" className="lumina-muted-icon" />}
                <div className="lumina-accordion-titles">
                  <span className="lumina-accordion-title">{readString(item.title)}</span>
                  {subtitle && <span className="lumina-accordion-subtitle">{subtitle}</span>}
                </div>
              </div>
              <ChevronDown size={16} className="lumina-accordion-chevron" />
            </RadixAccordion.Trigger>
          </RadixAccordion.Header>
          <RadixAccordion.Content className="lumina-accordion-content">
            <motion.div
              className="lumina-accordion-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={springFluid}
            >
              {renderChildRef(buildChild, item.child)}
            </motion.div>
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      );
    });

  if (allowMultiple) {
    return (
      <RadixAccordion.Root
        type="multiple"
        defaultValue={defaultOpenIds}
        className={`lumina-accordion lumina-accordion-${variant}`}
        style={weightStyle(props.weight)}
      >
        {renderItems()}
      </RadixAccordion.Root>
    );
  }

  const firstDefault = defaultOpenIds[0];
  return (
    <RadixAccordion.Root
      type="single"
      collapsible
      {...(firstDefault !== undefined ? { defaultValue: firstDefault } : {})}
      className={`lumina-accordion lumina-accordion-${variant}`}
      style={weightStyle(props.weight)}
    >
      {renderItems()}
    </RadixAccordion.Root>
  );
}
