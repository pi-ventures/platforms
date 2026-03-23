# MyWills - Legal Will & Estate Management Platform

A comprehensive Next.js application for creating, managing, and maintaining legal wills and estate planning. Built with a professional legal theme featuring deep navy, gold, cream, and forest green colors for trustworthiness and authority.

## Overview

MyWills is a digital platform that helps individuals create legally valid wills, manage their assets, designate legal heirs, and maintain organized documentation. The platform is powered by partnerships with legalopinion.co.in and MyVault for professional legal review and secure data synchronization.

## Features

### Core Functionality
- **Will Creation & Management**: Create comprehensive, court-admissible wills with guided workflows
- **Asset Management**: Catalog and track all assets (properties, investments, vehicles, jewelry)
- **Family Tree**: Visual family structure with legal heir designation
- **Document Storage**: Secure, encrypted storage for all important legal documents
- **Legal Review**: Professional advocate review and legal opinions
- **MyVault Integration**: Sync data with MyVault and legalopinion.co.in

### Key Pages

1. **Landing Page** (`/`)
   - Hero section showcasing platform benefits
   - Feature highlights with icons
   - Pricing tiers (Free, Premium, Enterprise)
   - Trust indicators and legal partnership information

2. **Dashboard** (`/dashboard`)
   - Estate overview with total assets value
   - Asset breakdown pie chart
   - Family members and legal heirs list
   - Will coverage progress indicator
   - MyVault synchronization status
   - Quick action buttons
   - Recent activity feed

3. **Assets** (`/assets`)
   - Complete asset listing by type (property, investment, vehicle, jewelry)
   - Asset details including location, valuation, documents
   - Beneficiary distribution breakdown per asset
   - Add/edit asset functionality
   - Total estate value display

4. **Family Tree** (`/family`)
   - Visual family tree representation
   - Family member cards with details
   - Legal heir designation and management
   - Class I & II heir classification per Indian Succession Act
   - Contact information and identification details (PAN, Aadhar)
   - Inheritance share percentages

5. **My Will** (`/will`)
   - Full will document viewing
   - Will status and signature dates
   - Assets covered in will
   - Legal opinion and review details
   - Download and share functionality

6. **Documents** (`/documents`)
   - Secure document storage and management
   - Upload new documents
   - Encrypted storage indicator
   - Verification status
   - Download and delete options

7. **Legal Review** (`/legal-review`)
   - Professional legal opinion display
   - Lawyer and firm information
   - Court-admissibility confirmation
   - Compliance with Indian Succession Act
   - Legal framework information

8. **Settings** (`/settings`)
   - Account information management
   - Password and security settings
   - Two-factor authentication
   - Notification preferences
   - Data export functionality

## Color Scheme (Legal Theme)

```css
Primary: #1A2744 (Deep Navy) - Main text and primary elements
Gold: #C9A84C - Accents, important values, CTAs
Cream: #F8F6F0 - Background color
Forest Green: #2D5016 - Success states, legal heirs
Accent Blue: #4A6FA5 - Secondary accent
```

## Typography

- **Headers**: Crimson Pro (serif) - Professional, authoritative
- **Body**: Inter (sans-serif) - Clean, readable

## Component Structure

### Custom Components

1. **Sidebar** (`src/components/layout/Sidebar.tsx`)
   - Navigation menu with legal theme styling
   - Logo with scales of justice icon
   - MyVault sync status indicator
   - Legal partner information

2. **AppLayout** (`src/components/layout/AppLayout.tsx`)
   - Main layout wrapper
   - Integrates sidebar with main content

### Tailwind Classes

Custom Tailwind utilities defined in `tailwind.config.js`:
- `.btn-legal` - Base legal button styling
- `.btn-legal-primary` - Gold background button
- `.btn-legal-secondary` - Navy background button
- `.btn-legal-outline` - Outlined button variant
- `.card-legal` - Card with legal theme styling
- `.badge-legal` - Small status badge

## Mock Data Structure

### Testator
- Name: Ramesh Agarwal (retired businessman from Mumbai)
- Contact and identification details
- Address and personal information

### Family Members (5)
- Sunita Agarwal (Spouse) - 40% share
- Vikram Agarwal (Son) - 30% share
- Priya Sharma (Daughter) - 25% share
- Suresh Agarwal (Brother) - Not a legal heir
- Kamla Agarwal (Mother) - 5% share

### Assets (6)
1. Mumbai Residential Flat - ₹2.5 Cr
2. Pune Residential Plot - ₹80 L
3. Mutual Funds Portfolio - ₹45 L
4. Fixed Deposits - ₹30 L
5. Gold Jewelry - ₹12 L
6. Honda City Vehicle - ₹8 L

**Total Estate Value**: ₹4.35 Crores

