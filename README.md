# MV Travel - Maldives Hotel Booking Platform

A production-ready enterprise web application for booking hotels in the Maldives. Built with Next.js 14+ App Router, integrating with LiteAPI by Nuitee for hotel search, availability, and booking operations.

## Features

- 🏨 **Hotel Search & Discovery** - Browse and filter hotels across the Maldives
- 📅 **Real-time Availability** - Check room availability with live pricing
- 🔐 **Secure Booking** - Complete booking flow with LiteAPI integration
- 👤 **User Authentication** - Supabase-powered auth with email/password
- 📱 **Responsive Design** - Mobile-first with enhanced desktop layouts
- 🎨 **Modern UI** - Tailwind CSS with Shadcn/ui components
- ⚡ **Performance Optimized** - Next.js ISR, caching, and image optimization

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn/ui + Radix UI
- **Authentication**: Supabase Auth
- **API Integration**: LiteAPI by Nuitee
- **Typography**: Poppins (body), STIX Two Text (headings)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- LiteAPI API key (get one at [liteapi.travel](https://liteapi.travel))
- Supabase project (optional, for auth)

### Installation

```bash
# Clone the repository
git clone https://github.com/0x-m1cro/mv-travel.git
cd mv-travel

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

Configure your `.env.local` file:

```env
# LiteAPI - Required for hotel data
LITEAPI_API_KEY=your_sandbox_or_production_key
LITEAPI_BASE_URL=https://api.liteapi.travel/v3.0

# Supabase - Required for authentication
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
mv-travel/
├── app/
│   ├── (auth)/           # Auth pages (login, register, activate)
│   ├── (main)/           # Main pages with header/footer
│   │   ├── hotels/       # Hotel search and details
│   │   ├── booking/      # Booking flow
│   │   ├── dashboard/    # User dashboard
│   │   ├── destinations/ # Destination guides
│   │   ├── blog/         # Travel blog
│   │   ├── about/        # About page
│   │   └── faq/          # FAQ page
│   ├── api/              # API routes
│   │   ├── search/       # Hotel search
│   │   ├── availability/ # Room availability
│   │   ├── book/         # Create booking
│   │   ├── booking/[id]/ # Get/cancel booking
│   │   ├── hotels/[id]/  # Hotel details
│   │   └── webhooks/     # Booking webhooks
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/               # Shadcn UI components
│   ├── search/           # Search form, filters
│   ├── hotels/           # Hotel cards, lists
│   ├── booking/          # Booking forms
│   ├── layout/           # Header, footer
│   └── shared/           # Shared components
├── lib/
│   ├── liteapi/          # LiteAPI client
│   │   ├── client.ts     # API client
│   │   ├── types.ts      # TypeScript types
│   │   └── cache.ts      # Response caching
│   ├── supabase/         # Supabase clients
│   └── utils/            # Utility functions
├── hooks/                # Custom React hooks
├── types/                # Global TypeScript types
└── public/               # Static assets
```

## API Integration

### LiteAPI Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/data/hotels` | GET | Get hotels by country/city |
| `/data/hotel` | GET | Get hotel details |
| `/hotels/rates` | POST | Search for rates |
| `/hotels` | POST | Get minimum rates |
| `/rates/prebook` | POST | Pre-book a rate |
| `/rates/book` | POST | Create booking |
| `/bookings/{id}` | GET | Get booking details |
| `/bookings/{id}` | PUT | Cancel booking |

### Internal API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/search` | GET | Search Maldives hotels |
| `/api/availability` | GET | Check room availability |
| `/api/book` | POST | Create a booking |
| `/api/booking/[id]` | GET/DELETE | Get or cancel booking |
| `/api/hotels/[id]` | GET | Get hotel details |
| `/api/webhooks` | POST | Handle booking webhooks |

## Features by Page

### Homepage (`/`)
- Hero section with search form
- Featured hotels from LiteAPI
- Destination highlights
- Testimonials
- Features overview

### Hotels Search (`/hotels`)
- Real-time hotel search
- Filter by star rating, price, amenities
- Sort by price, rating
- Grid/list view toggle

### Hotel Details (`/hotels/[id]`)
- Hotel information from LiteAPI
- Image gallery
- Amenities list
- Live availability check
- Room selection with rates

### Booking (`/booking`)
- Guest information form
- Payment details (ready for integration)
- Booking summary
- Terms acceptance

### Dashboard (`/dashboard`)
- User profile
- Booking history
- Quick links to help

## Deployment

### Vercel (Recommended)

```bash
npm run build
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## License

MIT License

## Support

For LiteAPI integration support: [docs.liteapi.travel](https://docs.liteapi.travel)

For application issues: Create an issue in this repository
