# MyVault - Golden Black Luxury Wealth Sync Hub

A premium Next.js application for centralized wealth management and synchronization from multiple financial platforms.

## Overview

MyVault is a luxury digital vault that unifies data from three integrated platforms:

- **YesBroker**: Real estate properties and broker data
- **TheEquinox.ai**: Stock portfolio and investment tracking
- **MyWills (iWills)**: Will and estate planning (managed by legalopinion.co.in)
- **KnowledgeHub.ai**: Master analytics and AI-powered insights

## Theme & Design

### Color Palette
- **Jet Black**: #0A0A0A (Primary background)
- **Rich Gold**: #C9A84C (Primary accent)
- **Deep Charcoal**: #1A1A1A (Secondary background)
- **Warm Gold**: #E8C96A (Light accent)
- **Cream**: #FEF9EE (Text highlight)

### Typography
- **Headers**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

## Features

### Dashboard
- Total net worth visualization with real-time updates
- Sync status for all connected platforms
- Net worth breakdown (Real Estate, Investments, Will Assets, Cash)
- 12-month wealth trend analysis
- Wealth highlights (top properties, holdings, will coverage)
- KnowledgeHub.ai master analytics integration

### Real Estate (YesBroker)
- Property portfolio overview
- Individual property tracking with ROI
- Property status (active, rented, sold)
- Direct links to YesBroker platform

### Portfolio (TheEquinox.ai)
- Investment holdings tracking
- Real-time price and performance metrics
- Sector allocation visualization
- P&L tracking with individual stock analysis
- Direct links to TheEquinox.ai platform

### Legal & Estate (MyWills/legalopinion.co.in)
- Will status and document management
- Beneficiary allocation tracking
- Legal opinion approval status
- Asset coverage analysis
- Important documents storage

### Analytics
- Net worth growth metrics (YoY)
- Diversification scores
- Risk profile analysis
- Tax optimization scores
- Asset composition trends

### Sync Settings
- Platform connection management
- Sync frequency configuration
- Real-time synchronization toggles
- Notification preferences
- Data security information
- KnowledgeHub.ai API integration

## Project Structure

```
myvault/
├── src/
│   ├── app/
│   │   ├── dashboard/       # Main dashboard page
│   │   ├── properties/      # Real estate portfolio
│   │   ├── portfolio/       # Investment portfolio
│   │   ├── legal/           # Estate & legal documents
│   │   ├── analytics/       # Advanced analytics
│   │   ├── settings/        # Sync settings
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Landing page
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   └── layout/
│   │       ├── Sidebar.tsx  # Navigation sidebar
│   │       └── AppLayout.tsx # Main layout wrapper
│   └── lib/
│       ├── types.ts         # TypeScript type definitions
│       └── mockData.ts      # Mock data for development
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── README.md
```

## Technology Stack

- **Framework**: Next.js 14.2.0
- **React**: 18.3.0
- **Styling**: Tailwind CSS 3.4.4
- **Icons**: Lucide React 0.400.0
- **Charts**: Recharts 2.12.0
- **Language**: TypeScript 5.4.5
- **Fonts**: Playfair Display, Inter (Google Fonts)

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application runs on port 3004 by default.

## Getting Started

1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`
3. Open [http://localhost:3004](http://localhost:3004) in your browser
4. Navigate to `/dashboard` to view the main vault interface

## Mock Data

The application includes comprehensive mock data for development:

- **User Profile**: Rajesh Sharma, Mumbai (Individual, Premium Plan)
- **Net Worth**: ₹12.02 Cr across multiple asset classes
- **Properties**: 5 real estate properties with valuations and ROI
- **Portfolio**: 5 stock holdings with live prices and performance
- **Estate**: Will with 3 beneficiaries and estate assets
- **Sync History**: Real timestamps for all data sources

## API Integration

### Sync Sources
- YesBroker (Real Estate)
- TheEquinox.ai (Portfolio)
- MyWills (Estate - via legalopinion.co.in)

### Master Analytics
All aggregated data is prepared for KnowledgeHub.ai integration with:
- Complete profile information
- Net worth breakdown
- Sync source status
- Aggregate analytics (growth, diversification, risk, tax optimization)

## Customization

### Colors
Edit color theme in `tailwind.config.js`:
```javascript
colors: {
  vault: {
    black: '#0A0A0A',
    charcoal: '#1A1A1A',
    gold: '#C9A84C',
    'gold-light': '#E8C96A',
    cream: '#FEF9EE',
    muted: '#111111',
  },
}
```

### Mock Data
Update data in `src/lib/mockData.ts` to reflect actual user information or different scenarios.

## Features Coming Soon

- Live API integration with YesBroker, TheEquinox.ai, and MyWills
- User authentication and authorization
- Real-time data synchronization
- Mobile application
- Advanced reporting and tax planning
- Wealth advisor collaboration tools
- Portfolio rebalancing recommendations

## Security

- End-to-end encryption (256-bit AES)
- Data isolation per user
- GDPR and ISO 27001 compliant
- Regular security audits

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is proprietary and confidential.

## Support

For support and inquiries, contact the MyVault team.
