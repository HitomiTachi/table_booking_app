const express = require('express');
const Booking = require('../src/model/Booking');
const asyncHandler = require('../src/utils/asyncHandler');
const logAction = require('../src/utils/logAction');
const { auth, authorize } = require('../src/middleware/auth');

const router = express.Router();
router.use(auth);

function canModifyBooking(user, booking) {
  if (!user || !booking) {
    return false;
  }
  if (user.role === 'admin' || user.role === 'staff') {
    return true;
  }
  if (user.role === 'customer') {
    return booking.userId?.toString() === user._id.toString();
  }
  return false;
}

router.get(
  '/',
  authorize('admin', 'owner', 'staff', 'customer'),
  asyncHandler(async (req, res) => {
    const { userId, role, ownerId, status } = req.query;
    const filter = {};

    if (req.user.role === 'customer') {
      filter.userId = req.user._id;
    } else if (req.user.role === 'owner') {
      filter.ownerId = req.user._id;
    } else {
      if (role === 'customer' && userId) {
        filter.userId = userId;
      } else if (role === 'owner' && userId) {
        filter.ownerId = userId;
      }
      if (ownerId) {
        filter.ownerId = ownerId;
      }
    }

    if (status) {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate('userId')
      .populate('ownerId')
      .populate('tableId')
      .populate('serviceId');
    res.json(bookings);
  })
);

router.post(
  '/',
  authorize('admin', 'staff', 'customer'),
  asyncHandler(async (req, res) => {
    const payload = { ...req.body };
    if (req.user.role === 'customer') {
      payload.userId = req.user._id;
    }
    if (!payload.userId || !payload.ownerId || !payload.tableId || !payload.serviceId) {
      return res.status(400).json({ message: 'Thiếu thông tin booking bắt buộc' });
    }

    const booking = await Booking.create(payload);
    await logAction(req.user._id, 'CREATE_BOOKING', booking._id.toString());
    res.status(201).json(booking);
  })
);

router.put(
  '/:id',
  authorize('admin', 'staff', 'customer'),
  asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking không tồn tại' });
    }

    if (!canModifyBooking(req.user, booking)) {
      return res.status(403).json({ message: 'Không có quyền cập nhật booking này' });
    }

    Object.assign(booking, req.body);
    await booking.save();

    await logAction(req.user._id, 'UPDATE_BOOKING', booking._id.toString());
    res.json(booking);
  })
);

router.patch(
  '/:id/status',
  authorize('admin', 'staff', 'customer'),
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Thiếu status mới' });
    }
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking không tồn tại' });
    }

    if (!canModifyBooking(req.user, booking)) {
      return res.status(403).json({ message: 'Không có quyền cập nhật booking này' });
    }

    booking.status = status;
    await booking.save();

    await logAction(req.user._id, 'UPDATE_BOOKING_STATUS', booking._id.toString());
    res.json(booking);
  })
);

router.patch(
  '/:id/cancel',
  authorize('admin', 'staff', 'customer'),
  asyncHandler(async (req, res) => {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking không tồn tại' });
    }

    if (!canModifyBooking(req.user, booking)) {
      return res.status(403).json({ message: 'Không có quyền hủy booking này' });
    }

    booking.status = 'cancelled';
    await booking.save();

    await logAction(
      req.user._id,
      `CANCEL_BOOKING${reason ? `_${reason}` : ''}`,
      booking._id.toString()
    );
    res.json(booking);
  })
);

module.exports = router;

