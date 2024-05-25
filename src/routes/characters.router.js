import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import userPrisma from '../utils/prisma/user.client.js';

const router = express.Router();

// 캐릭터 생성 API (JWT 인증)
router.post('/characters', authMiddleware, async (req, res, next) => {
  const { userId } = req.locals.user;
  console.log('---');
  console.log(userId);
});

export default router;
