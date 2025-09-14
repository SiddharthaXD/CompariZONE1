# CompariZONE - Product Comparison Website

A modern, dark-themed e-commerce product comparison hub with real API integration and database support.

## Features
- Real-time product scraping from Amazon & Flipkart APIs
- Supabase database for caching and analytics
- Price comparison with discounts and ratings
- Responsive design with 3D effects
- Contact form with backend integration

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd comparizone
   npm install
   ```

2. **Setup Environment Variables**
   - Create a Supabase project at https://supabase.com
   - Get RapidAPI key from https://rapidapi.com
   - Update `.env` file with your credentials:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   RAPIDAPI_KEY=your_rapidapi_key
   ```

3. **Setup Database**
   - Run the SQL commands from `supabase-setup.sql` in your Supabase SQL editor

4. **Start the Server**
   ```bash
   npm start
   ```

5. **Access the Website**
   Open your browser and go to: `http://localhost:3000`

## Usage
- Search for any product (e.g., "iPhone 15", "laptop", "headphones")
- Paste product URLs from Amazon or Flipkart
- Results are cached in database for 24 hours
- Fallback to mock data if APIs are unavailable

## API Endpoints
- `POST /api/search` - Search products across platforms
- `POST /api/contact` - Submit contact form

## Technologies Used
- Frontend: HTML5, CSS3, JavaScript
- Backend: Node.js, Express.js
- Database: Supabase (PostgreSQL)
- APIs: RapidAPI (Amazon & Flipkart scrapers)
- Styling: Custom CSS with dark theme and 3D effects