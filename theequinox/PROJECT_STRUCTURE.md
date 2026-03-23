# TheEquinox.ai - Complete Project Structure

## File Overview

### Root Configuration Files

1. **package.json** - Project dependencies and scripts
   - Next.js 14, React 18, TypeScript
   - Tailwind CSS, Recharts, Lucide Icons
   - Scripts: dev (port 3002), build, start, lint

2. **tailwind.config.js** - Royal Luxe theme configuration
   - Custom colors: gold (#C9A84C), dark (#1A0533), purple (#2D1B69)
   - Custom fonts: Playfair Display (display), Inter (body)
   - Custom shadows and gradient backgrounds
   - Custom components: metric-card, card-dark, btn-gold

3. **next.config.js** - Next.js configuration
   - Environment variables for MyVault and KnowledgeHub APIs
   - App name: TheEquinox.ai

4. **tsconfig.json** - TypeScript configuration
   - Path alias: @/* → ./src/*
   - Strict mode enabled
   - ES2020 target

5. **postcss.config.js** - PostCSS configuration
   - Tailwind CSS plugin
   - Autoprefixer

6. **.gitignore** - Git ignore rules
   - Node modules, build artifacts, environment files

7. **README.md** - Comprehensive documentation
   - Features, tech stack, installation, structure
   - Theme, customization, deployment

### Source Code Structure

#### `/src/app/` - Pages and Layouts

**layout.tsx** - Root Layout
- Metadata configuration
- AppLayout wrapper
- Toaster setup

**globals.css** - Global Styles
- Font imports (Playfair Display, Inter)
- CSS variables and custom classes
- Dark theme with gold accents
- Button styles: .btn-gold, .btn-secondary
- Card styles: .card-dark, .card-glass, .metric-card
- Animations: fadeIn, shimmer, pulse-gold, slideIn
- Custom scrollbar styling

**page.tsx** - Landing Page
- Hero section with gold gradient text
- Feature grid (AI Auto-Trading, Analytics, Risk Management, MyVault Sync)
- Statistics section
- Pricing plans (Free, Wealth ₹1999/mo, Elite ₹4999/mo)
- Call-to-action sections
- Responsive navigation

**dashboard/page.tsx** - Dashboard Page
- Portfolio summary cards (Total Value, Day P&L, Total P&L, Active Rules)
- Performance area chart (12-month history)
- Top 5 holdings display
- Auto trading rules status
- Market indices grid (SENSEX, NIFTY50, BANKNIFTY, etc.)
- Recent trades table with sorting
- Value visibility toggle

**trading/page.tsx** - Trading Management Page
- Execute manual trade form
  - Stock selector with live prices
  - Buy/Sell order type
  - Quantity and price inputs
  - Total value calculation
- Create new auto-trading rule form
  - Rule name, type (SIP, Stop-Loss, Profit Booking, Rebalance, Buy on Dip)
  - Condition and target action inputs
- Active rules list with controls
  - Toggle rule on/off
  - Edit and delete buttons
  - Status indicators
- Inactive rules section
- Recent trades log table

**portfolio/page.tsx** - Portfolio Analytics Page
- Portfolio summary cards
  - Total portfolio value
  - Total invested
  - Total unrealized P&L
  - Average entry price
- Sector allocation pie chart (Energy, IT, Banking, Finance, Automobiles)
- Portfolio performance line chart (value vs invested)
- Add new holding form
  - Symbol, name, quantity, prices
  - Sector selection
- Holdings table with detailed metrics
  - Stock name and symbol
  - Quantity, average price, current market price
  - Holdings value, P&L amount and percentage
  - Day change indicator
  - Remove action button
- Summary statistics
  - Largest holding
  - Best performer
  - Diversification count

#### `/src/components/layout/` - Layout Components

**Sidebar.tsx** - Navigation Sidebar
- Logo section with THE EQUINOX branding
- Market status indicator (Market Open/Closed)
- Navigation menu (Dashboard, Trading, Portfolio, Analytics, Watchlist, Settings)
- Active page highlighting
- MyVault sync badge with last sync time
- User profile section at bottom
- Sticky positioning
- Dark gradient background with gold accents

**AppLayout.tsx** - App Wrapper
- Two-column layout (Sidebar + Main Content)
- Integrates Sidebar component
- React Hot Toast notifications
- Dark theme configuration for toasts

#### `/src/lib/` - Utilities and Data

**types.ts** - TypeScript Interfaces
- Stock: id, symbol, name, sector, price, change, changePercent, volume, marketCap, pe, high52, low52
- Holding: stockId, symbol, name, qty, avgPrice, currentPrice, value, pnl, pnlPercent, dayChange
- Portfolio: holdings[], totalValue, totalInvested, totalPnL, totalPnLPercent, dayPnL, dayPnLPercent
- AutoTradeRule: id, name, type, condition, target, active, triggered, profit
- Trade: id, symbol, type, qty, price, total, status, timestamp
- WatchlistItem: symbol, name, price, change, changePercent, alert
- MarketIndex: name, value, change, changePercent
- PortfolioMetrics: date, value, invested, pnl
- VaultSyncPayload: userId, holdings, totalValue, timestamp, syncStatus

**mockData.ts** - Demo Data
- **stocks**: 10 Indian stocks
  - RELIANCE (₹2,847.55) - Energy
  - TCS (₹3,745.20) - IT
  - INFY (₹1,625.80) - IT
  - HDFC (₹1,645.90) - Banking
  - ICICI (₹982.40) - Banking
  - WIPRO (₹445.80) - IT
  - BAJFINANCE (₹7,428.50) - Finance
  - TATAMOTORS (₹675.35) - Automobiles
  - MARUTI (₹10,285.40) - Automobiles
  - ITC (₹408.75) - FMCG

- **portfolio**: 
  - 6 holdings with realistic positions
  - Total value: ₹30.7L
  - Total invested: ₹29.9L
  - Total P&L: ₹5.1L (+16.7%)
  - Day P&L: +₹42K

- **autoTradeRules**: 5 active rules
  - Monthly SIP - RELIANCE
  - Stop Loss - TCS
  - Profit Booking - INFY
  - Rebalance Portfolio
  - Buy on Dip - HDFC

- **recentTrades**: 10 past trades with timestamps
  - Mix of buy/sell orders
  - Completed and pending statuses
  - Realistic prices and quantities

- **marketIndices**: Live-like market data
  - SENSEX: 75,423.45 (+0.43%)
  - NIFTY 50: 22,845.80 (+0.43%)
  - BANKNIFTY: 48,932.40 (+0.50%)
  - FINNIFTY: 21,045.30 (-0.59%)
  - MIDCAP: 14,235.60 (+0.60%)

- **portfolioMetrics**: 7 months of historical data
  - Shows portfolio growth from ₹26.3L to ₹30.7L
  - Tracks invested vs value growth

## Design System

### Color Palette
- **Primary Gold**: #C9A84C (primary accent)
- **Dark Purple**: #1A0533 (sidebar, backgrounds)
- **Dark Navy**: #0A0A1A (main background)
- **Purple Accent**: #2D1B69 (cards, hover states)
- **Light Text**: #F5F0E8 (main text color)
- **Gold Accent**: #E8C96A (hover states, highlights)

### Typography
- **Display Font**: Playfair Display (headings, titles)
- **Body Font**: Inter (paragraphs, labels)

### Component Classes
- `.btn-gold` - Primary button with gold gradient
- `.btn-gold-outline` - Outlined gold button
- `.btn-secondary` - Secondary purple button
- `.card-dark` - Dark card with gold border
- `.card-glass` - Glass-morphism card
- `.metric-card` - Gradient metric display card
- `.gradient-gold-text` - Gold gradient text
- `.table` - Styled data table

### Animations
- `fadeIn` - Smooth fade-in effect
- `shimmer` - Loading shimmer effect
- `pulse-gold` - Gold pulse animation
- `slideIn` - Slide-in from left

## Features Implemented

### Dashboard
- Real-time portfolio metrics
- Performance tracking with area charts
- Holdings overview
- Auto-rule status monitoring
- Market indices display
- Recent trades history

### Trading
- Auto-trading rule creation and management
- Manual trade execution
- Rule activation/deactivation
- Trade history logging
- Support for 5 rule types

### Portfolio
- Holdings management
- Sector allocation analysis
- Performance tracking
- P&L calculations
- Add/remove holdings

### Landing Page
- Premium hero section
- Feature highlights
- Pricing plans
- Statistics showcase
- Call-to-action buttons

## Technical Highlights

1. **Type Safety**: Full TypeScript coverage
2. **Responsive**: Mobile-first design
3. **Performance**: Optimized with Next.js 14
4. **Charts**: Interactive Recharts visualizations
5. **Styling**: Tailwind CSS with custom components
6. **Accessibility**: Semantic HTML, proper color contrast
7. **Dark Mode**: Native dark theme throughout
8. **Icons**: Lucide React icons library
9. **Notifications**: React Hot Toast integration
10. **State Management**: React hooks for local state

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Open browser to `http://localhost:3002`

## Future Enhancements

- Real-time WebSocket data
- User authentication
- Database integration
- Advanced backtesting
- Mobile app
- Machine learning predictions
- Social trading features
- Tax harvesting tools

---

**Total Files**: 16 core files + configuration
**Lines of Code**: ~3,500+ lines
**Components**: 2 layout components
**Pages**: 4 main pages
**Data Models**: 7 TypeScript interfaces
**UI Components**: 20+ styled components
