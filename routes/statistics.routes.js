import { Router } from 'express';
import {
    getMonthlyOverview,
    getSpendingTrend
} from '../controllers/statistics.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/monthly-overview', authenticate, getMonthlyOverview);
router.get('/spending-trend', authenticate, getSpendingTrend);

export default router;
