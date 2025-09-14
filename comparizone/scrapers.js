const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

// API endpoints for different platforms
const API_ENDPOINTS = {
  amazon: 'https://real-time-amazon-data.p.rapidapi.com/search',
  flipkart: 'https://flipkart-scraper-api.p.rapidapi.com/search',
  myntra: 'https://myntra-data-scraper.p.rapidapi.com/search',
  snapdeal: 'https://snapdeal-scraper.p.rapidapi.com/search'
};

// Amazon scraper using multiple APIs
async function scrapeAmazon(query) {
  if (!process.env.RAPIDAPI_KEY || process.env.RAPIDAPI_KEY === 'your_rapidapi_key_here') {
    return [];
  }
  
  const apis = [
    {
      url: 'https://real-time-amazon-data.p.rapidapi.com/search',
      host: 'real-time-amazon-data.p.rapidapi.com',
      params: { query: query, country: 'IN', sort_by: 'RELEVANCE', product_condition: 'ALL' }
    },
    {
      url: 'https://amazon-products1.p.rapidapi.com/search',
      host: 'amazon-products1.p.rapidapi.com', 
      params: { query: query, country: 'IN' }
    },
    {
      url: 'https://amazon-data-scraper127.p.rapidapi.com/search/products',
      host: 'amazon-data-scraper127.p.rapidapi.com',
      params: { query: query, country: 'IN' }
    }
  ];
  
  for (const api of apis) {
    try {
      const response = await axios.get(api.url, {
        params: api.params,
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': api.host
        },
        timeout: 10000
      });
      
      const products = response.data.data?.products || response.data.results || response.data.products || [];
      
      if (products.length > 0) {
        return products.slice(0, 5).map(product => ({
          platform: 'Amazon',
          product_id: product.asin || product.id || Math.random().toString(36),
          title: product.product_title || product.title || product.name,
          price: parseFloat(String(product.product_price || product.price || 0).replace(/[₹,$,]/g, '')),
          originalPrice: parseFloat(String(product.product_original_price || product.original_price || product.product_price || product.price || 0).replace(/[₹,$,]/g, '')),
          rating: parseFloat(product.product_star_rating || product.rating || product.stars || 0),
          reviews: parseInt(product.product_num_ratings || product.reviews_count || product.reviews || 0),
          image: product.product_photo || product.image || product.thumbnail,
          url: product.product_url || product.url || `https://amazon.in/dp/${product.asin}`,
          delivery: product.delivery || 'Free delivery',
          stock: product.is_prime ? 'Prime Available' : 'In Stock',
          seller: 'Amazon'
        }));
      }
    } catch (error) {
      console.log(`Amazon API ${api.host} failed:`, error.message);
      continue;
    }
  }
  
  return [];
}

// Flipkart scraper using multiple APIs
async function scrapeFlipkart(query) {
  if (!process.env.RAPIDAPI_KEY || process.env.RAPIDAPI_KEY === 'your_rapidapi_key_here') {
    return [];
  }
  
  const apis = [
    {
      url: 'https://flipkart-scraper-api.p.rapidapi.com/search',
      host: 'flipkart-scraper-api.p.rapidapi.com',
      params: { q: query }
    },
    {
      url: 'https://flipkart-product-search.p.rapidapi.com/search',
      host: 'flipkart-product-search.p.rapidapi.com',
      params: { query: query }
    }
  ];
  
  for (const api of apis) {
    try {
      const response = await axios.get(api.url, {
        params: api.params,
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': api.host
        },
        timeout: 10000
      });
      
      const products = response.data.products || response.data.data || [];
      
      if (products.length > 0) {
        return products.slice(0, 5).map(product => ({
          platform: 'Flipkart',
          product_id: product.id || product.pid || Math.random().toString(36),
          title: product.title || product.name || product.product_name,
          price: parseFloat(String(product.price || product.current_price || 0).replace(/[₹,$,]/g, '')),
          originalPrice: parseFloat(String(product.original_price || product.mrp || product.price || 0).replace(/[₹,$,]/g, '')),
          rating: parseFloat(product.rating || product.ratings || 0),
          reviews: parseInt(product.reviews || product.review_count || 0),
          image: product.image || product.thumbnail || product.images?.[0],
          url: product.link || product.url || `https://flipkart.com${product.href}`,
          delivery: product.delivery_info || 'Free delivery',
          stock: product.availability || 'In Stock',
          seller: 'Flipkart'
        }));
      }
    } catch (error) {
      console.log(`Flipkart API ${api.host} failed:`, error.message);
      continue;
    }
  }
  
  return [];
}

