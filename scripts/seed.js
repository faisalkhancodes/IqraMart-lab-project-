require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const products = [
  {
    name: 'Apple MacBook Pro 14" M3',
    description: 'Supercharged by Apple M3 chip. 14-inch Liquid Retina XDR display, 18-hour battery life, 18GB unified memory, 512GB SSD.',
    price: 1999.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    stock: 25,
    rating: 4.9,
    numReviews: 842
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling headphones with Auto Noise Canceling Optimizer, crystal clear hands-free calling, and up to 30-hour battery life.',
    price: 279.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    stock: 60,
    rating: 4.8,
    numReviews: 2341
  },
  {
    name: 'Nike Air Max 270',
    description: 'The Nike Air Max 270 features Nike\'s biggest heel Air unit yet for a super-soft ride. With a bold look and max comfort.',
    price: 149.99,
    category: 'Footwear',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    stock: 120,
    rating: 4.6,
    numReviews: 5678
  },
  {
    name: 'Instant Pot Duo 7-in-1',
    description: 'Pressure Cooker, Slow Cooker, Rice Cooker, Steamer, Sauté, Yogurt Maker & Warmer. 6 Quart capacity.',
    price: 79.99,
    category: 'Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400',
    stock: 80,
    rating: 4.7,
    numReviews: 12340
  },
  {
    name: 'The Midnight Library',
    description: 'A dazzling novel about the choices that go into a life well lived. Between life and death there is a library, and within that library, the shelves go on forever.',
    price: 14.99,
    category: 'Books',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    stock: 200,
    rating: 4.5,
    numReviews: 89234
  },
  {
    name: 'Samsung 65" QLED 4K TV',
    description: 'Quantum HDR, 100% Color Volume with Quantum Dot, Motion Xcelerator Turbo+, Object Tracking Sound+, OTS+.',
    price: 1299.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400',
    stock: 15,
    rating: 4.7,
    numReviews: 3421
  },
  {
    name: 'Levi\'s 501 Original Jeans',
    description: 'The original jean since 1873. Straight fit with button fly. Sits at the waist, straight through hips and thighs.',
    price: 59.99,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    stock: 300,
    rating: 4.4,
    numReviews: 45678
  },
  {
    name: 'Dyson V15 Detect Vacuum',
    description: 'Laser Slim Fluffy cleaner head detects hidden dust on hard floors. Advanced HEPA filtration captures allergens.',
    price: 599.99,
    category: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    stock: 30,
    rating: 4.8,
    numReviews: 7823
  },
  {
    name: 'LEGO Technic Bugatti Chiron',
    description: 'A masterpiece of LEGO Technic engineering. 3,599 pieces. Authentic details. 1:8 scale model.',
    price: 299.99,
    category: 'Toys',
    imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400',
    stock: 45,
    rating: 4.9,
    numReviews: 2345
  },
  {
    name: 'Kindle Paperwhite 11th Gen',
    description: '6.8" display with adjustable warm light. Waterproof with 10-week battery life. Now with 8GB storage.',
    price: 139.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400',
    stock: 90,
    rating: 4.7,
    numReviews: 34567
  },
  {
    name: 'Yoga Mat Premium Non-Slip',
    description: 'Eco-friendly TPE material. Extra thick 6mm for joint protection. Double-sided non-slip. Includes carry strap.',
    price: 39.99,
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1601925228008-8a49a5b82e15?w=400',
    stock: 150,
    rating: 4.5,
    numReviews: 8921
  },
  {
    name: 'Nespresso Vertuo Coffee Machine',
    description: 'One-touch coffee and espresso machine. Brews 5 different cup sizes. Centrifusion technology.',
    price: 199.99,
    category: 'Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
    stock: 55,
    rating: 4.6,
    numReviews: 15432
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    await Product.deleteMany({});
    console.log('Cleared existing products...');

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
