const express = require('express');
require('./db');

const userRoutes = require('./routes/userRoutes');
const tableRoutes = require('./routes/tableRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const historyRoutes = require('./routes/historyRoutes');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Table Booking API is running');
});

app.use('/api/users', userRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/history', historyRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Có lỗi xảy ra, vui lòng thử lại sau',
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
