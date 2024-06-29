import express from "express"
import * as BookingController from '../controllers/booking.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', authenticateUser, BookingController.getAllBookings);
router.get('/:bookingId', authenticateUser, BookingController.getBookingById);
router.post('/', authenticateUser, BookingController.createBooking);
router.delete('/:bookingId', authenticateUser, BookingController.cancelBooking);

export default router
