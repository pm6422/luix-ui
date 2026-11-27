# @luixtech/ui

High-density React + Tailwind CSS v4 + shadcn/ui component library shared across Luix projects.

## Installation

```bash
npm install @luixtech/ui
```

## Setup (Tailwind CSS v4)

Import the design tokens and register the package as a Tailwind v4 `@source` in your app's `main.css`:

```css
@import "tailwindcss";
@import "@luixtech/ui/styles.css";
@source "../node_modules/@luixtech/ui/dist";
```

Wrap your app with `ThemeProvider` and `Toaster`:

```tsx
import { ThemeProvider, Toaster } from "@luixtech/ui";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      {/* your app */}
      <Toaster />
    </ThemeProvider>
  );
}
```

## Included Modules

- **Theme & Feedback**: `ThemeProvider`, `useTheme`, `Toaster`, `InlineLoading`, `RouteLoading`
- **Dialogs**: `BaseDialog`, `FormDialog`, `FormErrors`, `ConfirmDialog`, `ConfirmPopover`
- **Forms**: `LoadingButton`, `NumericStepperInput`, `MultiSelect`, `RequiredFormLabel`, `FormFieldInput`, `FormFieldSelect`, `FormFieldSwitch`, `FormFieldCombobox`, `FormFieldMultiSelect`
- **Navigation & Display**: `BackButton`, `DateTimeDisplay`, `DetailCard`
- **Data Table & CRUD (`@luixtech/ui/table`)**: `DataTable`, `CrudPageLayout`, `CrudTableToolbar`, `DataTableColumnHeader`, `DataTableFacetedFilter`, `DataTablePagination`, `DataTableRowActions`, `DataTableSortList`, `DataTableViewOptions`, `crudTableFeatures`
- **Base Primitives (`ui/*`)**: shadcn/ui + Radix primitives (`Button`, `Dialog`, `Input`, `Select`, `Table`, `Tabs`, `Tooltip`, etc.)

## Publishing

Push a `v*` tag (e.g. `git tag v0.1.0 && git push --tags`) to trigger `.github/workflows/publish.yml`, or run locally:

```bash
npm run build
npm publish --access public
```
