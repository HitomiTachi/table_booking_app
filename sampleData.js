// Dùng để insert dữ liệu mẫu vào MongoDB
const mongoose = require('./db');
const User = require('./models/User');
const Table = require('./models/Table');
const Service = require('./models/Service');
const Booking = require('./models/Booking');

// 1. Dữ liệu mẫu Users
const users = [
  { name: 'Admin', email: 'admin@example.com', password: '123456', role: 'admin' },
  { name: 'Owner1', email: 'owner1@example.com', password: '123456', role: 'owner' },
  { name: 'Staff1', email: 'staff1@example.com', password: '123456', role: 'staff' },
  { name: 'Customer1', email: 'customer1@example.com', password: '123456', role: 'customer' },
  // Thêm các user khác...
];

// 2. Dữ liệu mẫu Tables
const tables = [
  { status: 'available', capacity: 4, location: 'A1' },
  { status: 'reserved', capacity: 2, location: 'B1' },
  // Thêm các table khác...
];

// 3. Dữ liệu mẫu Services
const services = [
  { name: 'Trà sữa', duration: 30, price: 30000, status: 'active' },
  { name: 'Cà phê', duration: 20, price: 25000, status: 'active' },
  // Thêm các service khác...
];

// 4. Insert dữ liệu
async function insertSampleData() {
  try {
    await User.insertMany(users);
    await Table.insertMany(tables);
    await Service.insertMany(services);
    console.log('Đã insert dữ liệu mẫu thành công!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Lỗi insert dữ liệu mẫu:', err);
  }
}

insertSampleData();