# MV Travel - Maldives Hotel Booking Platform

A production-ready enterprise web application for booking hotels in the Maldives. Built with Next.js 14+ App Router, integrating with LiteAPI by Nuitee for hotel search, availability, and booking operations.

## Features

- 🤖 **AI-Powered Search** - Natural language hotel search using Gemini AI
- 🏨 **Hotel Search & Discovery** - Browse and filter hotels across the Maldives
- 🔍 **Advanced Filters** - Star rating, price, amenities, cancellation policy, transfer type
- 🗺️ **Interactive Map View** - Visualize hotels on an interactive map with pricing
- ❤️ **Wishlist System** - Save favorite hotels with localStorage persistence
- 📅 **Real-time Availability** - Check room availability with live pricing
- 🔐 **Secure Booking** - Complete booking flow with prebook and LiteAPI integration
- 🔎 **Booking Lookup** - Search and retrieve existing bookings
- 🎯 **Popular Themes** - Quick search by vacation style (Honeymoon, Water Villa, etc.)
- 👤 **User Authentication** - Supabase-powered auth with email/password
- 📱 **Responsive Design** - Mobile-first with enhanced desktop layouts
- 🎨 **Modern UI** - Tailwind CSS with Shadcn/ui components
- ⚡ **Performance Optimized** - Next.js ISR, caching, and image optimization

## Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn/ui + Radix UI
- **State Management**: Zustand with localStorage persistence
- **AI Integration**: Gemini AI for natural language search
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

Configure your `.env.local` file (see `.env.local.example`):

```env
# LiteAPI - Required for hotel data
LITEAPI_API_KEY=your_liteapi_production_key_here
LITEAPI_SANDBOX_KEY=your_liteapi_sandbox_key_here
LITEAPI_BASE_URL=https://api.liteapi.travel/v3.0

# Gemini AI - Required for AI/Vibe search
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase - Optional, for authentication
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

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
│   │   ├── hotels/       # Hotel search, details, map view
│   │   │   └── map/      # Interactive map view
│   │   ├── booking/      # Booking flow with prebook
│   │   ├── booking-lookup/ # Search existing bookings
│   │   ├── wishlist/     # Saved hotels
│   │   ├── dashboard/    # User dashboard
│   │   ├── destinations/ # Destination guides
│   │   ├── blog/         # Travel blog
│   │   ├── about/        # About page
│   │   └── faq/          # FAQ page
│   ├── api/              # API routes
│   │   ├── search/       # Hotel search
│   │   ├── ai-search/    # AI-powered vibe search
│   │   ├── availability/ # Room availability
│   │   ├── book/         # Prebook & booking
│   │   ├── booking/[id]/ # Get/cancel booking
│   │   ├── hotels/[id]/  # Hotel details
│   │   └── webhooks/     # Booking webhooks
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/               # Shadcn UI components (including tabs)
│   ├── search/           # Search form (with mode toggle), filters
│   ├── travel/           # Hotel cards, carousels
│   ├── shared/           # WishlistButton, etc.
│   └── layout/           # Header (with wishlist badge), footer
├── lib/
│   ├── liteapi/          # LiteAPI client
│   │   ├── client.ts     # API client
│   │   ├── types.ts      # TypeScript types
│   │   └── cache.ts      # Response caching
│   ├── gemini/           # Gemini AI integration
│   │   └── client.ts     # AI search processor
│   ├── supabase/         # Supabase clients
│   └── utils/            # Utility functions
├── store/                # Zustand state management
│   ├── search-store.ts   # Search state & filters
│   ├── wishlist-store.ts # Wishlist with persistence
│   ├── prebook-store.ts  # Booking prebook state
│   └── ui-store.ts       # UI modals & loading
├── types/                # TypeScript type definitions
│   ├── search.ts         # Search, filters, sort types
│   ├── booking.ts        # Booking & prebook types
│   └── wishlist.ts       # Wishlist types
├── hooks/                # Custom React hooks
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
| `/api/ai-search` | POST | AI-powered vibe search |
| `/api/availability` | GET | Check room availability |
| `/api/book` | POST | Create a booking |
| `/api/book` | PUT | Prebook a rate (reserve) |
| `/api/booking/[id]` | GET/DELETE | Get or cancel booking |
| `/api/hotels/[id]` | GET | Get hotel details |
| `/api/webhooks` | POST | Handle booking webhooks |

## Features by Page

### Homepage (`/`)
- Hero section with dual-mode search form (Destination/Vibe)
- Popular themes section (6 clickable cards)
- Featured hotels from LiteAPI
- Destination highlights
- Testimonials
- Features overview

### Hotels Search (`/hotels`)
- Dual search modes: Traditional destination or AI-powered vibe search
- Advanced filter sidebar:
  - Star rating (1-5 stars)
  - Price range (min/max)
  - Board type (Room only, Breakfast, Half/Full board, All-inclusive)
  - Cancellation policy (Free cancellation, Non-refundable, Partial refund)
  - Transfer type (Speedboat, Seaplane, Domestic flight, No transfer)
  - Amenities (10+ options)
- Sort by price, rating, stars
- Grid/list view toggle
- Map view button

### Hotels Map View (`/hotels/map`)
- Interactive map with hotel markers
- Price badges on markers
- Click markers for hotel preview cards
- Quick access to hotel details
- Toggle back to list view

### Hotel Details (`/hotels/[id]`)
- Hotel information from LiteAPI
- Image gallery
- Amenities list
- Wishlist button (save favorite)
- Live availability check
- Room selection with rates

### Booking (`/booking`)
- Automatic rate reservation (prebook)
- Real-time status indicators (loading/success/error)
- Guest information form with validation
- Payment section (ready for SDK)
- Booking summary with price breakdown
- 10-minute rate hold

### Booking Lookup (`/booking-lookup`)
- Search bookings by ID
- Optional email verification
- Display comprehensive booking details
- Download confirmation and cancel booking actions

### Wishlist (`/wishlist`)
- Grid display of saved hotels
- Remove from wishlist functionality
- Empty state with CTA
- localStorage persistence
- Quick access to hotel details

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
