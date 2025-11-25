const express = require('express');
const Log = require('../src/model/Log');
const asyncHandler = require('../src/utils/asyncHandler');
const { auth, authorize } = require('../src/middleware/auth');

const router = express.Router();
router.use(auth);

router.get(
  '/',
  authorize('admin', 'owner', 'staff'),
  asyncHandler(async (req, res) => {
    const { actorId, action } = req.query;
    const filter = {};
    if (actorId) {
      filter.actorId = actorId;
    }
    if (action) {
      filter.action = action;
    }

    const logs = await Log.find(filter).sort({ time: -1 });
    res.json(logs);
  })
);

router.post(
  '/',
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const { actorId, action, target, time } = req.body;
    const log = await Log.create({
      actorId: actorId || null,
      action,
      target,
      time: time ? new Date(time) : new Date(),
    });
    res.status(201).json(log);
  })
);

module.exports = router;

