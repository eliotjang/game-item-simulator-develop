import express from 'express';
import userPrisma from '../utils/prisma/user.client.js';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import dotEnv from 'dotenv';
import jwt from 'jsonwebtoken';

dotEnv.config();

// 회원가입 유효성 체크
const createUserSchema = Joi.object({
  // 아이디 : 영어 소문자 + 숫자 조합으로 구성
  userId: Joi.string().pattern(new RegExp(/[a-z0-9]/)),
  // 비밀번호 : 6자 이상 및 비밀번호 확인과 일치 확인
  password: Joi.string().min(6).required(),
  repeatPassword: Joi.any().valid(Joi.ref('password')).required(),
  name: Joi.string().required(),
});

const router = express.Router();

// 회원가입 API
router.post('/sign-up', async (req, res, next) => {
  try {
    // 아이디, 비밀번호, 비밀번호 확인, 이름을 데이터로 넘김
    const validation = await createUserSchema.validateAsync(req.body);
    const { userId, password, name } = validation;
    const isExistUser = await userPrisma.users.findFirst({
      where: { userId },
    });
    // 아이디 중복 시 409 Conflict 상태코드 및 에러 메시지 반환
    if (isExistUser) {
      return res.status(409).json({ message: '이미 존재하는 아이디입니다.' });
    }

    // 비밀번호 암호화
    const hasedPassword = await bcrypt.hash(password, 10);
    const user = await userPrisma.users.create({
      data: {
        userId,
        password: hasedPassword,
        name,
      },
    });

    // 회원가입 성공 시, 비밀번호 제외 사용자 정보 반환
    return res.status(201).json({ data: { userId, name } });
  } catch (err) {
    next(err);
  }
});

// 로그인 API
router.post('/sign-in', async (req, res, next) => {
  try {
    // 아이디, 비밀번호로 로그인 요청
    const { userId, password } = req.body;
    const user = await userPrisma.users.findFirst({ where: { userId } });
    // 해당 아이디가 없을 경우, 401 Unauthorized 상태코드 및 에러 메시지 반환
    if (!user) {
      return res.status(401).json({ message: '존재하지 않는 아이디입니다.' });
    }
    // 비밀번호가 미일치 시, 401 Unauthorized 상태코드 및 에러 메시지 반환
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // 로그인 성공 시, 액세스 토큰 생성
    const token = jwt.sign(
      {
        userId: user.userId,
      },
      process.env.CUSTOM_SECRET_KEY
    );

    // Authorization 헤더에 Bearer 토큰 형식 JWT 저장
    req.header.authorization = `Bearer ${token}`;

    // 로그인 성공 및 액세스 토큰 발급 완료 메시지 반환
    return res.status(200).json({ message: '로그인 성공 및 액세스 토큰이 발급 완료되었습니다.' });
  } catch (err) {
    next(err);
  }
});

// Authorization 헤더 테스트 API
router.post('/auth-header-test', (req, res, next) => {
  try {
    console.log(req.header.authorization);

    return res.status(200).json({ Authorization: req.header.authorization });
  } catch (error) {
    next(err);
  }
});

export default router;
