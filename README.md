# NotaryFinderNow

A modern web application to help users find and book notary services in their area. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- Location-based notary search
- Real-time availability tracking
- Online booking system
- Notary profiles with reviews and ratings
- Mobile-responsive design
- Google Maps integration
- Email notifications

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + PostGIS)
- **Maps**: Google Maps API
- **Email**: Resend
- **Analytics**: Google Analytics
- **Monetization**: Google AdSense

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/7lsnyc/notaryfindernow.git
   cd notaryfindernow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in the required API keys and configuration values

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Resend Email
RESEND_API_KEY=your_resend_api_key

# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id

# AdSense
NEXT_PUBLIC_ADSENSE_CLIENT_ID=your_adsense_client_id
```

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── layout/         # Layout components
│   ├── notary/         # Notary-related components
│   ├── search/         # Search components
│   └── map/            # Map components
├── lib/                # Utility functions and API clients
└── types/              # TypeScript type definitions
```

## Development

- Run tests: `npm test`
- Run linter: `npm run lint`
- Build for production: `npm run build`
- Start production server: `npm start`

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@notaryfindernow.com or join our Slack channel. 