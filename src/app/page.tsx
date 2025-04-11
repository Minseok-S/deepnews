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

  const handleSearch = async (query: string, countries: string[]) => {
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

      const currentDate = new Date().toISOString().split("T")[0];

      // 환경 변수에서 프롬프트 가져오기
      const promptTemplate = process.env.NEXT_PUBLIC_NEWS_PROMPT || "";

      // 국가별 검색어 설정
      let languageInstruction = "";

      if (countries.includes("all")) {
        languageInstruction =
          '한국어와 영어로 두 가지 언어로 "{query}"를 검색하여 국내외 정보를 모두 포함해주세요.';
      } else {
        const languageMap: Record<string, string> = {
          kr: '한국어로 "{query}"를 검색하여 한국 내 정보를 찾아주세요.',
          us: '영어로 "{query}"를 검색하여 미국 내 정보를 찾아주세요.',
          cn: '중국어로 "{query}"를 검색하여 중국 내 정보를 찾아주세요.',
        };

        const languageInstructions = countries
          .map((country) => languageMap[country])
          .filter(Boolean);

        if (languageInstructions.length > 0) {
          languageInstruction = languageInstructions.join(" 그리고 ");
        } else {
          languageInstruction =
            '한국어와 영어로 두 가지 언어로 "{query}"를 검색하여 국내외 정보를 모두 포함해주세요.';
        }
      }

      // 변수 치환하여 프롬프트 생성
      const prompt = promptTemplate
        .replace(/{query}/g, query)
        .replace(/{currentDate}/g, currentDate)
        .replace(/{languageInstruction}/g, languageInstruction);

      console.log(prompt);

      const generationConfig = {
        temperature: 0,
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
