import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Kiểm tra kết nối API
 *     description: Endpoint đơn giản để kiểm tra API có hoạt động hay không
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API hoạt động bình thường
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "pong"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-06-21T10:30:00.000Z"
 *                 uptime:
 *                   type: number
 *                   description: Thời gian server đã chạy (giây)
 *                   example: 3600.123
 *             examples:
 *               success:
 *                 summary: Phản hồi thành công
 *                 value:
 *                   success: true
 *                   message: "pong"
 *                   timestamp: "2025-06-21T10:30:00.000Z"
 *                   uptime: 3600.123
 */
router.get('/ping', (req, res) => {
  return res.success({
    messageCode: 'health.ping.success',
    data: {
      message: 'pong',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

export default router;
