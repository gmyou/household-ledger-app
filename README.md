# 가계부 웹 앱 (Household Ledger App)

간단한 React 기반 가계부 앱 (MVP) 코드입니다. 

- **React + TailwindCSS**
- **LocalStorage** 를 통한 데이터 저장
- **CSV 내보내기/가져오기 지원**
- 월별 요약, 카테고리별 집계 기능

---

## 🚀 시작하기

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/household-ledger-app.git
cd household-ledger-app
```

### 2. 패키지 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:5173](http://localhost:5173) 열기.

### 4. 빌드
```bash
npm run build
npm run preview
```

---

## 📂 프로젝트 구조
```
household-ledger-app/
├── src/
│   └── App.jsx        # 메인 컴포넌트 (가계부 앱)
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 📦 package.json
```json
{
  "name": "household-ledger-app",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.1",
    "vite": "^5.0.0"
  }
}
```

---

## ⚙️ vite.config.js
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

---

## 🎨 tailwind.config.js
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## 📝 postcss.config.js
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

## ✨ 주요 기능
- 수입/지출 등록 (금액, 날짜, 카테고리, 메모)
- 월별 수입·지출·잔액 요약
- 카테고리별 집계 표시
- CSV 내보내기/가져오기
- LocalStorage 저장 (로그인/서버 필요 없음)

---

## 🛠️ 배포 가이드

### Vercel에 배포하기
1. [Vercel](https://vercel.com) 회원가입/로그인
2. 새 프로젝트 추가 → GitHub 저장소 연결
3. Framework = `Vite` 선택
4. 배포 완료 후 제공된 URL 접속

### Netlify에 배포하기
```bash
npm run build
netlify deploy
```

---

## 📌 TODO (향후 개선 아이디어)
- 사용자 계정 / 클라우드 동기화
- 예산 설정 & 알림 기능
- 차트/그래프 통계 시각화
- 모바일 앱(React Native) 확장

---

## 📜 라이선스
MIT License
