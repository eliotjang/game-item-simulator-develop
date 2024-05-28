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
     - 복호화가 불가능한 암호화 방식인 단방향 암호화입니다.
   - 비밀번호를 그냥 저장하지 않고 Hash 한 값을 저장 했을 때의 좋은 점은 무엇인가요?
     - Request body에서 비밀번호가 노출되기 때문에 평문을 해독할 수 없는 형태로 변경할 경우 보안성이 강화됩니다.
2. **인증 방식**
   - JWT(Json Web Token)을 이용해 인증 기능을 했는데, 만약 Access Token이 노출되었을 경우 발생할 수 있는 문제점은 무엇일까요?
     - 토큰이 탈취되어 인증된 사용자가 아닌 사용자가 임의로 사용할 수 있고 조작의 우려도 있습니다.
     - **Access Token**은 그 자체로도 **사용자 인증**에 필요한 **모든 정보를 가지고 있습니다.** 그렇기 때문에, 토큰을 가지고 있는 시간이 늘어날 수록, **탈취되었을 때 피해 규모는 더욱 커지게 됩니다.**
   - 해당 문제점을 보완하기 위한 방법으로는 어떤 것이 있을까요?
     - Refresh Token을 발급합니다. 서버에서 **강제로 토큰을 만료**시킬 수 있으며, **사용자의 인증 상태를 언제든지 서버에서 제어**할 수 있다는 장점을 가지고 있습니다.
3. **인증과 인가**
   - 인증과 인가가 무엇인지 각각 설명해 주세요.
     - **인증(Authentication)**은 서비스를 이용하려는 사용자가 인증된 신분을 가진 사람이 맞는지 검증하는 작업을 뜻합니다. 일반적으로, 신분증 검사 작업에 해당합니다.
     - **인가(Authorization)**는 이미 인증된 사용자가 **특정 리소스에 접근**하거나 **특정 작업을 수행**할 수 있는 **권한이 있는지를 검증**하는 작업을 뜻합니다. 놀이공원에서 자유 이용권을 소지하고있는지 확인하는 단계라고 보면 좋습니다.
   - 위 API 구현 명세에서 인증을 필요로 하는 API와 그렇지 않은 API의 차이가 뭐라고 생각하시나요?
     - 일반 사용자가 사용할 수 있는 범용적인 로직과 특정 캐릭터의 삭제 같은 크리티컬한 로직의 차이의 유무입니다.
   - 아이템 생성, 수정 API는 인증을 필요로 하지 않는다고 했지만 사실은 어느 API보다도 인증이 필요한 API입니다. 왜 그럴까요?
     - 아이템 생성, 수정은 그 자체로 게임 전체에 영향을 주기 때문에 일반 사용자가 건드린다면 큰 문제가 생깁니다.
4. **Http Status Code**
   - 과제를 진행하면서 사용한 Http Status Code를 모두 나열하고, 각각이 의미하는 것과 어떤 상황에 사용했는지 작성해 주세요.
     - 400 Bad Request
       - Reqeust body 의 형식이 올바르지 않을 때
       - 캐릭터 조회에 실패할 때
       - 아이템 조회에 실패할 때
       - 유효하지 않은 아이템을 구입할 때
       - 구매 가능 금액을 초과할 때
       - 유효하지 않은 아이템을 판매할 때
       - 인벤토리 내 존재하지 않은 아이템을 판매할 때
       - 인벤토리 내 보유한 아이템 개수보다 초과된 개수의 아이템을 판매할 때
       - 유효하지 않은 아이템을 탈착할 때
       - 장착되어 있지 않은 아이템을 탈착할 때
     - 401 Unauthorized
       - 아이디가 존재하지 않을 때
       - 비밀번호가 일치하지 않을 때
     - 409 Conflict
       - 이미 존재하는 계정 아이디를 생성할 때
       - 이미 존재하는 캐릭터 이름을 생성할 때
       - 이미 존재하는 아이템 코드를 생성할 때
     - 500 Internal Server Error
       - 서버 내부 에러가 발생할 때
5. **게임 경제**
   - 현재는 간편한 구현을 위해 캐릭터 테이블에 money라는 게임 머니 컬럼만 추가하였습니다.
     - 이렇게 되었을 때 어떠한 단점이 있을 수 있을까요?
       - 게임 머니를 획득할 때마다 캐릭터 테이블을 조회하기 때문에 불필요한 컬럼까지 조회됩니다.
     - 이렇게 하지 않고 다르게 구현할 수 있는 방법은 어떤 것이 있을까요?
       - 게임 머니 테이블을 새로 생성합니다.
   - 아이템 구입 시에 가격을 클라이언트에서 입력하게 하면 어떠한 문제점이 있을 수 있을까요?
     - 가격을 입력하는 로직이 사용자에게 노출되어 임의로 가격을 조정할 수 있는 문제점이 생깁니다.
