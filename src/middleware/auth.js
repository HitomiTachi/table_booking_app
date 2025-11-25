const User = require('../model/User');

async function auth(req, res, next) {
  try {
    const userId = req.header('x-user-id');
    if (!userId) {
      return res.status(401).json({ message: 'Thiếu header x-user-id' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'User không hợp lệ' });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
    next();
  };
}

function isRole(role) {
  return (req, res, next) => {
    if (req.user?.role === role) {
      return next();
    }
    return res.status(403).json({ message: 'Không có quyền truy cập' });
  };
}

module.exports = {
  auth,
  authorize,
  isRole,
};

