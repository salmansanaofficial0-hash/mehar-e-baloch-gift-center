import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (!process.env.JWT_SECRET) {
        return res.status(503).json({ message: 'Authentication is not configured on the server.' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user || req.user.isBlocked) {
        return res.status(401).json({ message: 'User not authorized or blocked.' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token.' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};
