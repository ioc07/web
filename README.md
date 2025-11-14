# Loan Interest Manager - Multi-Bank Dashboard

A modern, responsive loan management application built with Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- 📊 **Statistics Dashboard**: Real-time overview of all loans with key metrics
- 🏦 **Multi-Bank Support**: Manage loans from multiple banks (Bank A-E)
- 🔍 **Advanced Filtering**: Search, filter by bank/status, and sort loans
- 📈 **Interest Calculations**: Automatic calculation of monthly and total interest
- 📋 **Tab Navigation**: View loans by status (All, Active, Paid, Overdue) or bank summary
- ✏️ **CRUD Operations**: Add, edit, and delete loans with a modern modal interface
- 💾 **CSV Export**: Export loan data for external use
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles and Tailwind directives
├── components/
│   └── ui/                 # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── label.tsx
│       └── badge.tsx
├── lib/
│   ├── utils.ts            # Utility functions (cn helper)
│   ├── types.ts            # TypeScript type definitions
│   └── calculations.ts     # Business logic and calculations
└── next.config.js          # Next.js configuration
```

## Key Components

### Statistics Cards
Displays key metrics:
- Total Loans
- Active Loans
- Total Amount
- Average Interest Rate
- Total Interest
- Monthly Interest

### Loan Table
Comprehensive table showing:
- Loan ID
- Bank
- Amount
- Interest Rate
- Disbursement/Maturity Dates
- Term
- Monthly/Total Interest
- Status
- Actions (Edit/Delete)

### Bank Summary
Aggregated view showing totals and averages by bank

### Add/Edit Modal
Form for creating or editing loans with validation

## Configuration

The application includes configurable settings:
- **Interest Payment Day**: Set the day of month for interest payments (1-28)
- **Year Basis**: 365 days (standard calculation basis)

## Interest Calculations

The application uses the following formulas:

- **Monthly Interest**: `Amount × (Rate / 100) × 30 / YearBasis`
- **Total Interest**: `FirstPeriodInterest + (Term - 1) × MonthlyInterest`
- **Term**: Calculated automatically from disbursement and maturity dates

## License

ISC
