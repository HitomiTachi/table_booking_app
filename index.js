const express = require('express');
const mongoose = require('./db');
const helpers = require('./routes/helpers');

const app = express();
app.use(express.json());

// Route kiểm tra server
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Lấy danh sách tables theo owner
app.get('/tables/:ownerId', async (req, res) => {
  const tables = await helpers.getTablesByOwner(req.params.ownerId);
  res.json(tables);
});

// Lấy booking theo user (customer hoặc owner)
app.get('/bookings/:userId/:role', async (req, res) => {
  const bookings = await helpers.getBookingsByUser(req.params.userId, req.params.role);
  res.json(bookings);
});

// Cập nhật trạng thái booking
app.put('/booking/:bookingId/status', async (req, res) => {
  const booking = await helpers.updateBookingStatus(req.params.bookingId, req.body.status);
  res.json(booking);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
