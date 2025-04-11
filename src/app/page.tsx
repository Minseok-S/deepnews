"use client";

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SearchBox } from "./components/SearchBox";
import { SearchResults } from "./components/SearchResults";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setSearchQuery(query);
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Gemini API 통합
      const genAI = new GoogleGenerativeAI(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
      );

      // 자동 그라운딩 활성화된 모델 사용
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-pro-exp-03-25",
        tools: [
          {
            google_search: {},
          } as any,
        ],
      });

      let prompt = "";
      const currentDate = new Date().toISOString().split("T")[0];

      // 일반 뉴스 요약 프롬프트
      prompt = `다음 키워드와 관련된 최근 뉴스를 조사하고 주요 내용을 요약해주세요: ${query}
        
그라운딩 검색(Google Search)을 사용하여 해당 키워드에 대한 최신 뉴스와 정보를 검색해주세요.
한국어와 영어로 두 가지 언어로 "${query}"를 검색하여 국내외 정보를 모두 포함해주세요.
검색 결과는 최대한 ${currentDate} 날짜 기준 일주일 이내의 정보를 기준으로 정리해주세요.
반드시 존재하는 뉴스를 찾아서 정리해주세요.
유튜브는 제외해주세요.

## ✅ [${query} - 관련 최신 뉴스 요약] → id="report-title"

### 주요 뉴스 헤드라인
1. [첫 번째 주요 헤드라인] → id="headline-1" 
2. [두 번째 주요 헤드라인] → id="headline-2"
3. [세 번째 주요 헤드라인] → id="headline-3"
4. [네 번째 주요 헤드라인] → id="headline-4"
5. [다섯 번째 주요 헤드라인] → id="headline-5"

### 핵심 내용 요약
* **[첫 번째 주요 내용]** [100자 이내 요약] → id="summary-1"
* **[두 번째 주요 내용]** [100자 이내 요약] → id="summary-2"
* **[세 번째 주요 내용]** [100자 이내 요약] → id="summary-3"
* **[넷 번째 주요 내용]** [100자 이내 요약] → id="summary-4"
* **[다섯 번째 주요 내용]** [100자 이내 요약] → id="summary-5"

### 전반적인 트렌드 분석
* [${query}와 관련된 전반적인 트렌드를 500자 이내로 분석 후 문단 구분하여 정리] → id="trend-analysis"

## ✅ 참고 링크 → id="reference-links"
* [발행일자] [뉴스 기사 제목/출처 및 실제 URL] → id="reference-link-1"
* [발행일자] [뉴스 기사 제목/출처 및 실제 URL] → id="reference-link-2"
* [발행일자] [뉴스 기사 제목/출처 및 실제 URL] → id="reference-link-3"
* [발행일자] [뉴스 기사 제목/출처 및 실제 URL] → id="reference-link-4"
* [발행일자] [뉴스 기사 제목/출처 및 실제 URL] → id="reference-link-5"
`;

      console.log(prompt);

      const generationConfig = {
        temperature: 0.2,
        maxOutputTokens: 8192,
      };

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
      });

      const text = result.response.text();

      console.log(text);
      setResults(text);
    } catch (err) {
      console.error("검색 오류:", err);
      setError("뉴스 검색 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <SearchBox onSearch={handleSearch} isLoading={isLoading} />

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 mb-6 rounded-md">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">
                "{searchQuery}"에 대한 정보를 찾고 있습니다...
              </p>
            </div>
          )}

          {results && <SearchResults results={results} />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
