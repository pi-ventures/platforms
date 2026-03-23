# MyWills - Quick Start Guide

## 60 Second Setup

```bash
# 1. Navigate to project
cd /sessions/vibrant-magical-cannon/mnt/outputs/mywills

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Visit: http://localhost:3003
```

That's it! The app is running.

## What You Get

A **complete, professional legal will management platform** with:

- Dashboard with estate overview
- Asset management system
- Family tree & heir designation
- Will document viewer
- Legal review interface
- Document storage
- User settings

## Explore the App

### Landing Page
**URL**: `http://localhost:3003/`
- Hero section with features
- Pricing tiers
- Trust indicators
- Legal partnership info

### Dashboard
**URL**: `http://localhost:3003/dashboard`
- Estate value: ₹4.35 Crores
- 6 Assets tracked
- 5 Family members
- Active will status
- MyVault sync indicator
- Recent activity

### Assets
**URL**: `http://localhost:3003/assets`
- All 6 sample assets
- Beneficiary breakdown
- Asset categories
- Documents storage
- Add new assets

### Family Tree
**URL**: `http://localhost:3003/family`
- Visual family structure
- 5 family members
- Legal heir designation
- Contact details
- Inheritance shares

### Will
**URL**: `http://localhost:3003/will`
- Active will status
- All assets covered
- Legal opinion
- Download option

### Documents
**URL**: `http://localhost:3003/documents`
- 5 sample documents
- Secure storage info
- Download/delete actions

### Legal Review
**URL**: `http://localhost:3003/legal-review`
- Lawyer information
- Legal opinion text
- Court-admissibility
- Indian law compliance

### Settings
**URL**: `http://localhost:3003/settings`
- Account management
- Security settings
- Notifications
- Data export

## Sample Data

All pages use realistic mock data:

**Testator**: Ramesh Agarwal (Mumbai)
**Estate Value**: ₹4.35 Crores
**Family**: 5 members
**Assets**: 6 items
**Will Status**: Active & Signed

## Key Features

✅ Professional legal design
✅ Responsive mobile layout
✅ Indian Succession Act compliance
✅ Asset tracking
✅ Family heir management
✅ Will document viewer
✅ Secure document storage
✅ Legal opinion integration
✅ MyVault synchronization
✅ Animations and interactions

## Customize Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  legal: {
    primary: '#1A2744',    // Change navy
    gold: '#C9A84C',       // Change gold
    cream: '#F8F6F0',      // Change cream
    green: '#2D5016',      // Change green
    accent: '#4A6FA5',     // Change accent
  }
}
```

## Customize Data

Edit `src/lib/mockData.ts`:

- Change testator name
- Modify family members
- Update asset details
- Change valuations
- Edit will content

## Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t mywills .
docker run -p 3003:3003 mywills
```

### Traditional Server
```bash
npm run build
npm start
```

## File Structure

```
mywills/
├── src/
│   ├── app/              # Pages
│   │   ├── dashboard/    # Main dashboard
│   │   ├── assets/       # Asset management
│   │   ├── family/       # Family tree
│   │   ├── will/         # Will viewer
│   │   ├── documents/    # Document storage
│   │   ├── legal-review/ # Legal opinions
│   │   └── settings/     # Settings
│   ├── components/       # React components
│   │   └── layout/       # Layout components
│   └── lib/              # Utilities
│       ├── types.ts      # TypeScript types
│       └── mockData.ts   # Sample data
├── tailwind.config.js    # Style configuration
└── package.json          # Dependencies
```

## Technologies

- **Next.js 14** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Recharts** - Charts

## Common Tasks

### Add a New Asset
1. Go to `/assets`
2. Click "Add Asset"
3. Fill the form
4. Submit

### Update Family Member
1. Go to `/family`
2. Click edit on a member
3. Modify details
4. Save

### Change Logo
Edit `src/components/layout/Sidebar.tsx`:
```tsx
// Find the logo section and update
<div className="flex items-center justify-center w-10 h-10 bg-legal-gold rounded-lg">
  <YourIcon size={24} className="text-legal-primary" />
</div>
```

### Add New Page
1. Create folder in `src/app/newpage/`
2. Create `page.tsx` file
3. Add to sidebar in `src/components/layout/Sidebar.tsx`

## Styling Classes

```tsx
// Buttons
<button className="btn-legal-primary">Primary</button>
<button className="btn-legal-secondary">Secondary</button>
<button className="btn-legal-outline">Outline</button>

// Cards
<div className="card-legal">Content</div>

// Badges
<span className="badge-legal">Badge</span>

// Colors
text-legal-primary      // Navy
text-legal-gold        // Gold
text-legal-cream       // Cream
text-legal-green       // Green
text-legal-accent      // Blue
```

## Tips & Tricks

### Hide Sidebar for Landing
Landing page already has custom header - sidebar is hidden by AppLayout

### Use Mock Data
All components use mock data from `src/lib/mockData.ts` - Ready for API integration

### Type Safety
All components are fully typed - catch errors early

### Responsive Design
All pages work on mobile, tablet, desktop

### Print Support
CSS includes print styles for documents

## Troubleshooting

**Port 3003 in use?**
```bash
npm run dev -- -p 3004
```

**Dependencies not installed?**
```bash
rm -rf node_modules
npm install
```

**Styles not loading?**
```bash
npm run build
npm start
```

**Types not working?**
```bash
npx tsc --noEmit
```

## Next Steps

1. ✅ App is running - Explore all pages
2. 📝 Customize data - Edit mockData.ts
3. 🎨 Adjust colors - Edit tailwind.config.js
4. 🔌 Connect backend - Integrate APIs
5. 🚀 Deploy - Choose your platform

## Documentation

- **README.md** - Complete documentation
- **INSTALL.md** - Installation guide
- **PROJECT_SUMMARY.md** - Implementation details
- **IMPLEMENTATION_CHECKLIST.md** - Feature tracking

## Support

- Check docs in `/docs` folder
- Review code comments
- Check mock data structure
- Review type definitions

## Links

- **Legal Partner**: https://www.legalopinion.co.in
- **MyVault**: https://api.myvault.co.in
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com

---

**You're ready to go!** 🚀

Visit **http://localhost:3003** and start exploring.
