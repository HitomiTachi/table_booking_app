const Table = require('../src/model/Table');
const Booking = require('../src/model/Booking');

// Lấy danh sách tables theo owner
async function getTablesByOwner(ownerId) {
  return await Table.find({ ownerId });
}

// Lấy booking theo customer hoặc owner
async function getBookingsByUser(userId, role) {
  if (role === 'customer') {
    return await Booking.find({ userId });
  } else if (role === 'owner') {
    return await Booking.find({ ownerId: userId });
  }
  return [];
}

// Cập nhật trạng thái booking
async function updateBookingStatus(bookingId, status) {
  return await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });
}

module.exports = {
  getTablesByOwner,
  getBookingsByUser,
  updateBookingStatus,
};
