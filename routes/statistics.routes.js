import { Router } from 'express';
import {
    getCategoryBreakDown,
    getMonthlyOverview,
    getSpendingTrend
} from '../controllers/statistics.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /stats/monthly-overview:
 *   get:
 *     summary: Get monthly overview statistics
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date for the overview (YYYY-MM)
 *     responses:
 *       200:
 *         description: Monthly overview fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Monthly overview fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_income:
 *                       type: number
 *                       example: 1090
 *                     total_expenses:
 *                       type: number
 *                       example: 590
 *                     saved:
 *                       type: number
 *                       example: 500
 *                     currency:
 *                       type: string
 *                       example: IQD
 */
router.get('/monthly-overview', authenticate, getMonthlyOverview);

/**
 * @swagger
 * /stats/spending-trend:
 *   get:
 *     summary: Get spending trend statistics
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date for the trend (YYYY-MM)
 *     responses:
 *       200:
 *         description: Spending trend fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Spending trend fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     currency:
 *                       type: string
 *                       example: IQD
 *                     highest_spending_day:
 *                       type: string
 *                       format: date
 *                       example: "2026-02-05"
 *                     highest_income_day:
 *                       type: string
 *                       format: date
 *                       example: "2026-02-01"
 *                     spending:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           day:
 *                             type: string
 *                             format: date
 *                             example: "2026-02-01"
 *                           spend:
 *                             type: number
 *                             example: 0
 *                           income:
 *                             type: number
 *                             example: 500
 */
router.get('/spending-trend', authenticate, getSpendingTrend);
router.get('/get-category-breakdown' , authenticate ,getCategoryBreakDown)

export default router;
