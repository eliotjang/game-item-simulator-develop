import express from 'express';
import gamePrisma from '../utils/prisma/game.client.js';
import userPrisma from '../utils/prisma/user.client.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// 아이템 구입 API (JWT 인증)
router.post('/character-inventory/:characterId', authMiddleware, async (req, res, next) => {
  try {
    // Path parameter로 캐릭터 ID 전달
    const { characterId } = req.params;
    // Request body로 아이템 코드, 아이템 수량 전달
    const targetItems = req.body;

    // 캐릭터 조회
    const character = await userPrisma.characters.findFirst({
      where: {
        characterId: +characterId,
      },
    });
    if (!character) {
      return res.status(404).json({ errorMessage: '캐릭터 조회에 실패했습니다.' });
    }

    // 아이템 존재 유무 및 게임 머니 한도 확인
    let totalPurchasePrice = 0;
    for (let i = 0; i < targetItems.length; i++) {
      const isExistItem = await gamePrisma.items.findFirst({
        where: {
          itemCode: targetItems[i].itemCode,
        },
      });
      // 존재하지 않은 아이템 구매 시도 시, 400 Bad Request 상태코드 및 에러메시지 반환
      if (!isExistItem) {
        return res.status(400).json({ errorMessage: '유효하지 않은 아이템의 구입입니다.' });
      }
      totalPurchasePrice += isExistItem.itemPrice * targetItems[i].itemCount;
    }

    // 아이템 구매 금액의 한도 초과 시, 400 Bad Request 상태코드 및 에러메시지 반환
    if (character.gameMoney < totalPurchasePrice) {
      return res.status(400).json({ errorMessage: '구매 가능 금액을 초과했습니다.' });
    }

    // 아이템 생성
    for (let i = 0; i < targetItems.length; i++) {
      const isExistInventory = await userPrisma.characterInventory.findFirst({
        where: {
          CharacterId: +characterId,
          itemCode: targetItems[i].itemCode,
        },
      });
      // 처음 구매하는 아이템일 경우 인벤토리 생성
      if (!isExistInventory) {
        const itemPurchase = await userPrisma.characterInventory.create({
          data: {
            CharacterId: +characterId,
            itemCode: targetItems[i].itemCode,
            itemCount: targetItems[i].itemCount,
          },
        });
      }
      // 기존에 구매한 아이템일 경우 해당 인벤토리 아이템 개수 추가
      else {
        await userPrisma.characterInventory.update({
          where: {
            characterInventoryId: isExistInventory.characterInventoryId,
            CharacterId: +characterId,
            itemCode: targetItems[i].itemCode,
          },
          data: {
            itemCount: isExistInventory.itemCount + targetItems[i].itemCount,
          },
        });
      }
    }

    // 게임 머니 차감
    const paymentCharacter = await userPrisma.characters.update({
      data: {
        gameMoney: character.gameMoney - totalPurchasePrice,
      },
      where: {
        characterId: +characterId,
      },
    });

    return res.status(200).json({
      message: '아이템 구입에 성공했습니다.',
      baseData: {
        gameMoney: character.gameMoney,
      },
      totalPurchasePrice,
      changedData: {
        gameMoney: paymentCharacter.gameMoney,
      },
    });
  } catch (error) {
    next(error);
  }
});

