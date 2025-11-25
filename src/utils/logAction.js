const Log = require('../model/Log');

async function logAction(actorId, action, target) {
  try {
    await Log.create({
      actorId: actorId || null,
      action,
      target,
      time: new Date(),
    });
  } catch (error) {
    // Không throw để tránh ảnh hưởng luồng chính
    console.error('Ghi log thất bại:', error.message);
  }
}

module.exports = logAction;

