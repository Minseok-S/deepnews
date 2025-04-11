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

      // 맞춤형 리포트 요청 감지 (특수 형식)
      if (
        query.includes("리포트 생성 요청") ||
        query.includes("보고서 생성 요청")
      ) {
        // 사용자가 제공한 전체 요청을 프롬프트로 사용
        prompt = query;
      }
      // 기본 보고서 모드
      else if (
        query.includes("보고서") ||
        query.includes("리포트") ||
        query.includes("분석")
      ) {
        const searchTerm = query.replace(/보고서|리포트|분석/g, "").trim();
        prompt = `리포트 생성 요청
1. 주제: [${searchTerm}]
2. 기준 날짜: [${currentDate}]
3. 정보 범위: 미국 및 주요 관련 국가(예: 한국, 중국 등 주제와 관련된 국가)에서 [2번 기준 날짜] 당일 및 직전일(예: 4월 9일~10일)을 포함하여, 리포트 생성 시점까지 발표된 가장 최신 속보, 변경사항, 또는 예외 조치까지 반드시 포함하여 [1번 주제] 관련 뉴스를 검색 및 분석해주세요.
4. 핵심 요구사항:
* 주어진 **[1번 주제]**와 **[3번 정보 범위]**에 맞춰 최신 정보를 최소 30개의 기사를 검색하고 각 기사를 분석해주세요.
* 한국어와 영어로 검색을 병행하여 국내외 최신 정보를 모두 포함해주세요. 영어로는 "${searchTerm}" 관련 키워드를, 한국어로는 "${searchTerm}" 관련 키워드를 사용해 검색해주세요.
* 초기 발표 내용뿐만 아니라, 이에 대한 후속 조치, 수정 발표, 예외 적용, 유예 기간 부여 등 정책의 변경 가능성을 염두에 두고 관련 정보를 면밀히 검색해주세요.
* 만약 **기존에 발표된 내용과 상반되거나 이를 수정하는 중요한 최신 정보(예: 특정 조건 하 관세 유예 발표 등)**가 있다면, 이를 반드시 주요 내용으로 포함하고 명확히 기술해주세요.
* 한국 및 해외 정보를 국가별로 분리하지 말고, 주요 내용/이슈별로 통합하여 서술해주세요.
* 아래 지정된 **[양식]**을 엄격히 준수하여 리포트를 작성해주세요.
* 목차는 실제 검색된 내용을 바탕으로, 핵심 소주제를 중요도 순서대로 구체적으로 구성해주세요.
* 참고 링크에는 검색 및 참조된 실제 뉴스 기사를 최소 10개 이상 포함해주세요. (검색 시점 기준 유효한 URL)
* 모든 참고 링크에는 반드시 기사의 발행일을 함께 표시해주세요. (예: [2024-05-10] [뉴스 기사 제목/출처 및 실제 URL])
* 반드시 그라운딩 검색(Google Search) 결과를 기반으로 한 정확한 최신 정보만을 포함해 주세요.

[양식]
* 날짜: (요청한 기준 날짜: [${currentDate}])
    * id="report-date"
* 대제목: ([${searchTerm}] 관련 최신 동향 보고서 - [생성된 리포트의 핵심 내용을 함축하는 부제 자동 생성])
    * id="report-title"
* 요약: (리포트 전체 내용을 2~3문장으로 요약)
    * id="report-summary"
* 목차: 1.  [소주제 1 제목 - 실제 내용 기반 자동 생성]    
    2.  [소주제 2 제목 - 실제 내용 기반 자동 생성]    
    3.  [소주제 3 제목 - 실제 내용 기반 자동 생성]    
    4.  [소주제 4 제목 - 실제 내용 기반, 필요시 추가]    
    5.  [소주제 5 제목 - 실제 내용 기반, 필요시 추가]    
    6.  종합 정리 및 전망    
* [목차 1. 소주제 제목]   * [관련 뉴스 내용 분석 및 정리]   
        * [관련 상세 정보 및 뉴스]
* [목차 2. 소주제 제목]   * [관련 뉴스 내용 분석 및 정리] 
        * [관련 상세 정보 및 뉴스]
* [목차 3. 소주제 제목]   * [관련 뉴스 내용 분석 및 정리] 
        * [관련 상세 정보 및 뉴스]
* [목차 4. 소주제 제목]   * [관련 뉴스 내용 분석 및 정리]  
        * [관련 상세 정보 및 뉴스]
* [목차 5. 소주제 제목]   * [관련 뉴스 내용 분석 및 정리] 
        * [관련 상세 정보 및 뉴스]
* 종합 정리 및 전망: (리포트 내용을 종합하고 향후 전망 요약) 
* 참고 링크:   * [발행일자] [뉴스 기사 제목/출처 및 실제 URL] 
        * [발행일자] [뉴스 기사 제목/출처 및 실제 URL]    
        * [발행일자] [뉴스 기사 제목/출처 및 실제 URL]
        * [발행일자] [뉴스 기사 제목/출처 및 실제 URL]
        * [최소 10개 이상, 필요시 링크 추가]`;
      }
      // 일반 뉴스 요약 프롬프트
      else {
        prompt = `다음 키워드와 관련된 최근 뉴스를 조사하고 주요 내용을 요약해주세요: ${query}
        
        그라운딩 검색(Google Search)을 사용하여 해당 키워드에 대한 최신 뉴스와 정보를 검색해주세요.
        한국어와 영어로 두 가지 언어로 "${query}"를 검색하여 국내외 정보를 모두 포함해주세요.
        검색 결과는 최대한 최근 일주일 이내의 정보를 기준으로 정리해주세요.
        
        결과는 다음 형식으로 제공해주세요:
        1. 주요 뉴스 헤드라인 (5개)
        2. 핵심 내용 요약 (각 100자 이내)
        3. 전반적인 트렌드 분석
        4. 참고한 뉴스 출처 및 발행일 (최소 5개 이상)`;
      }

      console.log(prompt);

      // 그라운딩 기능 사용하여 검색 결과 생성
      // 제미나이 2.5-pro-exp 버전에서는 그라운딩 기능 자동 지원
      const generationConfig = {
        temperature: 0.2,
        maxOutputTokens: 8192,
      };

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
      });

      const text = result.response.text();
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
