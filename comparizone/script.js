// Sample product data for demonstration
const sampleProducts = [
    {
        id: 1,
        title: "Apple iPhone 15 Pro Max 256GB",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
        platform: "Amazon",
        price: 134900,
        originalPrice: 159900,
        discount: 16,
        rating: 4.5,
        reviews: 2847,
        delivery: "Free delivery",
        stock: "In Stock",
        seller: "Apple Store"
    },
    {
        id: 2,
        title: "Apple iPhone 15 Pro Max 256GB",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
        platform: "Flipkart",
        price: 132999,
        originalPrice: 159900,
        discount: 17,
        rating: 4.4,
        reviews: 1923,
        delivery: "Free delivery",
        stock: "In Stock",
        seller: "Flipkart"
    },
    {
        id: 3,
        title: "Apple iPhone 15 Pro Max 256GB",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
        platform: "Myntra",
        price: 136500,
        originalPrice: 159900,
        discount: 15,
        rating: 4.3,
        reviews: 856,
        delivery: "Free delivery in 2 days",
        stock: "Limited Stock",
        seller: "Myntra Fashion"
    }
];

const specifications = {
    "Display": ["6.7-inch Super Retina XDR", "6.7-inch Super Retina XDR", "6.7-inch Super Retina XDR"],
    "Processor": ["A17 Pro chip", "A17 Pro chip", "A17 Pro chip"],
    "Storage": ["256GB", "256GB", "256GB"],
    "Camera": ["48MP Main + 12MP Ultra Wide", "48MP Main + 12MP Ultra Wide", "48MP Main + 12MP Ultra Wide"],
    "Battery": ["Up to 29 hours video", "Up to 29 hours video", "Up to 29 hours video"],
    "OS": ["iOS 17", "iOS 17", "iOS 17"]
};

// DOM Elements
const compareBtn = document.getElementById('compareBtn');
const productSearch = document.getElementById('productSearch');
const productUrl = document.getElementById('productUrl');
const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');
const productsGrid = document.getElementById('productsGrid');
const specsTable = document.getElementById('specsTable');
const filterBtns = document.querySelectorAll('.filter-btn');
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenu = document.getElementById('mobileMenu');

// Navigation functionality
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Smooth scroll to section
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle
mobileMenu.addEventListener('click', () => {
    const navLinksContainer = document.querySelector('.nav-links');
    navLinksContainer.classList.toggle('active');
});

// Compare button functionality
compareBtn.addEventListener('click', async () => {
    const searchValue = productSearch.value.trim();
    const urlValue = productUrl.value.trim();
    
    if (!searchValue && !urlValue) {
        alert('Please enter a product name or paste a product URL');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch('/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: searchValue,
                url: urlValue
            })
        });
        
        const data = await response.json();
        hideLoading();
        
        if (data.products && data.products.length > 0) {
            showResults(data.products);
        } else {
            alert('No products found. Try searching for "iPhone 15" or "laptop"');
        }
    } catch (error) {
        hideLoading();
        alert('Error searching products. Please try again.');
    }
});

// Enter key functionality for search inputs
productSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        compareBtn.click();
    }
});

productUrl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        compareBtn.click();
    }
});

// Filter functionality
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Apply filter
        const filter = btn.dataset.filter;
        applyFilter(filter);
    });
});

// Show loading state
function showLoading() {
    loadingSection.style.display = 'block';
    resultsSection.style.display = 'none';
    
    // Scroll to loading section
    loadingSection.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// Hide loading state
function hideLoading() {
    loadingSection.style.display = 'none';
}

// Show results
function showResults(products = sampleProducts) {
    resultsSection.style.display = 'block';
    renderProducts(products);
    renderSpecifications(products);
    
    // Scroll to results
    resultsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    
    // Animate product cards
    setTimeout(() => {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.6s ease-out';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            }, index * 200);
        });
    }, 100);
}

// Render products
function renderProducts(products) {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-platform="${product.platform.toLowerCase()}" data-price="${product.price}" data-rating="${product.rating}">
            <div class="platform-badge">${product.platform}</div>
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-price">
                ₹${product.price.toLocaleString()}
                <span class="product-original-price">₹${product.originalPrice.toLocaleString()}</span>
                <span class="product-discount">${product.discount}% off</span>
            </div>
            <div class="product-rating">
                <div class="stars">
                    ${generateStars(product.rating)}
                </div>
                <span>${product.rating} (${product.reviews.toLocaleString()} reviews)</span>
            </div>
            <div class="product-details">
                <div class="detail-item">
                    <span>Delivery:</span>
                    <span>${product.delivery}</span>
                </div>
                <div class="detail-item">
                    <span>Stock:</span>
                    <span>${product.stock}</span>
                </div>
                <div class="detail-item">
                    <span>Seller:</span>
                    <span>${product.seller}</span>
                </div>
            </div>
            <button class="buy-btn" onclick="buyProduct('${product.platform}', ${product.id})">
                <i class="fas fa-shopping-cart"></i>
                Buy on ${product.platform}
            </button>
        </div>
    `).join('');
}

// Generate star rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Render specifications table
function renderSpecifications() {
    const platforms = ['Amazon', 'Flipkart', 'Myntra'];
    
    let tableHTML = `
        <thead>
            <tr>
                <th>Specification</th>
                ${platforms.map(platform => `<th>${platform}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
    `;
    
    Object.entries(specifications).forEach(([spec, values]) => {
        tableHTML += `
            <tr>
                <td><strong>${spec}</strong></td>
                ${values.map(value => `<td>${value}</td>`).join('')}
            </tr>
        `;
    });
    
    tableHTML += '</tbody>';
    specsTable.innerHTML = tableHTML;
}

// Apply filters
function applyFilter(filter) {
    const productCards = document.querySelectorAll('.product-card');
    let sortedProducts = [...sampleProducts];
    
    switch (filter) {
        case 'price':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'rating':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'delivery':
            sortedProducts.sort((a, b) => {
                const aFree = a.delivery.includes('Free');
                const bFree = b.delivery.includes('Free');
                return bFree - aFree;
            });
            break;
        default:
            // 'all' - keep original order
            break;
    }
    
    renderProducts(sortedProducts);
}

// Buy product function
function buyProduct(platform, productId) {
    // Simulate redirect to platform
    alert(`Redirecting to ${platform} to complete your purchase...`);
    
    // In a real application, this would redirect to the actual product page
    // window.open(productUrl, '_blank');
}

// Contact form submission
document.querySelector('.contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    const formData = new FormData(e.target);
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: e.target.querySelector('input[type="text"]').value,
                email: e.target.querySelector('input[type="email"]').value,
                message: e.target.querySelector('textarea').value
            })
        });
        
        const data = await response.json();
        alert(data.message);
        e.target.reset();
    } catch (error) {
        alert('Error sending message. Please try again.');
    }
    
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(10, 10, 10, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'rgba(10, 10, 10, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const heroBackground = document.querySelector('.hero-bg');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${rate}px)`;
    }
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.step-card, .feature-card, .contact-content');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});

// Add loading animation to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
        if (!this.classList.contains('loading')) {
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 300);
        }
    });
});

// Add CSS for button loading animation
const style = document.createElement('style');
style.textContent = `
    .loading {
        position: relative;
        pointer-events: none;
    }
    
    .loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);