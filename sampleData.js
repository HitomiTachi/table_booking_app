// Dùng để insert dữ liệu mẫu vào MongoDB
const mongoose = require('./db');
const User = require('./src/model/User');
const Table = require('./src/model/Table');
const Service = require('./src/model/Service');
const Booking = require('./src/model/Booking');

async function insertSampleData() {
  try {
    await Promise.all([
      User.deleteMany({}),
      Table.deleteMany({}),
      Service.deleteMany({}),
      Booking.deleteMany({}),
    ]);

    const users = await User.insertMany([
      { name: 'Admin', email: 'admin@example.com', password: '123456', role: 'admin' },
      { name: 'Owner1', email: 'owner1@example.com', password: '123456', role: 'owner' },
      { name: 'Staff1', email: 'staff1@example.com', password: '123456', role: 'staff' },
      { name: 'Customer1', email: 'customer1@example.com', password: '123456', role: 'customer' },
    ]);

    const owner = users.find((u) => u.role === 'owner');
    const customer = users.find((u) => u.role === 'customer');

    const tables = await Table.insertMany([
      { status: 'available', capacity: 4, location: 'A1', ownerId: owner._id },
      { status: 'reserved', capacity: 2, location: 'B1', ownerId: owner._id },
    ]);

    const services = await Service.insertMany([
      { name: 'Trà sữa', duration: 30, price: 30000, status: 'active', ownerId: owner._id },
      { name: 'Cà phê', duration: 20, price: 25000, status: 'active', ownerId: owner._id },
    ]);

    await Booking.insertMany([
      {
        userId: customer._id,
        ownerId: owner._id,
        tableId: tables[0]._id,
        serviceId: services[0]._id,
        time: new Date(),
        status: 'pending',
      },
    ]);

    console.log('Đã làm sạch và insert dữ liệu mẫu thành công!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Lỗi insert dữ liệu mẫu:', err);
    mongoose.connection.close();
  }
}

insertSampleData();