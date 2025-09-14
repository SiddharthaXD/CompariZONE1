const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

let supabase = null;

// Only initialize Supabase if credentials are provided
if (process.env.SUPABASE_URL && process.env.SUPABASE_URL !== 'your_supabase_url_here') {
  try {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
  } catch (error) {
    console.log('Supabase not configured, using mock data only');
  }
}

// Save search query
async function saveSearch(query, results) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('searches')
      .insert([
        {
          query: query,
          results_count: results.length,
          timestamp: new Date().toISOString()
        }
      ]);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving search:', error);
  }
}

// Save product data
async function saveProduct(product) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('products')
      .upsert([product], { onConflict: 'platform,product_id' });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving product:', error);
  }
}

// Get cached products
async function getCachedProducts(query) {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('title', `%${query}%`)
      .gte('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting cached products:', error);
    return [];
  }
}

module.exports = { saveSearch, saveProduct, getCachedProducts };