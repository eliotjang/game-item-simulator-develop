import jwt from 'jsonwebtoken';
import userPrisma from '../utils/prisma/user.client.js';
import dotEnv from 'dotenv';

dotEnv.config();

// Request의 Authorization 헤더의 JWT로 인증된 사용자 검증 Middleware 구현
export default async function (req, res, next) {
  try {
    // Authorization 헤더로 JWT 전달
    const { authorization } = req.header.authorization;
    if (!authorization) throw new Error('토큰이 존재하지 않습니다.');

    const [tokenType, token] = authorization.split(' ');

    if (tokenType !== 'Bearer') throw new Error('토큰 타입이 일치하지 않습니다.');

    const decodedToken = jwt.verify(token, process.env.CUSTOM_SECRET_KEY);
    const userId = decodedToken.userId;

    const user = await userPrisma.users.findFirst({
      where: { userId: +userId },
    });
    if (!user) {
      throw new Error('토큰 사용자가 존재하지 않습니다.');
    }

    // 인증 성공 시, 인증 사용자 정보를 저장
    req.locals.user = user;

    next();
  } catch (error) {
    switch (error.name) {
      // JWT의 유효기간 만료 시, 401 Unauthorized 상태코드 및 에러 메시지 반환
      case 'TokenExpiredError':
        return res.status(401).json({ errorMessage: '토큰이 만료되었습니다.' });
      // JWT 데이터 조작으로 인한 Signature 불일치 시, 401 Unauthorized 상태코드 및 에러 메시지 반환
      case 'JsonWebTokenError':
        return res.status(401).json({ errorMessage: '토큰이 조작되었습니다.' });
      // JWT 검증 실패 시, 401 Unauthorized 상태코드 및 에러 메시지 반환
      default:
        return res.status(401).json({ errorMessage: error.message ?? '비정상적인 요청입니다.' });
    }
  }
}
