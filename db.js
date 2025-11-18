const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/table_booking_app';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Kết nối MongoDB thành công!'))
.catch((err) => console.error('Kết nối MongoDB thất bại:', err));

module.exports = mongoose;