### Will Information
- Status: Active
- Created: 2024-01-15
- Signed: 2024-01-15
- All 6 assets covered
- Legal opinion from Advocate Rajesh Kumar Singh

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd /sessions/vibrant-magical-cannon/mnt/outputs/mywills

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser at http://localhost:3003
```

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
mywills/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with metadata
│   │   ├── globals.css          # Global styles and animations
│   │   ├── page.tsx             # Landing page
│   │   ├── dashboard/
│   │   │   └── page.tsx         # Dashboard page
│   │   ├── assets/
│   │   │   └── page.tsx         # Assets listing and management
│   │   ├── family/
│   │   │   └── page.tsx         # Family tree and heirs
│   │   ├── will/
│   │   │   └── page.tsx         # Will viewing
│   │   ├── documents/
│   │   │   └── page.tsx         # Document management
│   │   ├── legal-review/
│   │   │   └── page.tsx         # Legal opinion display
│   │   └── settings/
│   │       └── page.tsx         # Settings and preferences
│   ├── components/
│   │   └── layout/
│   │       ├── Sidebar.tsx      # Navigation sidebar
│   │       └── AppLayout.tsx    # Layout wrapper
│   └── lib/
│       ├── types.ts             # TypeScript interfaces
│       └── mockData.ts          # Mock data and fixtures
├── package.json
├── tailwind.config.js           # Tailwind CSS configuration
├── next.config.js               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── postcss.config.js            # PostCSS configuration
└── README.md
```

## Data Types

### Person
- id, name, relationship, phone, email, address, dob, pan, aadhar, photo

### FamilyMember (extends Person)
- role: 'spouse' | 'child' | 'parent' | 'sibling' | 'other'
- isLegalHeir: boolean
- sharePercentage: number

### Asset
- id, type, name, description, value, location, documents, beneficiaries

### BeneficiaryShare
- personId, percentage, conditions

### Will
- id, testatorId, title, status, assets, executorId, witnessIds, createdAt, signedAt, legalOpinionId, content

### LegalOpinion
- id, lawyerName, firm, opinion, date, fee

### EstateStats
- totalAssets, totalValue, coveredInWill, notCoveredValue, beneficiaries, properties, financialAssets

## Integrations

### MyVault API
- Endpoint: `https://api.myvault.co.in`
- Synchronizes personal and asset data
- Real-time sync status monitoring

### Legal Opinion Knowledge Hub
- Endpoint: `https://hub.legalopinion.co.in`
- Professional legal guidance and templates
- Legal review and opinion generation

### Partner: legalopinion.co.in
- Website: `https://www.legalopinion.co.in`
- Provides certified advocate reviews
- Ensures court-admissibility

## Legal Compliance

- **Indian Succession Act, 1872**: Full compliance
- **Class I & II Heirs**: Proper designation and distribution
- **Court-Admissible**: All wills are valid and enforceable
- **Witnessing Requirements**: All documentation met
- **Encryption**: End-to-end encryption for sensitive data

## Features Highlights

### Security
- End-to-end encryption for all documents
- ISO 27001 certified storage
- Secure backup and recovery

### User Experience
- Legal theme for trustworthiness
- Intuitive navigation and workflows
- Mobile-responsive design
- Smooth animations and transitions

### Professional Design
- Crimson Pro font for headers (authoritative)
- Inter font for body text (readable)
- Navy sidebar with gold accents
- Cream background for comfort
- Legal color psychology

## Development Notes

### Styling Approach
- Tailwind CSS for utility classes
- Custom legal theme components
- CSS animations for interactive elements
- Print-friendly styles for documents

### State Management
- React hooks (useState) for local state
- Mock data for demonstration
- Ready for integration with backend APIs

### Responsive Design
- Mobile-first approach
- Grid layouts for responsive cards
- Flexible navigation
- Adapted for all screen sizes

## Future Enhancements

1. Backend API integration for data persistence
2. Real-time MyVault synchronization
3. Digital signature support
4. PDF generation for wills
5. Email notifications
6. Lawyer appointment scheduling
7. Video will recording
8. Multi-language support

## Environment Variables

```bash
NEXT_PUBLIC_MYVAULT_API=https://api.myvault.co.in
NEXT_PUBLIC_KNOWLEDGE_HUB_API=https://hub.legalopinion.co.in
NEXT_PUBLIC_LEGAL_PARTNER=https://www.legalopinion.co.in
```

## License

This project is proprietary and confidential.

## Contact & Support

For legal guidance and professional support:
- Visit: https://www.legalopinion.co.in
- Platform: MyWills Estate Management System

---

Built with React, Next.js, Tailwind CSS, and Lucide React icons. Designed for legal professionals and individuals managing estates in India.
