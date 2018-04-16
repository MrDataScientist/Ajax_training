import express from 'express';
import authRoutes from './auth.route';
import bookRoutes from './book.route';
import memberRoutes from './member.route';

const router = express.Router();

/** GET /check-api - Check API */
router.get('/check-api', (req, res) =>
  res.send("It's working...")
);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount books routes at /books
router.use('/books', bookRoutes);

// mount members routes at /members
router.use('/members', memberRoutes);

export default router
