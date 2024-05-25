import express from 'express';
import PostRouter from './routes/posts.router.js';
import UsersRouter from './routes/users.router.js';
import CharactersRouter from './routes/characters.router.js';
import errorHandlingMiddleware from './middlewares/error-handling.middleware.js';

const app = express();
const PORT = 80;

app.use(express.json());
app.use('/api', [PostRouter, UsersRouter, CharactersRouter]);
app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트 서버 연결 완료');
});
