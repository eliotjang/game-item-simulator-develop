import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import searchAuthMiddleware from '../middlewares/search-auth.middleware.js';
import userPrisma from '../utils/prisma/user.client.js';

const router = express.Router();

// 캐릭터 생성 API (JWT 인증)
router.post('/characters', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;
    // Request body로 캐릭터 명 전달
    const { characterName } = req.body;

    const isExistCharacter = await userPrisma.characters.findFirst({
      where: { characterName },
    });
    // 캐릭터 명 중복 시 409 Conflict 상태코드 및 에러 메시지 반환
    if (isExistCharacter) {
      return res.status(409).json({ message: '이미 존재하는 이름입니다.' });
    }

    const character = await userPrisma.characters.create({
      // 캐릭터 생성 시, user.shcema.prisma에서 체력 500, 힘 100, 게임 머니 10000 기본값 생성
      data: {
        UserId: userId,
        characterName,
      },
    });

    return res.status(201).json({
      message: `새로운 캐릭터 ${characterName}을(를) 생성했습니다.`,
      data: {
        character_id: character.characterId,
      },
    });
  } catch (error) {
    next(error);
  }
});

// 캐릭터 삭제 API (JWT 인증)
router.delete('/characters/:characterId', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;
    // Path parameter로 캐릭터 ID 전달
    const { characterId } = req.params;

    const isExistCharacter = await userPrisma.characters.findFirst({
      where: {
        UserId: userId,
        characterId: +characterId,
      },
    });
    if (!isExistCharacter) {
      return res.status(404).json({ errorMessage: '캐릭터 조회에 실패했습니다.' });
    }

    const characterName = isExistCharacter.characterName;
    await userPrisma.characters.delete({
      where: {
        UserId: userId,
        characterId: +characterId,
      },
    });

    return res.status(200).json({
      message: `캐릭터 ${characterName}을(를) 삭제했습니다.`,
    });
  } catch (error) {
    next(error);
  }
});

// 캐릭터 상세 조회 API ( 로그인: JWT 인증, 미로그인: JWT 미인증 )
router.get('/characters/:characterId', searchAuthMiddleware, async (req, res, next) => {
  try {
    const { characterId } = req.params;
    let character = await userPrisma.characters.findFirst({
      where: {
        characterId: +characterId,
      },
    });
    if (!character) {
      return res.status(404).json({ errorMessage: '캐릭터 조회에 실패했습니다.' });
    }

    // 내가 내 캐릭터를 조회하는 경우
    if (req.user) {
      const { userId } = req.user;
      character = await userPrisma.characters.findFirst({
        where: {
          UserId: userId,
          characterId: +characterId,
        },
        select: {
          characterName: true,
          characterHealth: true,
          characterPower: true,
          // 게임 머니까지 조회
          gameMoney: true,
        },
      });
    }
    // 로그인 하지 않았거나 다른 유저가 내 캐릭터를 조회하는 경우
    else {
      character = await userPrisma.characters.findFirst({
        where: {
          characterId: +characterId,
        },
        select: {
          characterName: true,
          characterHealth: true,
          characterPower: true,
        },
      });
    }
    return res.status(200).json({
      message: `캐릭터 ${character.characterName}을(를) 조회합니다.`,
      data: character,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