// 아이템 판매 API (JWT 인증)
router.delete('/character-inventory/:characterId', authMiddleware, async (req, res, next) => {
  try {
    // Path parameter로 캐릭터 ID 전달
    const { characterId } = req.params;
    // Request body로 아이템 코드, 아이템 수량 전달
    const targetItems = req.body;

    // 캐릭터 조회
    const character = await userPrisma.characters.findFirst({
      where: {
        characterId: +characterId,
      },
    });
    if (!character) {
      return res.status(404).json({ errorMessage: '캐릭터 조회에 실패했습니다.' });
    }

    let totalSellPrice = 0;
    // 아이템 존재 및 인벤토리 내 존재 유무 확인
    for (let i = 0; i < targetItems.length; i++) {
      const isExistItem = await gamePrisma.items.findFirst({
        where: {
          itemCode: targetItems[i].itemCode,
        },
      });
      const isExistInventory = await userPrisma.characterInventory.findFirst({
        where: {
          CharacterId: +characterId,
          itemCode: targetItems[i].itemCode,
        },
      });
      // 원가의 60% 가격으로 정산하여 총 판매 금액 확인
      totalSellPrice += isExistItem.itemPrice * 0.6 * targetItems[i].itemCount;
      // 존재하지 않은 아이템 판매 시도 시, 400 Bad Request 상태코드 및 에러 메시지 반환
      if (!isExistItem) {
        return res.status(400).json({ errorMessage: '유효하지 않은 아이템의 판매입니다.' });
      }
      // 인벤토리 내 존재하지 않는 아이템 판매 시도 시, 400 Bad Request 상태코드 및 에러 메시지 반환
      if (!isExistInventory) {
        return res.status(400).json({ errorMessage: '인벤토리 내 존재하지 않은 아이템의 판매입니다.' });
      }
      // 보유한 아이템보다 초과된 개수의 아이템 판매 시도 시, 400 Bad Request 상태코드 및 에러 메시지 반환
      if (isExistInventory.itemCount < targetItems[i].itemCount) {
        return res
          .status(400)
          .json({ errorMessage: '인벤토리 내 보유한 아이템 개수보다 초과된 개수의 아이템 판매입니다.' });
      }
    }

    // 아이템 판매
    for (let i = 0; i < targetItems.length; i++) {
      const targetInventory = await userPrisma.characterInventory.findFirst({
        where: {
          CharacterId: +characterId,
          itemCode: targetItems[i].itemCode,
        },
      });

      // 판매할 아이템 개수 차감
      await userPrisma.characterInventory.update({
        where: {
          characterInventoryId: targetInventory.characterInventoryId,
          CharacterId: +characterId,
          itemCode: targetItems[i].itemCode,
        },
        data: {
          itemCount: targetInventory.itemCount - targetItems[i].itemCount,
        },
      });
    }

    // 아이템 총 판매 가격 정산
    const paymentCharacter = await userPrisma.characters.update({
      data: {
        gameMoney: character.gameMoney + totalSellPrice,
      },
      where: {
        characterId: +characterId,
      },
    });

    return res.status(200).json({
      message: '아이템 판매에 성공했습니다.',
      baseData: {
        gameMoney: character.gameMoney,
      },
      totalSellPrice,
      changedData: {
        gameMoney: paymentCharacter.gameMoney,
      },
    });
  } catch (error) {
    next(error);
  }
});

// 캐릭터가 보유한 인벤토리 내 아이템 목록 조회 API (JWT 인증)
router.get('/character-inventory/:characterId', authMiddleware, async (req, res, next) => {
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
      return res.status(400).json({ errorMessage: '캐릭터 조회에 실패했습니다.' });
    }

    // 인벤토리 아이템 조회
    const inventoryItems = await userPrisma.characterInventory.findMany({
      where: {
        CharacterId: +characterId,
      },
      orderBy: {
        itemCode: 'desc',
      },
    });

    let inventoryData = [];

    // 인벤토리 아이템 목록 이름 추가
    for (let i = 0; i < inventoryItems.length; i++) {
      const targetItem = await gamePrisma.items.findFirst({
        where: {
          itemCode: inventoryItems[i].itemCode,
        },
      });
      inventoryData.push({
        itemCode: inventoryItems[i].itemCode,
        itemName: targetItem.itemName,
        itemCount: inventoryItems[i].itemCount,
      });
    }

    return res.status(200).json({
      message: '인벤토리 아이템 목록입니다.',
      data: inventoryData,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
