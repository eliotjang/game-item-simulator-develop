import express from 'express';
import gamePrisma from '../utils/prisma/game.client.js';
import userPrisma from '../utils/prisma/user.client.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// 캐릭터가 장착한 아이템 목록 조회 API
router.get('/character-items/:characterId', async (req, res, next) => {
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

    // 캐릭터 장착 아이템 조회
    const equippedItems = await userPrisma.characterItems.findMany({
      where: {
        CharacterId: +characterId,
      },
      orderBy: {
        itemCode: 'desc',
      },
    });

    let characterItemsData = [];

    // 캐릭터 장착 아이템 목록 이름 추가
    for (let i = 0; i < equippedItems.length; i++) {
      const targetItem = await gamePrisma.items.findFirst({
        where: {
          itemCode: equippedItems[i].itemCode,
        },
      });
      characterItemsData.push({
        itemCode: equippedItems[i].itemCode,
        itemName: targetItem.itemName,
        itemCount: equippedItems[i].itemCount,
      });
    }

    return res.status(200).json({
      message: '캐릭터 장착 아이템 목록입니다.',
      data: characterItemsData,
    });
  } catch (error) {
    next(error);
  }
});

// 아이템 장착 API (JWT 인증)
router.post('/character-items/:characterId', authMiddleware, async (req, res, next) => {
  try {
    // Path parameter로 캐릭터 ID 전달
    const { characterId } = req.params;
    // Request body로 아이템 코드 전달
    const { itemCode } = req.body;

    // 캐릭터 조회
    const character = await userPrisma.characters.findFirst({
      where: {
        characterId: +characterId,
      },
    });
    if (!character) {
      return res.status(404).json({ errorMessage: '캐릭터 조회에 실패했습니다.' });
    }

    const targetItem = await gamePrisma.items.findFirst({
      where: {
        itemCode,
      },
    });
    const targetInventory = await userPrisma.characterInventory.findFirst({
      where: {
        CharacterId: +characterId,
        itemCode,
      },
    });
    const isExistCharacterItem = await userPrisma.characterItems.findFirst({
      where: {
        CharacterId: +characterId,
        itemCode,
      },
    });
    // 존재하지 않은 아이템 장착 시도 시, 400 Bad Request 상태코드 및 에러메시지 반환
    if (!targetItem) {
      return res.status(400).json({ errorMessage: '유효하지 않은 아이템의 장착입니다.' });
    }
    // 인벤토리 내 존재하지 않는 아이템 장착 시도 시, 400 Bad Request 상태코드 및 에러 메시지 반환
    if (!targetInventory) {
      return res.status(400).json({ errorMessage: '인벤토리 내 존재하지 않은 아이템입니다.' });
    }
    // 이미 장착된 아이템의 장착 시도 시, 400 Bad Request 상태코드 및 에러 메시지 반환
    if (isExistCharacterItem) {
      return res.status(400).json({ errorMessage: '이미 장착된 아이템입니다.' });
    }

    // 아이템 장착
    await userPrisma.characterItems.create({
      data: {
        CharacterId: +characterId,
        itemCode,
      },
    });

    // 캐릭터 스탯 변경
    const changedStatCharacter = await userPrisma.characters.update({
      data: {
        characterHealth: character.characterHealth + targetItem.itemHealth,
        characterPower: character.characterPower + targetItem.itemPower,
      },
      where: {
        characterId: +characterId,
      },
    });

    // 인벤토리 내 아이템의 개수가 하나인 경우, 인벤토리-아이템 정보 삭제
    if (targetInventory.itemCount === 1) {
      await userPrisma.characterInventory.delete({
        where: {
          characterInventoryId: targetInventory.characterInventoryId,
        },
      });
    } else {
      // 이외의 경우, 아이템 개수 1 차감
      await userPrisma.characterInventory.update({
        data: {
          itemCount: targetInventory.itemCount - 1,
        },
        where: {
          characterInventoryId: targetInventory.characterInventoryId,
        },
      });
    }

    return res.status(200).json({
      message: `${targetItem.itemName}을(를) 장착 완료했습니다`,
      baseStat: {
        health: character.characterHealth,
        power: character.characterPower,
      },
      changedStat: {
        health: changedStatCharacter.characterHealth,
        power: changedStatCharacter.characterPower,
      },
    });
  } catch (error) {
    next(error);
  }
});

// 아이템 탈착 API (JWT 인증)
router.delete('/character-items/:characterId', authMiddleware, async (req, res, next) => {
  try {
    // Path parameter로 캐릭터 ID 전달
    const { characterId } = req.params;
    // Request body로 아이템 코드 전달
    const { itemCode } = req.body;

    // 캐릭터 조회
    const character = await userPrisma.characters.findFirst({
      where: {
        characterId: +characterId,
      },
    });
    if (!character) {
      return res.status(404).json({ errorMessage: '캐릭터 조회에 실패했습니다.' });
    }

    const targetItem = await gamePrisma.items.findFirst({
      where: {
        itemCode,
      },
    });
    const targetInventory = await userPrisma.characterInventory.findFirst({
      where: {
        CharacterId: +characterId,
        itemCode,
      },
    });
    const targetCharacterItem = await userPrisma.characterItems.findFirst({
      where: {
        CharacterId: +characterId,
        itemCode,
      },
    });
    // 존재하지 않은 아이템 탈착 시도 시, 400 Bad Request 상태코드 및 에러메시지 반환
    if (!targetItem) {
      return res.status(400).json({ errorMessage: '유효하지 않은 아이템의 탈착입니다.' });
    }
    // 장착되지 않은 아이템의 탈착 시도 시, 400 Bad Request 상태코드 및 에러 메시지 반환
    if (!targetCharacterItem) {
      return res.status(400).json({ errorMessage: '장착되어 있지 않은 아이템입니다.' });
    }

    // 아이템 탈착
    await userPrisma.characterItems.delete({
      where: {
        characterItemId: targetCharacterItem.characterItemId,
      },
    });

    // 캐릭터 스탯 변경
    const changedStatCharacter = await userPrisma.characters.update({
      data: {
        characterHealth: character.characterHealth - targetItem.itemHealth,
        characterPower: character.characterPower - targetItem.itemPower,
      },
      where: {
        characterId: +characterId,
      },
    });

    // 인벤토리 내 아이템이 없을 경우, 인벤토리-아이템 정보 추가
    if (!targetInventory) {
      await userPrisma.characterInventory.create({
        data: {
          CharacterId: +characterId,
          itemCode,
          itemCount: 1,
        },
      });
    } else {
      // 이외의 경우 아이템 개수 1 증가
      await userPrisma.characterInventory.update({
        data: {
          itemCount: targetInventory.itemCount + 1,
        },
        where: {
          characterInventoryId: targetInventory.characterInventoryId,
        },
      });
    }

    return res.status(200).json({
      message: `${targetItem.itemName}을(를) 탈착 완료했습니다`,
      baseStat: {
        health: character.characterHealth,
        power: character.characterPower,
      },
      changedStat: {
        health: changedStatCharacter.characterHealth,
        power: changedStatCharacter.characterPower,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
