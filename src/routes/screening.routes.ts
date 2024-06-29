import express from 'express';
import * as ScreeningController from '../controllers/screening.controller';
import { authenticateUser, authorizeAdmin } from '../middlewares/auth.middleware';
const router = express.Router()

router.get('/', ScreeningController.getAllScreenings);
router.get('/:screeningId', ScreeningController.getScreeningById);
router.post('/', authenticateUser, authorizeAdmin, ScreeningController.createScreening);
router.put('/:screeningId', authenticateUser, authorizeAdmin, ScreeningController.updateScreening);
router.delete('/:screeningId', authenticateUser, authorizeAdmin, ScreeningController.deleteScreening);


export default router
