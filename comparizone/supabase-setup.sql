-- Create products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  platform VARCHAR(50) NOT NULL,
  product_id VARCHAR(100) NOT NULL,
  title TEXT NOT NULL,
  price DECIMAL(10,2),
  original_price DECIMAL(10,2),
  rating DECIMAL(3,2),
  reviews INTEGER,
  image TEXT,
  url TEXT,
  delivery VARCHAR(100),
  stock VARCHAR(50),
  seller VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(platform, product_id)
);

-- Create searches table
CREATE TABLE searches (
  id SERIAL PRIMARY KEY,
  query VARCHAR(255) NOT NULL,
  results_count INTEGER DEFAULT 0,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_platform ON products(platform);
CREATE INDEX idx_products_title ON products USING gin(to_tsvector('english', title));
CREATE INDEX idx_products_updated_at ON products(updated_at);
CREATE INDEX idx_searches_timestamp ON searches(timestamp);