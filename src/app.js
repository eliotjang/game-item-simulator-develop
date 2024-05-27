import express from 'express';
import UsersRouter from './routes/users.router.js';
import CharactersRouter from './routes/characters.router.js';
import ItemsRouter from './routes/items.router.js';
import CharacterInventoryRouter from './routes/character-inventory.router.js';
import CharacterItemsRouter from './routes/character-items.router.js';
import GameContentRouter from './routes/game-content.router.js';
import errorHandlingMiddleware from './middlewares/error-handling.middleware.js';

const app = express();
const PORT = 80;

app.use(express.json());
app.use('/api', [
  UsersRouter,
  CharactersRouter,
  ItemsRouter,
  CharacterInventoryRouter,
  CharacterItemsRouter,
  GameContentRouter,
]);
app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트 서버 연결 완료');
});
