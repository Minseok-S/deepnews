"use client";

import React from "react";
import { TableOfContents } from "./TableOfContents";

interface SearchResultsProps {
  results: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  // 마크다운 형식의 결과를 HTML로 변환하는 함수
  const formatContent = (content: string) => {
    // ID 표시 문자열을 추출하면서 HTML에는 적용하는 함수
    const extractId = (text: string) => {
      // 여러 ID 패턴 처리
      const idMatch =
        text.match(/ \(id="([^"]*)"\)/) ||
        text.match(/\*\*\(id="([^"]*)"\)\*\*/) ||
        text.match(/ id="([^"]*)"/) ||
        text.match(/ →\s*id="([^"]*)"/) ||
        text.match(/ →\s*id='([^']*)'/) ||
        text.match(/ →\s*id=([^ ]*)/);
      return idMatch ? idMatch[1] : "";
    };

    // ID 표시 문자열 제거 (전체 내용에서 공통 적용)
    let formattedContent = content
      .replace(/ \(id="[^"]*"\)/g, "") // (id="...") 패턴 제거
      .replace(/\*\*\(id="[^"]*"\)\*\*/g, "") // **(id="...")**
      .replace(/ \*\*\(id="[^"]*"\)\*\*/g, "") // **(id="...")**
      .replace(/\(id="[^"]*"\)/g, "") // 모든 (id="...") 패턴 제거
      .replace(/ →\s*id="[^"]*"/g, "") // → id="..."
      .replace(/ →\s*id='[^']*'/g, "") // → id='...'
      .replace(/ →\s*id=[^ ]*/g, "") // → id=... (따옴표 없는 경우)
      .replace(/\s*\* id="[^"]*"/g, "") // * id="..." 패턴 추가
      .replace(/ \(id=[^)]*\)/g, ""); // (id=...) 패턴 제거

    // 기본 형식 처리 (## ✅ 형식)
    if (content.includes("## ✅")) {
      // 원본 내용에서 주요 섹션 추출
      const headlinesSection = content.match(
        /### 주요 뉴스 헤드라인([\s\S]*?)(?=###|$)/
      );
      const summarySection = content.match(
        /### 핵심 내용 요약([\s\S]*?)(?=###|$)/
      );
      const trendSection = content.match(
        /### 전반적인 트렌드 분석([\s\S]*?)(?=###|$)/
      );

      formattedContent = formattedContent
        // 대제목 (h2) 처리
        .replace(/^## ✅ (.*)$/gm, (match, title) => {
          const id = extractId(match);
          return `<h2 ${
            id ? `id="${id}"` : ""
          } class="text-2xl font-bold text-blue-700 dark:text-blue-400 mt-8 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">${title}</h2>`;
        })

        // H3 섹션 처리 - 주요 섹션 헤더에 특별한 스타일 적용
        .replace(/^### ([^0-9\n][^\n]*)$/gm, (match, title) => {
          const id = extractId(match);

          // 특정 섹션에 대한 아이콘과 추가 스타일링
          if (title.includes("주요 뉴스 헤드라인")) {
            return `<h3 ${
              id ? `id="${id}"` : ""
            } class="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4 flex items-center">
                <span class="mr-2 text-blue-600 dark:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                  </svg>
                </span>
                ${title}
              </h3>`;
          } else if (title.includes("핵심 내용 요약")) {
            return `<h3 ${
              id ? `id="${id}"` : ""
            } class="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4 flex items-center">
                <span class="mr-2 text-blue-600 dark:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                  </svg>
                </span>
                ${title}
              </h3>`;
          } else if (title.includes("전반적인 트렌드 분석")) {
            return `<h3 ${
              id ? `id="${id}"` : ""
            } class="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4 flex items-center">
                <span class="mr-2 text-blue-600 dark:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941" />
                  </svg>
                </span>
                ${title}
              </h3>`;
          } else if (title.includes("참고 링크")) {
            return `<h3 ${
              id ? `id="${id}"` : ""
            } class="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4 flex items-center">
                <span class="mr-2 text-blue-600 dark:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  </svg>
                </span>
                ${title}
              </h3>`;
          }
          // 기본 H3 스타일
          return `<h3 ${
            id ? `id="${id}"` : ""
          } class="text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-3">${title}</h3>`;
        })

        // 숫자 목록 처리 (뉴스 헤드라인)
        .replace(/^([0-9]+)\.\s+(.*)$/gm, (match, num, content) => {
          const id = extractId(match);
          // 헤드라인 섹션 번호 목록은 더 눈에 띄게 처리
          if (headlinesSection && headlinesSection[0].includes(match)) {
            return `<div ${
              id ? `id="${id}"` : ""
            } class="flex mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg items-start hover:shadow-md transition-shadow">
                <span class="font-bold mr-3 mt-1 inline-flex items-center justify-center min-w-7 h-7 rounded-full bg-blue-500 dark:bg-blue-700 text-white">${num}</span>
                <span class="flex-1 font-medium">${content}</span>
              </div>`;
          }
          // 기본 번호 목록
          return `<div ${id ? `id="${id}"` : ""} class="flex mb-3 items-start">
              <span class="font-bold mr-3 mt-0.5 inline-flex items-center justify-center min-w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">${num}</span>
              <span>${content}</span>
            </div>`;
        })

        // 주요 내용 처리 (특별한 스타일링)
        .replace(/\*\*(.*?):\*\* (.*?)$/gm, (match, label, content) => {
          const id = extractId(match);
          // 핵심 내용 요약 섹션의 요약 항목은 더 눈에 띄게 처리
          if (summarySection && summarySection[0].includes(match)) {
            return `<div ${
              id ? `id="${id}"` : ""
            } class="mb-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <span class="font-bold text-blue-700 dark:text-blue-400 block mb-1">${label}:</span>
                <span class="block pl-1">${content}</span>
              </div>`;
          }
          // 기본 강조 블록
          return `<div ${
            id ? `id="${id}"` : ""
          } class="mb-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded">
              <span class="font-bold text-blue-700 dark:text-blue-400">${label}:</span> ${content}
            </div>`;
        })

        // 트렌드 분석 섹션 특별 처리
        .replace(/^(최근 일주일간.*?)$/gm, (match, content) => {
          const id = extractId(match);
          if (trendSection && trendSection[0].includes(match)) {
            return `<div ${
              id ? `id="${id}"` : ""
            } class="p-4 border-l-4 border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg my-4">
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">${content}</p>
              </div>`;
          }
          return `<p class="mb-3">${content}</p>`;
        })

        // 나머지 굵은 텍스트 처리
        .replace(
          /\*\*([^*]+)\*\*/g,
          '<span class="font-bold text-blue-700 dark:text-blue-300">$1</span>'
        )

        // 일반 글머리 기호 목록 처리
        .replace(/^\* ([^*].*?)$/gm, '<li class="ml-5 mb-3">$1</li>')

        // 구분선 처리
        .replace(
          /^---$/gm,
          '<hr class="my-8 border-t border-gray-300 dark:border-gray-700" />'
        );
    }

    // li 태그들을 ul로 감싸기
    formattedContent = formattedContent.replace(
      /(<li class="ml-5 mb-3">.*?<\/li>\n?)+/g,
      (match) =>
        `<ul class="list-disc space-y-2 mb-6 bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">${match}</ul>`
    );

    // 링크 처리 (모든 형식의 보고서에 공통 적용)
    formattedContent = formattedContent.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    return formattedContent;
  };

  // 검색 결과가 기본 뉴스 요약 형식인지 확인
  const isStructuredReport = results.includes("## ✅");

  // 구조화된 보고서인 경우 formatted HTML을 반환
  if (isStructuredReport) {
    const htmlContent = formatContent(results);

    // 주요 섹션 추출 (예: 참고 링크)
    const hasReferenceLinks =
      results.includes("## ✅ 참고 링크") || results.includes("참고 링크");

    return (
      <div className="space-y-6">
        <TableOfContents results={results} />

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 overflow-auto print:shadow-none transition-all duration-200 hover:shadow-xl border border-gray-100 dark:border-gray-700">
          <div
            className="prose dark:prose-invert max-w-none prose-headings:font-display prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {hasReferenceLinks && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center text-sm font-medium px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
                    />
                  </svg>
                  인쇄하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-3 border-gray-200 dark:border-gray-700">
        검색 결과
      </h2>
      <div className="prose dark:prose-invert max-w-none prose-p:leading-relaxed">
        {results.split("\n").map((line, index) => (
          <p key={index} className="mb-3 text-gray-700 dark:text-gray-300">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};
