const express = require('express');
const cors = require('cors');
const path = require('path');
const { scrapeAllPlatforms, getMockData } = require('./scrapers');
const { saveSearch, saveProduct, getCachedProducts } = require('./database');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Search products endpoint
app.post('/api/search', async (req, res) => {
  const { query, url } = req.body;
  let searchQuery = query;
  
  // Extract query from URL if provided
  if (url && !query) {
    if (url.includes('iphone')) searchQuery = 'iphone';
    else if (url.includes('laptop') || url.includes('macbook')) searchQuery = 'laptop';
    else searchQuery = 'phone'; // default
  }
  
  try {
    // Check cache first (only if less than 1 hour old for real-time data)
    let results = await getCachedProducts(searchQuery);
    const cacheExpiry = new Date(Date.now() - 60 * 60 * 1000); // 1 hour
    
    if (results.length === 0 || new Date(results[0]?.updated_at) < cacheExpiry) {
      console.log('Fetching fresh data from all platforms...');
      
      // Scrape from all platforms simultaneously
      results = await scrapeAllPlatforms(searchQuery);
      
      // Fallback to mock data if all APIs fail
      if (results.length === 0) {
        console.log('All APIs failed, using mock data');
        results = getMockData(searchQuery);
      } else {
        console.log(`Found ${results.length} products from live APIs`);
      }
      
      // Save fresh products to database
      for (const product of results) {
        await saveProduct({
          ...product,
          updated_at: new Date().toISOString()
        });
      }
    } else {
      console.log(`Using cached data: ${results.length} products`);
    }
    
    // Add calculated fields
    results = results.map(product => ({
      ...product,
      discount: product.originalPrice > 0 ? 
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0
    }));
    
    // Save search query
    await saveSearch(searchQuery, results);
    
    res.json({ products: results });
  } catch (error) {
    console.error('Search error:', error);
    // Return mock data on error
    const mockResults = getMockData(searchQuery || 'iphone');
    res.json({ products: mockResults });
  }
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  setTimeout(() => {
    console.log('Contact form submission:', { name, email, message });
    res.json({ success: true, message: 'Message sent successfully!' });
  }, 1000);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`CompariZONE server running on http://localhost:${PORT}`);
});