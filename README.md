# DeepNews

DeepNews는 Gemini API를 활용하여 사용자가 검색한 키워드와 관련된 최신 뉴스를 분석하고 요약해주는 서비스입니다.

## 주요 기능

- 키워드 기반 뉴스 검색
- Gemini AI를 활용한 뉴스 분석 및 요약
- 주요 헤드라인, 핵심 내용, 트렌드 분석 제공

## 기술 스택

- **프론트엔드**: Next.js, React, TypeScript, Tailwind CSS
- **AI**: Google Gemini API

## 시작하기

### 필수 요구사항

- Node.js 18.0.0 이상
- Google Gemini API 키

### 설치 방법

1. 저장소 클론하기:

   ```bash
   git clone https://github.com/yourusername/deepnews.git
   cd deepnews
   ```

2. 의존성 설치:

   ```bash
   npm install
   ```

3. `.env.local` 파일에 Gemini API 키 설정:

   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. 개발 서버 실행:

   ```bash
   npm run dev
   ```

5. 브라우저에서 `http://localhost:3000`으로 접속하여 애플리케이션 확인

## 프로젝트 구조

```
deepnews/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── SearchBox.tsx
│   │   │   └── SearchResults.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── ...
├── public/
├── .env.local
├── package.json
├── README.md
└── ...
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


다음 키워드와 관련된 최근 뉴스를 조사하고 주요 내용을 요약해주세요: {query}
        
그라운딩 검색(Google Search)을 사용하여 해당 키워드에 대한 최신 뉴스와 정보를 검색해주세요.
{languageInstruction}
검색 결과는 최대한 {currentDate} 날짜 기준 일주일 이내의 정보를 기준으로 정리해주세요.
반드시 존재하는 뉴스 최소 10개 이상을 찾아서 정리해주세요.

## ✅ [{query} - 관련 최신 뉴스 요약] → id=\"report-title\"

### 주요 뉴스 헤드라인
1. [첫 번째 주요 헤드라인] → id=\"headline-1\" 
2. [두 번째 주요 헤드라인] → id=\"headline-2\"
3. [세 번째 주요 헤드라인] → id=\"headline-3\"
4. [넷 번째 주요 헤드라인] → id=\"headline-4\"
5. [다섯 번째 주요 헤드라인] → id=\"headline-5\"

### 핵심 내용 요약
* **[첫 번째 주요 헤드라인 내용]** [150자 이내 요약] → id=\"summary-1\"
* **[두 번째 주요 헤드라인 내용]** [150자 이내 요약] → id=\"summary-2\"
* **[세 번째 주요 헤드라인 내용]** [150자 이내 요약] → id=\"summary-3\"
* **[넷 번째 주요 헤드라인 내용]** [150자 이내 요약] → id=\"summary-4\"
* **[다섯 번째 주요 헤드라인 내용]** [150자 이내 요약] → id=\"summary-5\"

### 전반적인 트렌드 분석
* [{query}와 관련된 전반적인 트렌드를 500자 이내로 분석 후 *로 문단 구분하여 정리] → id=\"trend-analysis\"

