# Multi-Platform Extension Guide — A2UI Lumina Catalog (`v1.0`)

A2UI Lumina is engineered across 4 decoupled layers so you can add native renderers for **Angular, Flutter, iOS (SwiftUI), and Android (Jetpack Compose)** without duplicating schemas, prompt instructions, or design tokens.

## Shared Contracts Consumed by All Platforms

1. **Canonical A2UI v1.0 Schema (`packages/schema/catalog.json`):**  
   Generated from `@a2ui-catalog/core` (`41` components + `20` functions + LLM prompt `instructions`) and validated against A2UI v1.0 `catalog_definition.json`.
2. **Design & Physics Tokens (`packages/tokens/dist/platforms/`):**
   - Web / Angular / Lit: `@a2ui-catalog/tokens/lumina-tokens.css`
   - iOS SwiftUI: `LuminaTokens.swift` (`Animation.interpolatingSpring`, `LuminaRadii`)
   - Android Jetpack Compose: `LuminaTokens.kt` (`spring<Float>`, `LuminaRadii`)
   - Flutter: `lumina_tokens.dart` (`SpringDescription`, `LuminaRadii`)
3. **Conformance Fixtures (`packages/schema/vendor/v1_0/basic_examples/` + `apps/agent/src/scenarios/`):**  
   Every new platform renderer verifies parity by rendering all 43 Basic Catalog v1.0 examples and all 4 multi-turn Hero Agent Scenarios.

---

## 1. Extending to Angular (`@a2ui/angular`)

`@a2ui-catalog/core` has **zero React imports**, so Angular consumes the exact same `ComponentApi` objects, `LUMINA_FUNCTIONS`, and CSS variables directly:

```ts
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { AngularCatalog, CatalogComponent, createComponentImplementation, provideA2UI } from '@a2ui/angular';
import { LUMINA_FUNCTIONS, LUMINA_V1_CATALOG_ID, StatusBadgeApi } from '@a2ui-catalog/core';

@Component({
  selector: 'lumina-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span [class]="'lumina-badge lumina-badge-' + tone()">{{ label() }}</span>`,
})
export class LuminaStatusBadgeComponent extends CatalogComponent<typeof StatusBadgeApi> {
  readonly label = computed(() => String(this.props().label?.value() ?? ''));
  readonly tone = computed(() => String(this.props().tone?.value() ?? 'neutral'));
}

export const luminaAngularCatalog = new AngularCatalog(
  LUMINA_V1_CATALOG_ID,
  '1.0',
  [createComponentImplementation(StatusBadgeApi, LuminaStatusBadgeComponent)],
  [...LUMINA_FUNCTIONS],
);

export const luminaProviders = provideA2UI({ catalogs: [luminaAngularCatalog] });
```

Import `@a2ui-catalog/tokens/lumina-tokens.css` and `@a2ui-catalog/react/styles.css` (or shared component CSS) in `angular.json` to share identical Alabaster & Obsidian visuals.

---

## 2. Extending to Flutter (`a2ui_flutter`)

Load `packages/schema/catalog.json` and `packages/tokens/dist/platforms/lumina_tokens.dart`:

```dart
import 'package:a2ui_core/a2ui_core.dart';
import 'package:a2ui_flutter/a2ui_flutter.dart';
import 'package:flutter/material.dart';
import 'lumina_tokens.dart';

final statMetricWidget = ComponentImplementation(
  name: 'StatMetric',
  schema: luminaSchema['components']['StatMetric'],
  builder: (context, node, props, buildChild) {
    final label = props.string('label') ?? '';
    final value = props.string('value') ?? '';
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(LuminaRadii.lg),
        color: Theme.of(context).colorScheme.surface,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: Theme.of(context).textTheme.bodySmall),
          const SizedBox(height: 6),
          Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700, fontFeatures: [FontFeature.tabularFigures()])),
        ],
      ),
    );
  },
);
```

---

## 3. Extending to iOS (`A2UISwiftUI`)

Bundle `catalog.json` and `LuminaTokens.swift`, and map adaptive overlays (`Modal`, `ArtifactCard`) directly to native `.sheet(isPresented:)` with `.presentationDetents([.medium, .large])` and `.presentationDragIndicator(.visible)`:

```swift
import A2UICore
import A2UISwiftUI
import SwiftUI

let approvalCard = ComponentImplementation(
    api: AnyComponentAPI(name: "ApprovalCard", schema: luminaSchema["ApprovalCard"]!)
) { node in
    VStack(alignment: .leading, spacing: 12) {
        Text(node.string(for: "title") ?? "").font(.headline)
        if let desc = node.string(for: "description") {
            Text(desc).font(.subheadline).foregroundStyle(.secondary)
        }
        Button(node.string(for: "approveLabel") ?? "Approve") {
            node.dispatchAction(for: "approveAction")
        }
        .buttonStyle(.borderedProminent)
    }
    .padding(16)
    .background(.regularMaterial, in: RoundedRectangle(cornerRadius: LuminaRadii.xl, style: .continuous))
    .animation(LuminaMotion.springFluid, value: node.string(for: "state"))
}
```

---

## 4. Extending to Android (`androidx.a2ui.compose`)

Import `LuminaTokens.kt` and map `Modal`/`ArtifactCard` to Material 3 `ModalBottomSheet`, `Switch` to Compose `Switch`, and `Chart` to Canvas/Vico with `tabular-nums` (`fontFeatureSettings = "tnum"`):

```kotlin
val StatMetricComponent = object : A2uiComponent {
    override val name = "StatMetric"
    override val properties = listOf(
        A2uiProperty.dynamicString("label", required = true),
        A2uiProperty.dynamicString("value", required = true),
        A2uiProperty.dynamicString("delta"),
    )

    @Composable
    override fun A2uiComponentScope.Content(properties: A2uiComponentProperties, modifier: Modifier) {
        val label = properties.bind(LabelProp) ?: return
        val value = properties.bind(ValueProp) ?: return
        Surface(shape = RoundedCornerShape(LuminaRadii.lg), tonalElevation = 1.dp, modifier = modifier) {
            Column(Modifier.padding(16.dp)) {
                Text(label, style = MaterialTheme.typography.labelMedium)
                Text(value, style = MaterialTheme.typography.headlineSmall.copy(fontFeatureSettings = "tnum"))
            }
        }
    }
}
```