// Myntra scraper
async function scrapeMyntra(query) {
  if (!process.env.RAPIDAPI_KEY || process.env.RAPIDAPI_KEY === 'your_rapidapi_key_here') {
    return [];
  }
  
  try {
    const response = await axios.get('https://myntra-data-scraper.p.rapidapi.com/search', {
      params: { query: query },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'myntra-data-scraper.p.rapidapi.com'
      },
      timeout: 10000
    });
    
    const products = response.data.products || [];
    
    return products.slice(0, 3).map(product => ({
      platform: 'Myntra',
      product_id: product.id || Math.random().toString(36),
      title: product.title || product.name,
      price: parseFloat(String(product.price || 0).replace(/[₹,$,]/g, '')),
      originalPrice: parseFloat(String(product.mrp || product.original_price || product.price || 0).replace(/[₹,$,]/g, '')),
      rating: parseFloat(product.rating || 0),
      reviews: parseInt(product.reviews || 0),
      image: product.image || product.images?.[0],
      url: product.url || `https://myntra.com/${product.id}`,
      delivery: 'Free delivery',
      stock: 'In Stock',
      seller: 'Myntra'
    }));
  } catch (error) {
    console.log('Myntra API failed:', error.message);
    return [];
  }
}

// Snapdeal scraper
async function scrapeSnapdeal(query) {
  if (!process.env.RAPIDAPI_KEY || process.env.RAPIDAPI_KEY === 'your_rapidapi_key_here') {
    return [];
  }
  
  try {
    const response = await axios.get('https://snapdeal-scraper.p.rapidapi.com/search', {
      params: { query: query },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'snapdeal-scraper.p.rapidapi.com'
      },
      timeout: 10000
    });
    
    const products = response.data.products || [];
    
    return products.slice(0, 3).map(product => ({
      platform: 'Snapdeal',
      product_id: product.id || Math.random().toString(36),
      title: product.title || product.name,
      price: parseFloat(String(product.price || 0).replace(/[₹,$,]/g, '')),
      originalPrice: parseFloat(String(product.mrp || product.original_price || product.price || 0).replace(/[₹,$,]/g, '')),
      rating: parseFloat(product.rating || 0),
      reviews: parseInt(product.reviews || 0),
      image: product.image,
      url: product.url,
      delivery: 'Free delivery',
      stock: 'In Stock',
      seller: 'Snapdeal'
    }));
  } catch (error) {
    console.log('Snapdeal API failed:', error.message);
    return [];
  }
}

