# Real-Time Data Setup Guide

## 🚀 Get Live Product Data from All Major Platforms

### Required API Subscriptions (RapidAPI)

1. **Go to RapidAPI.com** and subscribe to these APIs:

#### Amazon APIs:
- **Real Time Amazon Data** - https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-amazon-data
- **Amazon Products API** - https://rapidapi.com/logicbuilder/api/amazon-products1
- **Amazon Data Scraper** - https://rapidapi.com/datacrawler/api/amazon-data-scraper127

#### Flipkart APIs:
- **Flipkart Scraper API** - https://rapidapi.com/datascraper/api/flipkart-scraper-api
- **Flipkart Product Search** - https://rapidapi.com/apidojo/api/flipkart-product-search

#### Other Platforms:
- **Myntra Data Scraper** - https://rapidapi.com/scraper-api/api/myntra-data-scraper
- **Snapdeal Scraper** - https://rapidapi.com/scraper-api/api/snapdeal-scraper

### Setup Steps:

1. **Get RapidAPI Key:**
   - Sign up at https://rapidapi.com
   - Go to your dashboard
   - Copy your API key

2. **Update .env file:**
   ```
   RAPIDAPI_KEY=your_actual_rapidapi_key_here
   ```

3. **Subscribe to APIs:**
   - Visit each API link above
   - Click "Subscribe to Test"
   - Choose free tier (usually 100-1000 requests/month)

### 🎯 What You Get:

- **Real-time prices** from Amazon, Flipkart, Myntra, Snapdeal
- **Live stock status** and availability
- **Current ratings** and review counts
- **Fresh product images** and descriptions
- **Actual delivery information**
- **Up to 20 products per search** (5 from each platform)

### 🔄 Cache Strategy:

- **1-hour cache** for real-time updates
- **Automatic fallback** to mock data if APIs fail
- **Database storage** for analytics and faster subsequent searches

### 💡 Free Tier Limits:

Most APIs offer 100-1000 free requests per month, which is perfect for testing and small-scale usage.

### 🚀 Start Using:

```bash
npm start
```

Search for any product and get live data from all platforms!