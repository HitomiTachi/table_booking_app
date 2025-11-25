const express = require('express');
const User = require('../src/model/User');
const asyncHandler = require('../src/utils/asyncHandler');
const logAction = require('../src/utils/logAction');
const { auth, authorize } = require('../src/middleware/auth');

const router = express.Router();

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Thiếu email hoặc password' });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Thông tin đăng nhập không hợp lệ' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  })
);

router.use(auth);

router.get(
  '/',
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter);
    res.json(users);
  })
);

router.patch(
  '/:id/role',
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ message: 'Thiếu role mới' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User không tồn tại' });
    }

    await logAction(req.user?._id, 'UPDATE_USER_ROLE', updatedUser._id.toString());

    res.json(updatedUser);
  })
);

module.exports = router;

