# TheEquinox.ai - Royal Luxe Auto Trading Platform

A premium AI-powered stock trading platform for Indian markets with automatic trading rules, portfolio analytics, and MyVault integration.

## Features

- **AI Auto-Trading**: Create and manage automated trading rules (SIP, Stop-Loss, Profit Booking, Rebalancing)
- **Portfolio Analytics**: Real-time portfolio tracking with comprehensive analytics
- **Risk Management**: Advanced stop-loss and profit-booking mechanisms
- **MyVault Sync**: Seamlessly sync portfolio data with MyVault
- **Market Dashboard**: Live market indices and trading analytics
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 with React 18
- **Styling**: Tailwind CSS with custom Royal Luxe theme
- **Charts**: Recharts for interactive data visualization
- **Notifications**: React Hot Toast
- **Language**: TypeScript

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:3002`

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
theequinox/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard page
│   │   ├── trading/
│   │   │   └── page.tsx          # Trading management
│   │   └── portfolio/
│   │       └── page.tsx          # Portfolio analytics
│   ├── components/
│   │   └── layout/
│   │       ├── Sidebar.tsx       # Navigation sidebar
│   │       └── AppLayout.tsx     # App wrapper layout
│   └── lib/
│       ├── types.ts             # TypeScript types
│       └── mockData.ts          # Mock data for demo
├── tailwind.config.js           # Tailwind configuration
├── next.config.js               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies

```

## Theme

### Colors
- **Primary Gold**: #C9A84C
- **Dark Purple**: #1A0533
- **Darker Navy**: #0A0A1A
- **Purple Accent**: #2D1B69
- **Light Text**: #F5F0E8

### Fonts
- **Display**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

## Key Pages

### Landing Page (`/`)
- Hero section with call-to-action
- Feature highlights
- Pricing plans
- Statistics

### Dashboard (`/dashboard`)
- Portfolio summary cards
- Performance charts
- Top holdings
- Active trading rules
- Market indices
- Recent trades

### Trading (`/trading`)
- Auto-trading rule management
- Manual trade execution
- Recent trades log
- Rule creation and management

### Portfolio (`/portfolio`)
- Holdings table with detailed metrics
- Sector allocation pie chart
- Performance tracking
- Add/remove holdings
- Summary statistics

## Mock Data

The application includes realistic Indian stock data:
- 10 major Indian stocks (RELIANCE, TCS, INFY, HDFC, etc.)
- Portfolio with 6 holdings totaling ₹35.4L
- 5 auto-trading rules
- 10 recent trades
- Market indices (SENSEX, NIFTY50, BANKNIFTY, etc.)

## API Integration Points

The platform is configured to integrate with:
- **MyVault API**: https://api.myvault.in
- **KnowledgeHub API**: https://api.knowledgehub.ai

## Customization

### Adding New Stocks

Edit `/src/lib/mockData.ts` and add stocks to the `stocks` array:

```typescript
{
  id: '11',
  symbol: 'NEWSTOCK',
  name: 'New Company Ltd',
  sector: 'Sector',
  price: 1000,
  // ... other fields
}
```

### Modifying Theme

Edit `tailwind.config.js` to customize colors, fonts, and styles.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized images and lazy loading
- Code splitting for faster page loads
- Dark mode friendly UI
- Mobile-responsive design

## Security

- Environment variables for sensitive data
- Type-safe TypeScript throughout
- No sensitive data in mock data

## Future Enhancements

- Real-time market data integration
- User authentication
- Persistent data storage
- Mobile app
- Advanced backtesting
- Social trading features

## License

All rights reserved. TheEquinox.ai - Royal Luxe Trading Platform

## Support

For support and inquiries, contact: support@equinox.ai

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Docker

```bash
docker build -t theequinox .
docker run -p 3002:3002 theequinox
```

### Traditional Hosting

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_APP_NAME=TheEquinox.ai
NEXT_PUBLIC_MYVAULT_API=https://api.myvault.in
NEXT_PUBLIC_KNOWLEDGEHUB_API=https://api.knowledgehub.ai
```

---

**TheEquinox.ai** - Invest Smarter. Grow Faster.
