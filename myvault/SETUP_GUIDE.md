# MyVault Setup Guide

## Quick Start

### 1. Installation
```bash
cd /sessions/vibrant-magical-cannon/mnt/outputs/myvault
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Application will be available at: http://localhost:3004

### 3. Build for Production
```bash
npm run build
npm start
```

## Project Structure Explained

### Configuration Files
- **package.json**: Dependencies and scripts
- **tsconfig.json**: TypeScript compiler options
- **tailwind.config.js**: Tailwind CSS theme configuration
- **postcss.config.js**: PostCSS processing pipeline
- **next.config.js**: Next.js configuration

### Source Code

#### `/src/app/`
Main application pages using Next.js App Router:
- **page.tsx**: Landing/home page
- **layout.tsx**: Root layout wrapper
- **globals.css**: Global styles and utilities
- **dashboard/page.tsx**: Main wealth dashboard
- **properties/page.tsx**: Real estate portfolio (YesBroker)
- **portfolio/page.tsx**: Stock portfolio (TheEquinox.ai)
- **legal/page.tsx**: Estate planning (MyWills)
- **analytics/page.tsx**: Advanced wealth analytics
- **settings/page.tsx**: Sync and platform settings

#### `/src/components/`
Reusable React components:
- **layout/Sidebar.tsx**: Navigation sidebar with platform status
- **layout/AppLayout.tsx**: Main layout wrapper for authenticated pages

#### `/src/lib/`
Utility functions and type definitions:
- **types.ts**: TypeScript interfaces for all data models
- **mockData.ts**: Development mock data and utility functions

## Key Features

### Dashboard
The main dashboard displays:
- Total net worth (₹12.02 Cr)
- Month/day changes with percentage
- 3 platform sync status cards
- Net worth breakdown donut chart
- 12-month trend area chart
- Wealth highlights (properties, holdings, will)
- KnowledgeHub.ai master analytics card

### Responsive Design
- Desktop: Full sidebar + content layout
- Tablet: Optimized grid layouts
- Mobile: Stack-based layouts (with sidebar adjustments)

### Color Scheme
All components use the luxury black/gold theme:
- `.card-vault`: Dark cards with gold borders
- `.btn-vault`: Gradient gold buttons
- `.badge-vault`: Gold accent badges
- `.text-gold` / `.text-gold-light`: Gold text colors

### Animations
- Gold shimmer effects
- Smooth transitions on hover
- Pulse animations for sync status
- Gold glow effects

## Customization

### Update User Profile
Edit `/src/lib/mockData.ts`:
```typescript
export const mockProfile: VaultProfile = {
  id: 'user_id',
  name: 'User Name',
  email: 'user@email.com',
  // ... other fields
};
```

### Modify Net Worth Data
Update `mockNetWorth` in `/src/lib/mockData.ts`:
```typescript
export const mockNetWorth: NetWorthBreakdown = {
  realEstate: 68000000,     // ₹6.8 Cr
  investments: 3540000,     // ₹35.4 L
  willAssets: 43500000,     // ₹4.35 Cr
  cash: 1200000,            // ₹12 L
  other: 500000,            // ₹5 L
  total: 120200000,         // ₹12.02 Cr
};
```

### Change Colors
Edit `/tailwind.config.js`:
```javascript
vault: {
  black: '#0A0A0A',          // Primary background
  charcoal: '#1A1A1A',       // Secondary background
  gold: '#C9A84C',           // Primary accent
  'gold-light': '#E8C96A',   // Light accent
  cream: '#FEF9EE',          // Text highlight
}
```

## Navigation

### Main Routes
- `/` - Landing page
- `/dashboard` - Main dashboard
- `/properties` - Real estate portfolio
- `/portfolio` - Stock portfolio
- `/legal` - Estate and will documents
- `/analytics` - Advanced analytics
- `/settings` - Sync settings

### Sidebar Navigation
Available in all authenticated pages via AppLayout component

## Data Types

### Key Interfaces
```typescript
SyncSource {
  id: 'yesbroker' | 'theequinox' | 'mywills'
  name: string
  status: 'synced' | 'syncing' | 'error' | 'disconnected'
  lastSync: Date
  enabled: boolean
}

NetWorthBreakdown {
  realEstate: number
  investments: number
  willAssets: number
  cash: number
  other: number
  total: number
}

Property {
  id: string
  address: string
  type: 'residential' | 'commercial' | 'land'
  value: number
  status: 'active' | 'rented' | 'sold'
  roi?: number
}

Holding {
  symbol: string
  name: string
  quantity: number
  currentPrice: number
  totalValue: number
  gain: number
  gainPercent: number
}
```

## Styling Guidelines

### Using Tailwind Classes

#### Cards
```tsx
<div className="card-vault">
  {/* Light card with gold border */}
</div>

<div className="card-vault-premium">
  {/* Premium card with gradient background */}
</div>

<div className="card-vault-dark">
  {/* Dark minimal card */}
</div>
```

#### Buttons
```tsx
<button className="btn-vault">Primary Action</button>
<button className="btn-vault-outline">Secondary Action</button>
```

#### Badges
```tsx
<span className="badge-vault">Default</span>
<span className="badge-vault-success">Success</span>
<span className="badge-vault-warning">Warning</span>
<span className="badge-vault-error">Error</span>
```

#### Text
```tsx
<h1 className="text-5xl font-playfair font-800 text-vault-gold-light">
  Heading
</h1>
<p className="text-gray-400">Body text</p>
<span className="text-vault-gold">Gold text</span>
```

## Charts and Visualizations

### Using Recharts
All charts are configured with dark theme colors:
```tsx
<PieChart>
  <Pie data={data} fill="#C9A84C" />
</PieChart>

<AreaChart>
  <Area stroke="#E8C96A" fill="url(#gradient)" />
</AreaChart>

<BarChart>
  <Bar fill="#C9A84C" />
</BarChart>
```

## Utilities

### Format Currency (Indian Numbering)
```typescript
formatCurrency(value: number): string
// 68000000 -> "₹6.8 Cr"
// 100000 -> "₹1 L"
// 1000 -> "₹1,000"
```

### Time Ago Format
```typescript
getTimeAgo(date: Date): string
// 5 minutes ago -> "5m ago"
// 2 hours ago -> "2h ago"
// 1 day ago -> "1d ago"
```

## Deployment

### Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_API_URL=https://api.myvault.com
```

### Vercel Deployment
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3004
CMD ["npm", "start"]
```

## Troubleshooting

### Port 3004 Already in Use
```bash
npm run dev -- -p 3005
```

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

### TypeScript Errors
```bash
npm run build -- --no-lint
```

## Performance Tips

1. **Image Optimization**: Use Next.js Image component for all images
2. **Code Splitting**: Pages are automatically code-split by Next.js
3. **Caching**: Utilize Tailwind CSS caching with PostCSS
4. **Bundle Analysis**: Install `@next/bundle-analyzer` to check bundle size

## Security Checklist

- [ ] Remove mock data before production
- [ ] Implement authentication
- [ ] Add API rate limiting
- [ ] Enable HTTPS/SSL
- [ ] Set up CORS properly
- [ ] Validate all user inputs
- [ ] Implement proper error handling
- [ ] Add logging and monitoring
- [ ] Regular security audits

## Next Steps

1. Integrate real API endpoints
2. Implement user authentication
3. Connect to YesBroker, TheEquinox.ai, MyWills APIs
4. Set up KnowledgeHub.ai integration
5. Deploy to production environment
6. Configure analytics tracking
7. Set up automated backups

## Support Resources

- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Recharts: https://recharts.org/
- Lucide Icons: https://lucide.dev/

