import express from 'express';
//import { gamePrisma, userPrisma } from '../utils/prisma/index.js';
import gamePrisma from '../utils/prisma/game.client.js';
import userPrisma from '../utils/prisma/user.client.js';

const router = express.Router();

// 게시글 생성
router.post('/posts', async (req, res, next) => {
  const { title, content, password } = req.body;
  const post = await userPrisma.userTest.create({
    data: {
      title,
      content,
      password,
    },
  });

  return res.status(201).json({ data: post });
});

// routes/posts.router.js

/** 게시글 전체 조회 API **/
router.get('/posts', async (req, res, next) => {
  const posts = await userPrisma.userTest.findMany({
    select: {
      postId: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json({ data: posts });
});

// routes/posts.router.js

/** 게시글 상세 조회 API **/
router.get('/posts/:postId', async (req, res, next) => {
  const { postId } = req.params;
  const post = await userPrisma.userTest.findFirst({
    where: { postId: +postId },
    select: {
      postId: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json({ data: post });
});
export default router;
