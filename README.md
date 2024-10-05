# waiker-carousel
## 프로젝트 구조

```shell
.
├── .prettierrc
├── README.md
├── eslint.config.mjs
├── images
│   ├── 01-data-solution.webp
│   ├── 02-ai-solution.webp
│   ├── 03-ux-solution.webp
│   ├── 04-prize.webp
│   └── 05-kbs.webp
├── package-lock.json
├── package.json
└── src
    ├── components
    │   ├── Carousel.js             # 캐러셀 컴포넌트
    │   └── SlideDelayControl.js    # 슬라이드 간격을 지정할 수 있는 컨트롤 컴포넌트
    ├── css
    │   ├── reset.css
    │   └── style.css
    ├── index.html
    ├── index.js
    └── utils
        └── coordinateUtils.js     # 마우스 및 터치 이벤트에서 좌표를 반환하는 유틸함수
```

## 프로젝트 사용법

로컬 서버 실행

```
npm i
npm run dev
```

## 프로젝트 실행 화면

### 1. 캐러셀 기본 동작 및 제어 - 슬라이드 자동 전환, 인디케이터, 슬라이드 이동 버튼, 자동 재생 멈춤 및 재개 버튼

https://github.com/user-attachments/assets/196e8fcf-659b-4769-bc3f-ed09cd83bb6c

### 2. 슬라이드 전환 속도 설정 기능

https://github.com/user-attachments/assets/f343a9af-0c26-4c73-8cb9-b44af9b4fbc3


### 3. 마우스로 슬라이드를 드래그해서 제어하는 기능
https://github.com/user-attachments/assets/f98b7b6e-163b-4b27-877e-1d4c7bee2acd

### 4. 터치 스크린 장치에서 스와이프로 슬라이드를 제어하는 기능

https://github.com/user-attachments/assets/d9b35c8b-87f6-4212-a939-5509212a9359

### 5. 반응형

https://github.com/user-attachments/assets/23400878-c3b5-4cc6-9662-131ad0417ddb











