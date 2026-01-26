# Invoice Generator - Pixelate Plus

A professional invoice management and generation system for **Pixelate Plus**, designed to streamline the creation of brand-consistent, print-ready A4 invoices for event production services.

## 🚀 Features

- **Multi-Step Workflow:** Intuitive 4-step process (Client Info → Service Details → Terms → Preview)
- **Dynamic Line Items:** Flexible item manager with support for nested sub-descriptions (perfect for booth specifications, lighting details, etc.)
- **Real-Time Calculations:** Automatic subtotal, VAT (5% UAE standard), and net total calculations
- **Print-Optimized:** CSS print media queries ensure pixel-perfect A4 output via browser print dialog
- **State Persistence:** Form data saved to sessionStorage via Zustand persist middleware
- **Type-Safe:** Full TypeScript implementation with Zod validation schemas

## 📋 Tech Stack

- **Framework:** Next.js 16 (App Router) with React 19
- **Styling:** Tailwind CSS v4 with shadcn/ui components
- **State Management:** Zustand with persist middleware
- **Form Validation:** React Hook Form + Zod schemas
- **Type Safety:** TypeScript strict mode

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+ and npm
- Modern browser (Chrome, Firefox, or Edge recommended for print testing)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Development Commands

```bash
npm run dev      # Start development server (Turbopack)
npm run build    # Production build
npm start        # Run production build
npm run lint     # Run ESLint
```

## 📖 Usage

### Creating an Invoice

1. **Client Information**
   - Enter company name, TRN number (15 digits), contact details, and billing address
   - All fields validated in real-time

2. **Service Details**
   - Add line items with descriptions, sub-descriptions, unit price, and quantity
   - Totals calculate automatically as you add/edit items
   - Example line item structure:
     ```
     Description: Booth Construction
     Sub-descriptions:
       - Raised Platform (3m x 3m)
       - Lightbox Signage
       - Acrylic Finish
     Unit Price: 15,000 AED
     Quantity: 1
     ```

3. **Terms & Conditions**
   - Select payment terms (Net 15/30/45 or Due on Receipt)
   - Enter bank details (account number, IBAN, Swift code)
   - Add optional notes

4. **Preview & Print**
   - Review complete invoice with all details
   - Click "Print Invoice" or press `Ctrl+P` (Windows) / `Cmd+P` (Mac)
   - Save as PDF via browser print dialog

### Print Testing

The invoice is optimized for A4 paper (210mm × 297mm) with proper margins. To test:

1. Generate a preview invoice
2. Press `Ctrl+P` (Windows) or `Cmd+P` (Mac)
3. Select "Save as PDF" as destination
4. Verify:
   - No browser headers/footers appear
   - Content fits within A4 dimensions
   - All colors print correctly
   - Page breaks don't split line items

## 🗂️ Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles + print CSS
│   ├── layout.tsx            # Root layout with metadata
│   └── page.tsx              # Main invoice generator page
├── components/
│   ├── forms/
│   │   ├── ClientInfoForm.tsx      # Step 1: Client details
│   │   ├── ServiceDetailsForm.tsx  # Step 2: Line items
│   │   └── TermsForm.tsx           # Step 3: Payment terms
│   ├── ui/                          # shadcn/ui components
│   ├── InvoicePreview.tsx          # Step 4: Preview wrapper
│   ├── LineItemManager.tsx         # Line item CRUD with dialog
│   ├── PrintLayout.tsx             # Print-optimized invoice layout
│   └── Stepper.tsx                 # Progress indicator
├── lib/
│   ├── utils.ts              # Utility functions (cn helper)
│   └── validation.ts         # Zod schemas for forms
├── store/
│   └── invoiceStore.ts       # Zustand state management
└── types/
    └── invoice.ts            # TypeScript interfaces
```

## 🎨 Customization

### Branding

Update company details in [PrintLayout.tsx](src/components/PrintLayout.tsx):

```tsx
<h1 className="text-4xl font-bold text-gray-900 mb-2">PIXELATE PLUS</h1>
<p className="text-gray-600 text-sm">Creative Event Solutions</p>
```

### VAT Rate

Modify `VAT_PERCENTAGE` in [invoiceStore.ts](src/store/invoiceStore.ts):

```typescript
const VAT_PERCENTAGE = 5; // UAE standard (change as needed)
```

### Payment Terms

Add/remove options in [TermsForm.tsx](src/components/forms/TermsForm.tsx):

```typescript
const PAYMENT_TERMS_OPTIONS = [
  { value: 'net-15', label: 'Net 15 Days' },
  // Add custom terms here
];
```

## 🐛 Troubleshooting

### Print Preview Issues

**Problem:** Browser headers/footers appear in print
**Solution:** Ensure `@media print { @page { margin: 15mm 10mm; } }` in globals.css

**Problem:** Colors don't print correctly
**Solution:** Verify `-webkit-print-color-adjust: exact` is applied

### Form Validation

**Problem:** TRN validation fails
**Solution:** UAE TRN must be exactly 15 digits (pattern: `/^\d{15}$/`)

### State Persistence

**Problem:** Form data lost on page refresh
**Solution:** Check browser settings allow sessionStorage; ensure Zustand persist middleware is configured

## 📝 License

Private project for Pixelate Plus internal use.

## 🤝 Contributing

This is a private project. For questions or feature requests, contact the development team.

