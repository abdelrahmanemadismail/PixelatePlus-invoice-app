# Copilot Instructions: Invoice Management & Generation System

## Project Overview
**Pixelate Plus** Invoice App — a full-stack system for transforming manual event production quotations into digital, brand-consistent, print-ready A4 PDF invoices. Target: reduce quotation creation from 20 mins to <5 mins.

## Architecture Fundamentals

### Current State
- **Frontend:** Next.js 16 with React 19, Tailwind CSS v4, TypeScript strict mode
- **Styling:** Tailwind utility-first approach; path alias `@/*` maps to `src/*`
- **CLI:** ESLint with Next.js core-web-vitals + TypeScript rules enforced
- **Development:** `npm run dev` launches on `http://localhost:3000`

### Critical Components (When Built)
1. **Multi-Step Stepper** (Client Info → Service Details → Terms → Preview)
   - Pattern: Form state validation at each step; prevent progression if required fields missing
   - **State Management:** Use Zustand for centralized form state (lightweight, no boilerplate)
   - Store shape: `{ currentStep, clientInfo, serviceDetails, terms, errors, actions }`

2. **Dynamic Invoice Preview**
   - **Print-Optimized HTML:** No PDF generation libraries—optimize HTML/CSS for browser print (`window.print()`)
   - Print-perfect CSS: use `@media print` to remove headers/footers, maintain exact A4 dimensions (210mm × 297mm)
   - Critical: Test with `Ctrl+P` in Chrome/Edge; adjust `@page` margins, page-break-inside properties
   - Real-time calculations: sub-totals, 5% UAE VAT, net payable amounts
   - Component isolation: generate preview separately from form UI to enable independent styling refinement

3. **Line Item Manager**
   - Design for event production: supports parent line items with nested sub-descriptions (e.g., Booth → Raised Platform, Lightbox, Finishes)
   - Validation: non-negative amounts, required descriptions
   - Pattern: Use controlled components for seamless real-time recalculation

## Key Patterns & Conventions

### Component Structure
- **Server Components First:** Leverage Next.js 16 default (server components) for layout, data fetching
- **Client Components:** Use `'use client'` only for interactive features (forms, state-driven previews)
- **Naming:** Suffix UI atoms as `Button.tsx`, complex forms as `StepperContainer.tsx`, pages as `page.tsx`

### Form Handling
- **Validation:** Centralized schema using `zod` + `react-hook-form`
- **State Pattern:** Zustand store tracks: step index, data per step, validation errors, dirty flags
- **Error Display:** Inline field-level errors; block step progression until all required fields valid
- **Temporary Storage:** Use `sessionStorage` or Zustand persist middleware to preserve form data across refreshes (no database)

### Styling Approach
- **Component Library:** shadcn/ui for pre-built components (Button, Input, Card, Dialog, etc.)
- Tailwind utility classes throughout; no CSS-in-JS or CSS modules (keep Tailwind scoped to `globals.css` + inline utilities)
- **Print Layer:** Separate print styles in `@media print {}` blocks; test print preview frequently (`Ctrl+P`)
  - Use `@page { size: A4; margin: 0; }` for exact A4 output
  - Hide UI elements: `.no-print { @apply print:hidden; }`
- **Responsive:** Mobile-first; event production data may include technical specs (booth dimensions, etc.) — ensure readability on all breakpoints

### TypeScript
- Strict mode enabled; no `any` types
- Component props: use `React.FC<Props>` or function signatures with explicit return types
- Shared types: create `types/` directory (not yet present) for invoice-related interfaces if duplicated across components

## Development Workflows

### Running Locally
```bash
npm run dev              # Start Next.js dev server
npm run build            # Production build
npm start                # Run production build locally
npm run lint             # ESLint check (fix: `eslint --fix`)
```

### Before Commit
1. **Lint Check:** `npm run lint` must pass (strict TypeScript)
2. **Type Safety:** Verify no `@ts-ignore` hacks; resolve type errors
3. **Browser Test:** Manually verify form flow and print preview (`Ctrl+P`)

## Integration Points (When Implemented)

- **Backend (NestJS):** API routes under `/api/` for future features (invoice history export, email sending)
- **Authentication (Better Auth):** Protect sensitive routes with session middleware; client dashboard should verify session on mount
- **Data Persistence:** Temporary storage only (sessionStorage, Zustand persist)—no database required
  - If invoice history needed later, implement export to CSV/JSON from client-side state
- **Print Flow:** Client-side `window.print()` triggers browser print dialog—no server-side PDF generation

## Critical Success Criteria

✅ **Print Fidelity:** Digital preview === printed A4 output pixel-perfectly (test in Chrome, Firefox, Edge)
✅ **Form Validation:** All required fields (TRN, bank details, booth specs) enforced before print
✅ **Real-Time Calc:** Sub-total, VAT, net amounts update instantly via Zustand (< 200ms)
✅ **Performance:** Form responsiveness must feel instant; Zustand updates don't trigger unnecessary re-renders
✅ **Print Quality:** Use high-res logos, proper font embedding (Geist fonts), no broken layouts on print

## Anti-Patterns to Avoid

- ❌ Mixing styled-components/CSS-in-JS with Tailwind (stick to utilities)
- ❌ Form state scattered across multiple components (use Zustand store)
- ❌ Using PDF generation libraries (`jspdf`, `html2canvas`)—optimize native print instead
- ❌ Missing TypeScript types for invoice/item structures (define in `types/invoice.ts` early)
- ❌ Overusing shadcn/ui components where simple Tailwind suffices (balance DX with bundle size)
