# MyWills Installation & Setup Guide

## Quick Start

### 1. Clone/Navigate to Project
```bash
cd /sessions/vibrant-magical-cannon/mnt/outputs/mywills
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Run Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at: **http://localhost:3003**

## Project Structure

```
mywills/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Landing page (/)
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   ├── dashboard/         # Dashboard (/dashboard)
│   │   ├── assets/            # Assets (/assets)
│   │   ├── family/            # Family tree (/family)
│   │   ├── will/              # Will (/will)
│   │   ├── documents/         # Documents (/documents)
│   │   ├── legal-review/      # Legal review (/legal-review)
│   │   └── settings/          # Settings (/settings)
│   ├── components/
│   │   └── layout/            # Layout components
│   │       ├── Sidebar.tsx    # Navigation sidebar
│   │       └── AppLayout.tsx  # Layout wrapper
│   └── lib/
│       ├── types.ts           # TypeScript type definitions
│       └── mockData.ts        # Mock data for testing
├── tailwind.config.js         # Tailwind CSS theme
├── next.config.js             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## Available Pages

### Public Pages
- **Landing Page** (`/`) - Homepage with features and pricing
- **Dashboard** (`/dashboard`) - Main dashboard with estate overview
- **Assets** (`/assets`) - Asset management and listing
- **Family Tree** (`/family`) - Family structure and legal heirs
- **My Will** (`/will`) - Will document viewing
- **Documents** (`/documents`) - Document storage and management
- **Legal Review** (`/legal-review`) - Legal opinion display
- **Settings** (`/settings`) - User settings and preferences

## Development

### Build for Production
```bash
npm run build
npm start
```

### Technologies Used
- **Framework**: Next.js 14.2.0
- **UI Library**: React 18.3.0
- **Styling**: Tailwind CSS 3.4.4
- **Icons**: Lucide React 0.400.0
- **Charts**: Recharts 2.12.0
- **Language**: TypeScript 5.4.5

### Fonts
- **Headers**: Crimson Pro (Google Fonts)
- **Body**: Inter (Google Fonts)

## Configuration

### Environment Variables
Create a `.env.local` file (copy from `.env.example`):

```bash
NEXT_PUBLIC_MYVAULT_API=https://api.myvault.co.in
NEXT_PUBLIC_KNOWLEDGE_HUB_API=https://hub.legalopinion.co.in
NEXT_PUBLIC_LEGAL_PARTNER=https://www.legalopinion.co.in
```

### Tailwind CSS Theme

The theme is configured in `tailwind.config.js`:

```javascript
colors: {
  legal: {
    primary: '#1A2744',    // Deep Navy
    gold: '#C9A84C',       // Gold
    cream: '#F8F6F0',      // Cream
    green: '#2D5016',      // Forest Green
    accent: '#4A6FA5',     // Accent Blue
  }
}
```

## Sample Data

The application includes comprehensive mock data:

### Testator (Main User)
- **Name**: Ramesh Agarwal
- **Location**: Mumbai
- **Assets**: 6 total (₹4.35 Cr)

### Family Members
- Sunita Agarwal (Spouse) - 40%
- Vikram Agarwal (Son) - 30%
- Priya Sharma (Daughter) - 25%
- Suresh Agarwal (Brother) - 0%
- Kamla Agarwal (Mother) - 5%

### Assets
1. Mumbai Residential Flat - ₹2.5 Cr
2. Pune Residential Plot - ₹80 L
3. Mutual Funds Portfolio - ₹45 L
4. Fixed Deposits - ₹30 L
5. Gold Jewelry - ₹12 L
6. Honda City Vehicle - ₹8 L

## Customization

### Colors
Edit `tailwind.config.js` to change the legal color theme:

```javascript
colors: {
  legal: {
    primary: '#YOUR_COLOR',
    gold: '#YOUR_COLOR',
    cream: '#YOUR_COLOR',
    green: '#YOUR_COLOR',
    accent: '#YOUR_COLOR',
  }
}
```

### Mock Data
Edit `src/lib/mockData.ts` to change sample data:
- Testator information
- Family members
- Assets
- Will content
- Legal opinions

### Fonts
To change fonts, edit:
1. `tailwind.config.js` - Add new Google Font imports
2. `src/app/globals.css` - Import Google Fonts
3. Update `fontFamily` in Tailwind config

## Features

### Dashboard
- Estate overview with total asset value
- Asset breakdown pie chart
- Family members list with inheritance percentages
- Will coverage progress indicator
- MyVault synchronization status
- Recent activity timeline
- Quick action buttons

### Assets Management
- Browse all assets by type
- View asset details (location, valuation)
- See beneficiary distribution
- Add new assets
- Upload documents
- Track asset values

### Family Tree
- Visual family structure
- Legal heir designation
- Class I & II heir classification
- Contact information
- Identification details (PAN, Aadhar)
- Inheritance percentages

### Will Management
- View complete will document
- Check legal review status
- See asset coverage
- Download will document
- Share will with family
- View legal opinion

### Legal Compliance
- Indian Succession Act compliance
- Court-admissible will generation
- Professional legal review
- Certified advocate opinions
- Proper heir classification

## Troubleshooting

### Port Already in Use
If port 3003 is in use, change in `package.json`:
```json
"dev": "next dev -p 3004"
```

### Module Not Found
Ensure all dependencies are installed:
```bash
npm install
```

### CSS Not Loading
Make sure `globals.css` is imported in `src/app/layout.tsx`:
```tsx
import './globals.css';
```

### Font Not Loading
Verify Google Fonts URL in `src/app/globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');
```

## Performance Tips

1. **Images**: Add images in `public/` folder
2. **Caching**: Enable static generation for pages
3. **Code Splitting**: Next.js handles automatically
4. **Fonts**: Google Fonts are already optimized

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3003
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t mywills .
docker run -p 3003:3003 mywills
```

## Support & Resources

- **Documentation**: See README.md
- **Legal Partner**: https://www.legalopinion.co.in
- **MyVault API**: https://api.myvault.co.in
- **Knowledge Hub**: https://hub.legalopinion.co.in

## License

This project is proprietary and confidential.

---

**Ready to start?** Run `npm install && npm run dev` and visit http://localhost:3003
