import { Router } from 'express';
import {
    getMonthlyOverview,
    getSpendingTrend
} from '../controllers/statistics.controller.js';

const router = Router();

router.get('/monthly-overview', getMonthlyOverview);
router.get('/spending-trend', getSpendingTrend);

export default router;
