import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';
import { register, login } from '../controllers/authController';
import { getCoworkings, getCoworkingById, createCoworking, createWorkspace } from '../controllers/coworkingController';
import { createBooking, getBookings, cancelBooking } from '../controllers/bookingController';

const router = Router();

// Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Coworking Routes
router.get('/coworkings', getCoworkings);
router.get('/coworkings/:id', getCoworkingById);
router.post('/coworkings', authenticateToken, requireAdmin, createCoworking);
router.post('/workspaces', authenticateToken, requireAdmin, createWorkspace);

// Booking Routes
router.get('/bookings', authenticateToken, getBookings);
router.post('/bookings', authenticateToken, createBooking);
router.delete('/bookings/:id', authenticateToken, cancelBooking);

export default router;
