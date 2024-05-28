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

### Q&A

1. **암호화 방식**
   - 비밀번호를 DB에 저장할 때 Hash를 이용했는데, Hash는 단방향 암호화와 양방향 암호화 중 어떤 암호화 방식에 해당할까요?
   - 비밀번호를 그냥 저장하지 않고 Hash 한 값을 저장 했을 때의 좋은 점은 무엇인가요?
2. **인증 방식**
   - JWT(Json Web Token)을 이용해 인증 기능을 했는데, 만약 Access Token이 노출되었을 경우 발생할 수 있는 문제점은 무엇일까요?
   - 해당 문제점을 보완하기 위한 방법으로는 어떤 것이 있을까요?
3. **인증과 인가**
   - 인증과 인가가 무엇인지 각각 설명해 주세요.
   - 위 API 구현 명세에서 인증을 필요로 하는 API와 그렇지 않은 API의 차이가 뭐라고 생각하시나요?
   - 아이템 생성, 수정 API는 인증을 필요로 하지 않는다고 했지만 사실은 어느 API보다도 인증이 필요한 API입니다. 왜 그럴까요?
4. **Http Status Code**
   - 과제를 진행하면서 사용한 Http Status Code를 모두 나열하고, 각각이 의미하는 것과 어떤 상황에 사용했는지 작성해 주세요.
5. **게임 경제**
   - 현재는 간편한 구현을 위해 캐릭터 테이블에 money라는 게임 머니 컬럼만 추가하였습니다.
     - 이렇게 되었을 때 어떠한 단점이 있을 수 있을까요?
     - 이렇게 하지 않고 다르게 구현할 수 있는 방법은 어떤 것이 있을까요?
   - 아이템 구입 시에 가격을 클라이언트에서 입력하게 하면 어떠한 문제점이 있을 수 있을까요?
