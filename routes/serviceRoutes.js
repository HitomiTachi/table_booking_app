const express = require('express');
const Service = require('../src/model/Service');
const asyncHandler = require('../src/utils/asyncHandler');
const logAction = require('../src/utils/logAction');
const { auth, authorize } = require('../src/middleware/auth');

const router = express.Router();

router.use(auth);

router.get(
  '/',
  authorize('admin', 'owner', 'staff'),
  asyncHandler(async (req, res) => {
    const { status } = req.query;
    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (req.user.role === 'owner') {
      filter.ownerId = req.user._id;
    } else if (req.query.ownerId) {
      filter.ownerId = req.query.ownerId;
    }
    const services = await Service.find(filter);
    res.json(services);
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
    const service = await Service.create(payload);
    await logAction(req.user._id, 'CREATE_SERVICE', service._id.toString());
    res.status(201).json(service);
  })
);

router.put(
  '/:id',
  authorize('admin', 'owner', 'staff'),
  asyncHandler(async (req, res) => {
    const payload = { ...req.body };
    const service = await Service.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    });
    if (!service) {
      return res.status(404).json({ message: 'Service không tồn tại' });
    }
    if (req.user.role === 'owner' && service.ownerId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Không thể cập nhật service của owner khác' });
    }
    await logAction(req.user._id, 'UPDATE_SERVICE', service._id.toString());
    res.json(service);
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
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ message: 'Service không tồn tại' });
    }
    if (req.user.role === 'owner' && service.ownerId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Không thể cập nhật service của owner khác' });
    }
    await logAction(req.user._id, 'UPDATE_SERVICE_STATUS', service._id.toString());
    res.json(service);
  })
);

router.delete(
  '/:id',
  authorize('admin', 'owner'),
  asyncHandler(async (req, res) => {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service không tồn tại' });
    }
    if (req.user.role === 'owner' && service.ownerId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Không thể xóa service của owner khác' });
    }
    await logAction(req.user._id, 'DELETE_SERVICE', service._id.toString());
    res.json({ message: 'Đã xóa service' });
  })
);

module.exports = router;