// Fallback mock data when APIs fail
function getMockData(query) {
  const mockProducts = {
    'iphone': [
      {
        platform: 'Amazon',
        product_id: 'B0CHX1W1XY',
        title: 'Apple iPhone 15 Pro Max 256GB',
        price: 134900,
        originalPrice: 159900,
        rating: 4.5,
        reviews: 2847,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        url: 'https://amazon.in/iphone15',
        delivery: 'Free delivery',
        stock: 'In Stock',
        seller: 'Amazon'
      },
      {
        platform: 'Flipkart',
        product_id: 'MOBGTAGPTB3VS24W',
        title: 'Apple iPhone 15 Pro Max 256GB',
        price: 132999,
        originalPrice: 159900,
        rating: 4.4,
        reviews: 1923,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        url: 'https://flipkart.com/iphone15',
        delivery: 'Free delivery',
        stock: 'In Stock',
        seller: 'Flipkart'
      },
      {
        platform: 'Myntra',
        product_id: 'MYN123456',
        title: 'Apple iPhone 15 Pro Max 256GB',
        price: 136500,
        originalPrice: 159900,
        rating: 4.3,
        reviews: 856,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        url: 'https://myntra.com/iphone15',
        delivery: 'Free delivery in 2 days',
        stock: 'Limited Stock',
        seller: 'Myntra'
      }
    ],
    'laptop': [
      {
        platform: 'Amazon',
        product_id: 'B0B3C99CLL',
        title: 'MacBook Air M2 13-inch 256GB',
        price: 114900,
        originalPrice: 119900,
        rating: 4.6,
        reviews: 1234,
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
        url: 'https://amazon.in/macbook',
        delivery: 'Free delivery',
        stock: 'In Stock',
        seller: 'Amazon'
      },
      {
        platform: 'Flipkart',
        product_id: 'COMG6NGG4MVNBQHG',
        title: 'MacBook Air M2 13-inch 256GB',
        price: 116500,
        originalPrice: 119900,
        rating: 4.5,
        reviews: 987,
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
        url: 'https://flipkart.com/macbook',
        delivery: 'Free delivery',
        stock: 'In Stock',
        seller: 'Flipkart'
      },
      {
        platform: 'Amazon',
        product_id: 'B0BSHF7LLL',
        title: 'Dell XPS 13 Plus Intel i7 16GB',
        price: 89990,
        originalPrice: 109990,
        rating: 4.3,
        reviews: 567,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        url: 'https://amazon.in/dell-xps',
        delivery: 'Free delivery',
        stock: 'In Stock',
        seller: 'Amazon'
      }
    ],
    'headphones': [
      {
        platform: 'Amazon',
        product_id: 'B08PZHYWJS',
        title: 'Sony WH-1000XM4 Wireless Headphones',
        price: 24990,
        originalPrice: 29990,
        rating: 4.4,
        reviews: 8934,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        url: 'https://amazon.in/sony-headphones',
        delivery: 'Free delivery',
        stock: 'In Stock',
        seller: 'Amazon'
      },
      {
        platform: 'Flipkart',
        product_id: 'ACCGPD7H9MZQZG8Z',
        title: 'Sony WH-1000XM4 Wireless Headphones',
        price: 23999,
        originalPrice: 29990,
        rating: 4.3,
        reviews: 5678,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        url: 'https://flipkart.com/sony-headphones',
        delivery: 'Free delivery',
        stock: 'In Stock',
        seller: 'Flipkart'
      },
      {
        platform: 'Amazon',
        product_id: 'B085RJM8Q4',
        title: 'Apple AirPods Pro (2nd Gen)',
        price: 21900,
        originalPrice: 24900,
        rating: 4.6,
        reviews: 12456,
        image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400',
        url: 'https://amazon.in/airpods-pro',
        delivery: 'Free delivery',
        stock: 'In Stock',
        seller: 'Amazon'
      }
    ],
    'watch': [
      {
        platform: 'Amazon',
        product_id: 'B0BDHB9Y8P',
        title: 'Apple Watch Series 9 GPS 45mm',
        price: 42900,
        originalPrice: 45900,
        rating: 4.5,
        reviews: 3456,
        image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400',
        url: 'https://amazon.in/apple-watch',
        delivery: 'Free delivery',
        stock: 'In Stock',
        seller: 'Amazon'
      },
      {
        platform: 'Flipkart',
        product_id: 'SMWGPQGPQGPQGPQG',
        title: 'Apple Watch Series 9 GPS 45mm',
        price: 41999,
        originalPrice: 45900,
        rating: 4.4,
        reviews: 2134,
        image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400',
        url: 'https://flipkart.com/apple-watch',
        delivery: 'Free delivery',
        stock: 'In Stock',
        seller: 'Flipkart'
      }
    ],
    'tablet': [
      {
        platform: 'Amazon',
        product_id: 'B0BJLXMQHD',
        title: 'iPad Air 5th Gen 64GB WiFi',
        price: 54900,
        originalPrice: 59900,
        rating: 4.7,
        reviews: 1876,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
        url: 'https://amazon.in/ipad-air',
        delivery: 'Free delivery',
        stock: 'In Stock',
        seller: 'Amazon'
      },
      {
        platform: 'Flipkart',
        product_id: 'TABGPQGPQGPQGPQG',
        title: 'iPad Air 5th Gen 64GB WiFi',
        price: 53999,
        originalPrice: 59900,
        rating: 4.6,
        reviews: 1234,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
        url: 'https://flipkart.com/ipad-air',
        delivery: 'Free delivery',
        stock: 'In Stock',
        seller: 'Flipkart'
      }
    ],
    'camera': [
      {
        platform: 'Amazon',
        product_id: 'B08Y5KMLEK',
        title: 'Canon EOS R6 Mark II Body',
        price: 189900,
        originalPrice: 209900,
        rating: 4.8,
        reviews: 456,
        image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400',
        url: 'https://amazon.in/canon-r6',
        delivery: 'Free delivery',
        stock: 'In Stock',
        seller: 'Amazon'
      },
      {
        platform: 'Flipkart',
        product_id: 'CAMGPQGPQGPQGPQG',
        title: 'Canon EOS R6 Mark II Body',
        price: 187999,
        originalPrice: 209900,
        rating: 4.7,
        reviews: 234,
        image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400',
        url: 'https://flipkart.com/canon-r6',
        delivery: 'Free delivery',
        stock: 'In Stock',
        seller: 'Flipkart'
      }
    ]
  };

  const key = Object.keys(mockProducts).find(k => query.toLowerCase().includes(k));
  return mockProducts[key] || [];
}

// Master scraper function
async function scrapeAllPlatforms(query) {
  console.log(`Scraping all platforms for: ${query}`);
  
  const scrapers = [
    scrapeAmazon(query),
    scrapeFlipkart(query),
    scrapeMyntra(query),
    scrapeSnapdeal(query)
  ];
  
  const results = await Promise.allSettled(scrapers);
  
  let allProducts = [];
  results.forEach((result, index) => {
    const platforms = ['Amazon', 'Flipkart', 'Myntra', 'Snapdeal'];
    if (result.status === 'fulfilled' && result.value.length > 0) {
      console.log(`${platforms[index]}: Found ${result.value.length} products`);
      allProducts = allProducts.concat(result.value);
    } else {
      console.log(`${platforms[index]}: No products found`);
    }
  });
  
  return allProducts;
}

module.exports = { scrapeAmazon, scrapeFlipkart, scrapeMyntra, scrapeSnapdeal, scrapeAllPlatforms, getMockData };