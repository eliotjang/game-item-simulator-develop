import express from 'express';
import gamePrisma from '../utils/prisma/game.client.js';
import userPrisma from '../utils/prisma/user.client.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// 게임 머니 획득 API (JWT 인증)
router.post('/game-content/:characterId', authMiddleware, async (req, res, next) => {
  try {
    // Path parameter로 캐릭터 ID 전달
    const { characterId } = req.params;

    // 캐릭터 조회
    const character = await userPrisma.characters.findFirst({
      where: {
        characterId: +characterId,
      },
    });

    if (!character) {
      return res.status(404).json({ errorMessage: '캐릭터 조회에 실패했습니다.' });
    }

    // 100 게임 머니 획득
    const changedGameMoneyCharacter = await userPrisma.characters.update({
      data: {
        gameMoney: character.gameMoney + 100,
      },
      where: {
        characterId: +characterId,
      },
    });

    return res.status(200).json({
      message: '100 게임 머니를 획득했습니다.',
      baseGameMoney: character.gameMoney,
      changedGameMoney: changedGameMoneyCharacter.gameMoney,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
