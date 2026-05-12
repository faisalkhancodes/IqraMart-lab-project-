const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    // Try local MongoDB first
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/amazon_clone';
    
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      await seedProducts();
      await seedAdmin();
      return;
    } catch (localErr) {
      console.log('Local MongoDB not available, starting in-memory server...');
    }

    // Fallback to in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const memUri = mongoServer.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
    console.log('⚠️  Data will be lost when server restarts (using in-memory DB)');
    
    // Auto-seed products when using in-memory DB
    await seedProducts();
    await seedAdmin();
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

async function seedProducts() {
  const Product = require('../models/Product');
  const count = await Product.countDocuments();
  if (count > 0) return;

  const products = [
    { name: 'Apple MacBook Pro 14" M3', description: 'Supercharged by Apple M3 chip. 14-inch Liquid Retina XDR display, 18-hour battery life, 18GB unified memory, 512GB SSD.', price: 1999.99, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', stock: 25, rating: 4.9, numReviews: 842 },
    { name: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise canceling headphones with crystal clear hands-free calling and up to 30-hour battery life.', price: 279.99, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', stock: 60, rating: 4.8, numReviews: 2341 },
    { name: 'Nike Air Max 270', description: 'Features Nike\'s biggest heel Air unit yet for a super-soft ride with bold look and max comfort.', price: 149.99, category: 'Footwear', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', stock: 120, rating: 4.6, numReviews: 5678 },
    { name: 'Instant Pot Duo 7-in-1', description: 'Pressure Cooker, Slow Cooker, Rice Cooker, Steamer, Sauté, Yogurt Maker & Warmer. 6 Quart capacity.', price: 79.99, category: 'Kitchen', imageUrl: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400', stock: 80, rating: 4.7, numReviews: 12340 },
    { name: 'The Midnight Library', description: 'A dazzling novel about the choices that go into a life well lived. Between life and death there is a library.', price: 14.99, category: 'Books', imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', stock: 200, rating: 4.5, numReviews: 89234 },
    { name: 'Samsung 65" QLED 4K TV', description: 'Quantum HDR, 100% Color Volume with Quantum Dot, Motion Xcelerator Turbo+, Object Tracking Sound+.', price: 1299.99, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400', stock: 15, rating: 4.7, numReviews: 3421 },
    { name: 'Levi\'s 501 Original Jeans', description: 'The original jean since 1873. Straight fit with button fly. Sits at the waist.', price: 59.99, category: 'Clothing', imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', stock: 300, rating: 4.4, numReviews: 45678 },
    { name: 'Dyson V15 Detect Vacuum', description: 'Laser Slim Fluffy cleaner head detects hidden dust on hard floors. Advanced HEPA filtration.', price: 599.99, category: 'Home', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', stock: 30, rating: 4.8, numReviews: 7823 },
    { name: 'LEGO Technic Bugatti Chiron', description: 'A masterpiece of engineering. 3,599 pieces. Authentic details. 1:8 scale model.', price: 299.99, category: 'Toys', imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400', stock: 45, rating: 4.9, numReviews: 2345 },
    { name: 'Kindle Paperwhite 11th Gen', description: '6.8" display with adjustable warm light. Waterproof. 10-week battery life. 8GB storage.', price: 139.99, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400', stock: 90, rating: 4.7, numReviews: 34567 },
    { name: 'Yoga Mat Premium Non-Slip', description: 'Eco-friendly TPE material. Extra thick 6mm for joint protection. Includes carry strap.', price: 39.99, category: 'Sports', imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400', stock: 150, rating: 4.5, numReviews: 8921 },
    { name: 'Nespresso Vertuo Coffee Machine', description: 'One-touch coffee and espresso machine. Brews 5 cup sizes. Centrifusion technology.', price: 199.99, category: 'Kitchen', imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400', stock: 55, rating: 4.6, numReviews: 15432 },
    { name: 'Logitech MX Master 3S Wireless Mouse', description: 'Advanced wireless mouse with ultrafast scrolling, ergonomic design, and customizable buttons.', price: 99.99, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', stock: 100, rating: 4.8, numReviews: 5432 },
    { name: 'YETI Rambler 20 oz Tumbler', description: 'Stainless steel, vacuum insulated tumbler with MagSlider lid. Keeps drinks hot or cold for hours.', price: 35.00, category: 'Home', imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400', stock: 250, rating: 4.9, numReviews: 32104 },
    { name: 'Adidas Ultraboost 22 Running Shoes', description: 'Incredible energy return with Boost cushioning. Primeknit upper for a comfortable, sock-like fit.', price: 190.00, category: 'Footwear', imageUrl: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=400', stock: 75, rating: 4.7, numReviews: 8765 },
    { name: 'Anker PowerCore 10000 Portable Charger', description: 'One of the smallest and lightest 10000mAh external batteries. Provides high-speed charging.', price: 25.99, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', stock: 500, rating: 4.6, numReviews: 98765 },
    { name: 'Catan Board Game', description: 'The classic strategy game where players collect resources and build settlements on the island of Catan.', price: 49.99, category: 'Toys', imageUrl: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=400', stock: 120, rating: 4.8, numReviews: 14532 },
    { name: 'Hydro Flask Standard Mouth Water Bottle', description: 'TempShield double-wall vacuum insulation keeps beverages cold up to 24 hours and hot up to 12 hours.', price: 34.95, category: 'Sports', imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', stock: 180, rating: 4.7, numReviews: 21345 },
    { name: 'Apple iPad Air (5th Generation)', description: '10.9-inch Liquid Retina display, Apple M1 chip, 64GB storage, 12MP front/back cameras.', price: 599.00, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', stock: 45, rating: 4.9, numReviews: 12040 },
    { name: 'Ninja Professional Blender', description: '72 oz total crushing pitcher pulverizes ice to snow in seconds for creamy frozen drinks and smoothies.', price: 89.99, category: 'Kitchen', imageUrl: 'https://images.unsplash.com/photo-1585237405615-28eb5047b9ce?w=400', stock: 85, rating: 4.6, numReviews: 8920 },
    { name: 'Atomic Habits by James Clear', description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. Over 10 million copies sold.', price: 11.98, category: 'Books', imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400', stock: 400, rating: 4.8, numReviews: 105000 },
    { name: 'Bose QuietComfort 45 Bluetooth Wireless', description: 'Noise Cancelling Headphones - Over-ear headphones with premium sound and 24-hour battery life.', price: 329.00, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400', stock: 110, rating: 4.7, numReviews: 15300 },
    { name: 'Ray-Ban Classic Aviator Sunglasses', description: 'Polarized sunglasses originally designed for U.S. aviators. 100% UV protection.', price: 161.00, category: 'Clothing', imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400', stock: 65, rating: 4.5, numReviews: 6720 },
    { name: 'Spalding NBA Official Indoor/Outdoor Basketball', description: 'Premium composite cover with excellent grip. Official size 7 (29.5").', price: 39.99, category: 'Sports', imageUrl: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=400', stock: 120, rating: 4.6, numReviews: 8100 }
  ];

  await Product.insertMany(products);
  console.log(`✅ Seeded ${products.length} products`);
}

async function seedAdmin() {
  const User = require('../models/User');
  const bcrypt = require('bcryptjs');
  const count = await User.countDocuments({ role: 'admin' });
  if (count > 0) return;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);
  await User.create({ name: 'Admin User', email: 'admin@iqramart.com', password: hashedPassword, role: 'admin' });
  console.log('✅ Admin user created: admin@iqramart.com / admin123');
}

module.exports = connectDB;
