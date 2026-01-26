# Invoice App Implementation Plan

## Phase 1: Foundation Setup

### 1.1 Type Definitions
Create `src/types/invoice.ts`:
- `ClientInfo` interface (company name, TRN, contact details, billing address)
- `LineItem` interface (id, description, subDescriptions[], unitPrice, quantity, total)
- `ServiceDetails` interface (lineItems[], subtotal, vatAmount, netTotal)
- `TermsConditions` interface (paymentTerms, bankDetails, notes)
- `InvoiceData` interface (clientInfo, serviceDetails, terms, invoiceNumber, date)

### 1.2 Zustand Store
Create `src/store/invoiceStore.ts`:
```typescript
{
  currentStep: number (0-3)
  clientInfo: ClientInfo | null
  serviceDetails: ServiceDetails | null
  terms: TermsConditions | null
  errors: Record<string, string[]>

  actions: {
    setStep(step: number)
    updateClientInfo(data: Partial<ClientInfo>)
    updateServiceDetails(data: Partial<ServiceDetails>)
    updateTerms(data: Partial<TermsConditions>)
    addLineItem(item: LineItem)
    removeLineItem(id: string)
    updateLineItem(id: string, data: Partial<LineItem>)
    calculateTotals()
    validateStep(step: number): boolean
    reset()
  }
}
```
- Configure Zustand persist middleware with sessionStorage
- Implement real-time VAT calculation (5% UAE standard)

### 1.3 Validation Schemas
Create `src/lib/validation.ts`:
- Zod schemas for each step: `clientInfoSchema`, `serviceDetailsSchema`, `termsSchema`
- Export combined `invoiceSchema` for final validation

## Phase 2: Core Components

### 2.1 Stepper UI
Create `src/components/Stepper.tsx`:
- Visual progress indicator (1→2→3→4)
- Step labels: "Client Info" | "Service Details" | "Terms & Conditions" | "Preview"
- Disable future steps until current step validated
- Use shadcn/ui Card component for container

### 2.2 Form Steps

#### Step 1: Client Information Form
Create `src/components/forms/ClientInfoForm.tsx`:
- Fields: Company Name, TRN Number, Contact Person, Email, Phone, Billing Address
- Use react-hook-form with zodResolver
- shadcn/ui Input, Label components
- Real-time validation feedback
- "Next" button disabled until valid

#### Step 2: Service Details Form
Create `src/components/forms/ServiceDetailsForm.tsx`:
- Line Item Manager component (nested)
- Add/Remove line items dynamically
- Each item: Description, Sub-descriptions (array), Unit Price, Quantity
- Auto-calculate line total, subtotal, VAT (5%), net total
- Display running totals in sidebar
- Use shadcn/ui Button, Input, Textarea

#### Step 3: Terms & Conditions Form
Create `src/components/forms/TermsForm.tsx`:
- Payment terms dropdown (Net 15, Net 30, Net 45, Due on Receipt)
- Bank details section (Bank Name, Account Number, IBAN, Swift Code)
- Additional notes textarea
- Use shadcn/ui Select, Textarea

#### Step 4: Invoice Preview
Create `src/components/InvoicePreview.tsx`:
- Read-only display of all collected data
- Brand header with Pixelate Plus logo
- Professional layout matching A4 dimensions
- Print button triggering `window.print()`
- Edit buttons to jump back to specific steps

### 2.3 Line Item Manager
Create `src/components/LineItemManager.tsx`:
- Table layout: Description | Sub-items | Unit Price | Qty | Total
- Add button with Dialog for new items
- Delete buttons with confirmation
- Inline editing with controlled inputs
- Real-time calculation on every change
- Use shadcn/ui Table, Dialog, Button

## Phase 3: Print Optimization

### 3.1 Print Styles
Create `src/app/print.css`:
```css
@media print {
  @page {
    size: A4;
    margin: 15mm 10mm;
  }

  .no-print {
    display: none !important;
  }

  .print-only {
    display: block !important;
  }

  /* Remove page breaks inside line items */
  .line-item {
    page-break-inside: avoid;
  }

  /* Ensure brand colors print correctly */
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

### 3.2 Print-Specific Layout
Create `src/components/PrintLayout.tsx`:
- Wrapper component for invoice preview
- Header: Pixelate Plus logo (high-res), company details
- Invoice metadata: Invoice #, Date, TRN
- Client section: Billing info
- Line items table with borders
- Totals section: Subtotal, VAT (5%), Net Total
- Footer: Bank details, payment terms, thank you message
- Page numbers if multi-page (CSS counter)

### 3.3 Print Button Component
Create `src/components/PrintButton.tsx`:
- Trigger `window.print()`
- Optional: Generate unique invoice number before print
- Optional: Log print event to sessionStorage (invoice history)

## Phase 4: Main Page Integration

### 4.1 Update Home Page
Modify `src/app/page.tsx`:
- Remove boilerplate
- Implement multi-step container
- Conditional rendering based on `currentStep` from Zustand
- Stepper component at top
- Current step form in center
- Navigation buttons (Back, Next/Generate)
- Preview mode shows InvoicePreview with PrintLayout

### 4.2 Layout Updates
Modify `src/app/layout.tsx`:
- Update metadata (title: "Invoice Generator - Pixelate Plus")
- Import print.css
- Add brand color CSS variables if needed

## Phase 5: Polish & Testing

### 5.1 Form UX Enhancements
- Loading states for calculations
- Success animations on step completion
- Keyboard navigation (Enter to advance)
- Auto-focus first field on step load
- Unsaved changes warning (beforeunload)

### 5.2 Print Testing Checklist
- [ ] Test in Chrome (Ctrl+P)
- [ ] Test in Firefox
- [ ] Test in Edge
- [ ] Verify A4 dimensions match (210mm × 297mm)
- [ ] Check logo resolution
- [ ] Verify all colors print correctly
- [ ] Test multi-page invoices (page breaks)
- [ ] Confirm no UI elements leak into print

### 5.3 Edge Cases
- Handle empty line items gracefully
- Validate TRN format (UAE standard)
- Ensure VAT calculation rounds correctly (2 decimals)
- Test with very long descriptions (line wrapping)
- Test with many line items (pagination)

## Phase 6: Optional Enhancements

### 6.1 Export Features
- Export to JSON (download invoice data)
- Export to CSV (line items only)
- Email invoice (requires backend integration)

### 6.2 Templates
- Pre-fill common services (Booth Standard, Booth Premium, etc.)
- Save draft invoices to sessionStorage
- Load previous invoice as template

### 6.3 Branding
- Upload custom logo (store in sessionStorage as base64)
- Customize color scheme
- Add company letterhead

## Implementation Order

1. **Day 1:** Type definitions, Zustand store, validation schemas
2. **Day 2:** Stepper UI, Client Info form, Service Details form skeleton
3. **Day 3:** Line Item Manager with calculations, Terms form
4. **Day 4:** Invoice Preview, Print Layout, print.css optimization
5. **Day 5:** Main page integration, testing, refinement

## Key Dependencies

```bash
npm install zustand zod react-hook-form @hookform/resolvers
npx shadcn@latest init
npx shadcn@latest add button input card dialog form label select textarea table
```

## Success Metrics

- Form completion time: < 5 minutes (target met)
- Print preview matches output: 100% (pixel-perfect)
- Zero calculation errors (VAT, totals)
- Form state persists across page refresh
- No TypeScript errors in production build
