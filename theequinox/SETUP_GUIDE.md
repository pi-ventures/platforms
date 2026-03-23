# TheEquinox.ai - Setup and Installation Guide

## Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn installed
- Git (optional, for version control)

### Installation Steps

1. **Navigate to Project Directory**
   ```bash
   cd /sessions/vibrant-magical-cannon/mnt/outputs/theequinox
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   - Navigate to `http://localhost:3002`
   - Landing page should load with the Royal Luxe theme

## Development Workflow

### Available Scripts

```bash
# Development server (port 3002)
npm run dev

# Build for production
npm run build

# Start production server (port 3002)
npm start

# Run linter
npm lint
```

## Project Structure Navigation

```
theequinox/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page - http://localhost:3002/
│   │   ├── dashboard/page.tsx    # Dashboard - /dashboard
│   │   ├── trading/page.tsx      # Trading - /trading
│   │   ├── portfolio/page.tsx    # Portfolio - /portfolio
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   └── layout/
│   │       ├── Sidebar.tsx       # Navigation component
│   │       └── AppLayout.tsx     # Layout wrapper
│   └── lib/
│       ├── types.ts             # TypeScript types
│       └── mockData.ts          # Demo data (stocks, portfolio, etc.)
├── tailwind.config.js            # Theme configuration
├── next.config.js                # Next.js config
├── package.json                  # Dependencies
└── README.md                      # Documentation
```

## Key Features Overview

### Landing Page (/)
- Hero section with gold gradient text
- Feature highlights with icons
- Pricing table (Free/Wealth/Elite plans)
- Statistics showcase
- Professional navigation and CTA buttons

### Dashboard (/dashboard)
- **Portfolio Summary**: Total value, P&L, day changes
- **Performance Chart**: 12-month area chart
- **Top Holdings**: 5-item list with % gains
- **Auto Rules**: Active rule status
- **Market Indices**: SENSEX, NIFTY50, BANKNIFTY, etc.
- **Recent Trades**: Complete trade history
- **Value Toggle**: Hide/show sensitive values

### Trading (/trading)
- **Manual Trade Execution**:
  - Stock selector dropdown
  - Buy/Sell order types
  - Quantity and price inputs
  - Real-time total calculation

- **Auto-Trading Rules**:
  - Create new rules (SIP, Stop-Loss, Profit Booking, Rebalance)
  - Toggle rules on/off
  - Edit and delete functionality
  - Rule status indicators
  - Triggered rule alerts

- **Trade Log**: Complete history with status tracking

### Portfolio (/portfolio)
- **Holdings Table**: All stocks with metrics
- **Sector Allocation**: Pie chart visualization
- **Performance Chart**: Value trend analysis
- **Add Holdings**: Form to add new positions
- **Summary Stats**: Largest, best performer, diversification

## Theme Colors

All colors are defined in `tailwind.config.js` and can be customized:

```javascript
// Primary Colors
- gold-500: #C9A84C (main accent)
- dark: #1A0533 (dark purple)
- darker: #0A0A1A (darkest navy)
- purple: #2D1B69 (accent purple)

// Text Colors
- light: #F5F0E8 (light cream)
- accent: #E8C96A (bright gold)
```

## Customization Guide

### Change Theme Colors

Edit `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        equinox: {
          primary: '#YOUR_GOLD',
          dark: '#YOUR_DARK',
          darker: '#YOUR_DARKEST',
          // ... etc
        }
      }
    }
  }
}
```

### Update Company Information

Edit `src/lib/mockData.ts`:

```typescript
// Change portfolio values
export const portfolio: Portfolio = {
  totalValue: 3070153, // Your value
  // ... other fields
};

// Add/modify stocks
export const stocks: Stock[] = [
  {
    id: '1',
    symbol: 'YOUR_STOCK',
    // ... stock details
  }
];
```

### Modify Navigation

Edit `src/components/layout/Sidebar.tsx`:

```typescript
const navItems = [
  { href: '/your-path', icon: IconName, label: 'Your Label' },
  // ... more items
];
```

## API Integration

### Current Configuration (in next.config.js)

```javascript
env: {
  NEXT_PUBLIC_APP_NAME: 'TheEquinox.ai',
  NEXT_PUBLIC_MYVAULT_API: 'https://api.myvault.in',
  NEXT_PUBLIC_KNOWLEDGEHUB_API: 'https://api.knowledgehub.ai',
}
```

### Adding Real Data

1. **Stock Prices**: Connect to market data APIs
2. **Portfolio Data**: Replace mock data with real holdings
3. **Trade History**: Fetch from backend
4. **User Authentication**: Implement login system

Example integration:

```typescript
// In src/lib/mockData.ts
import { fetchStockData } from '@/lib/api';

// Replace mock data with API calls
const stocks = await fetchStockData();
```

## Environment Setup

Create `.env.local` file:

```
NEXT_PUBLIC_APP_NAME=TheEquinox.ai
NEXT_PUBLIC_MYVAULT_API=https://api.myvault.in
NEXT_PUBLIC_KNOWLEDGEHUB_API=https://api.knowledgehub.ai

# Add your own
NEXT_PUBLIC_MARKET_DATA_API=your-api-endpoint
NEXT_PUBLIC_USER_API=your-api-endpoint
```

## Deployment Options

### Vercel (Recommended for Next.js)

```bash
npm i -g vercel
vercel login
vercel deploy
```

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3002
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t theequinox .
docker run -p 3002:3002 theequinox
```

### Traditional Server

```bash
npm run build
npm start
```

Access at `http://your-domain:3002`

## Troubleshooting

### Port Already in Use

Change port in `package.json`:

```json
"dev": "next dev -p 3003"  // or another port
```

### Tailwind Styles Not Loading

Clear cache and rebuild:

```bash
rm -rf .next
npm run dev
```

### Module Not Found Errors

Ensure path aliases work:

```bash
# Check tsconfig.json has correct paths
# Then restart dev server
npm run dev
```

### Image Loading Issues

Add public folder and reference images:

```
project/
├── public/
│   └── images/
│       └── logo.png
```

Reference in components:

```typescript
<Image src="/images/logo.png" alt="Logo" width={50} height={50} />
```

## Performance Optimization

### Production Build

```bash
npm run build
# Check build size
ls -lh .next
```

### Lighthouse Audit

Run Lighthouse in Chrome DevTools to identify improvements.

### Code Splitting

Already optimized with Next.js dynamic imports:

```typescript
const HeavyComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <p>Loading...</p>,
});
```

## Testing

### Basic Testing (create tests/)

```bash
npm install --save-dev jest @testing-library/react
```

## Security Checklist

- [ ] No sensitive data in mock data
- [ ] Environment variables not committed (.gitignore)
- [ ] HTTPS for production
- [ ] Content Security Policy headers
- [ ] CSRF protection if forms post data
- [ ] Input validation and sanitization
- [ ] XSS protection (React handles this)

## Version Info

```
Node.js: 18+
Next.js: 14.2.0
React: 18.3.0
TypeScript: 5.4.5
Tailwind CSS: 3.4.4
```

## Support & Resources

- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com
- React Docs: https://react.dev
- TypeScript: https://www.typescriptlang.org

## Next Steps

1. Replace mock data with real APIs
2. Add user authentication
3. Implement database (PostgreSQL, MongoDB)
4. Add email notifications
5. Implement payment processing
6. Add advanced charting
7. Create mobile app

---

**Happy Trading!** 🚀

For issues, refer to README.md or check the documentation in PROJECT_STRUCTURE.md
