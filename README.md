# Game Item Simulator Develop

### AWS 배포 링크

![](https://github.com/eliotjang/game-item-simulator-develop/blob/main/assets/address.png)

- DNS 주소 : `eliotjang.shop:3000`
- [AWS 배포 링크](http://eliotjang.shop:3000/)

### 설계 및 구현

- [게임 아이템 제작 시뮬레이션 서비스 설계 및 구현 링크](https://eliotjang.notion.site/Node-js-d2aab2cd5c7340f9bdf6e2b481eac0fc?pvs=4)

### ERD 클라우드

![](https://github.com/eliotjang/game-item-simulator-develop/blob/main/assets/ERD.png)

- [ERD 클라우드 링크](https://www.erdcloud.com/d/WBqFhxKLx2hLs4pyg)

### API 명세서

![](https://github.com/eliotjang/game-item-simulator-develop/blob/main/assets/API.png)

- [API 명세서 링크](https://eliotjang.notion.site/API-419edb6939ce45148d6161cdd03d2bec?pvs=4)

### BackEnd Skills

![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

### 폴더 구조

```markdown
node_modules/

prisma/
├ gameClient/
├ userClient/
├── game.schema.prisma
└── user.schema.prisma

src/
├── middlewares/
│ ├── auth.middleware.js
│ ├── search-auth.middleware.js
│ └── error-handling.middleware.js
├── routes/
│ ├── character-inventory.router.js
│ ├── character-items.router.js
│ ├── characters.router.js
│ ├── game-content.router.js
│ ├── items.router.js
│ └── users.router.js
├── utils/prisma
│ ├── game.client.js
│ └── user.client.js
└── app.js

.env
.gitignore
.prettierrc
package.json
README.md
yarn.lock
```

### 개인 프로젝트 Q&A

- [Node.js 숙련 개인 프로젝트 Q&A 작성 링크](https://eliotjang.notion.site/Node-js-QnA-de5feb64c64a4e759ee33b3b9c1d2ae2?pvs=4)
