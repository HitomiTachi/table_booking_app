const express = require('express');
const Table = require('../src/model/Table');
const asyncHandler = require('../src/utils/asyncHandler');
const logAction = require('../src/utils/logAction');
const { auth, authorize } = require('../src/middleware/auth');

const router = express.Router();

router.use(auth);

router.get(
  '/',
  authorize('admin', 'owner', 'staff'),
  asyncHandler(async (req, res) => {
    const { ownerId, status } = req.query;
    const filter = {};

    if (req.user.role === 'owner') {
      filter.ownerId = req.user._id;
    } else if (ownerId) {
      filter.ownerId = ownerId;
    }

    if (status) {
      filter.status = status;
    }
    const tables = await Table.find(filter);
    res.json(tables);
  })
);

router.post(
  '/',
  authorize('admin', 'owner'),
  asyncHandler(async (req, res) => {
    const payload = {
      ...req.body,
      ownerId: req.user.role === 'owner' ? req.user._id : req.body.ownerId,
    };
    const table = await Table.create(payload);
    await logAction(req.user._id, 'CREATE_TABLE', table._id.toString());
    res.status(201).json(table);
  })
);

router.put(
  '/:id',
  authorize('admin', 'owner', 'staff'),
  asyncHandler(async (req, res) => {
    const payload = { ...req.body };
    const table = await Table.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    });
    if (!table) {
      return res.status(404).json({ message: 'Table không tồn tại' });
    }
    if (req.user.role === 'owner' && table.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Không thể cập nhật table của owner khác' });
    }
    await logAction(req.user._id, 'UPDATE_TABLE', table._id.toString());
    res.json(table);
  })
);

router.patch(
  '/:id/status',
  authorize('admin', 'owner', 'staff'),
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Thiếu status mới' });
    }
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!table) {
      return res.status(404).json({ message: 'Table không tồn tại' });
    }
    if (req.user.role === 'owner' && table.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Không thể cập nhật table của owner khác' });
    }
    await logAction(req.user._id, 'UPDATE_TABLE_STATUS', table._id.toString());
    res.json(table);
  })
);

router.delete(
  '/:id',
  authorize('admin', 'owner'),
  asyncHandler(async (req, res) => {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Table không tồn tại' });
    }
    if (req.user.role === 'owner' && table.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Không thể xóa table của owner khác' });
    }
    await logAction(req.user._id, 'DELETE_TABLE', table._id.toString());
    res.json({ message: 'Đã xóa table' });
  })
);

module.exports = router;

