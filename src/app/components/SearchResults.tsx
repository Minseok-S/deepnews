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
        text.match(/ →\s*id=([^ ]*)/) ||
        text.match(/→ id="([^"]*)"$/) ||
        text.match(/→id="([^"]*)"$/) ||
        text.match(/→ id="([^"]*)"/) ||
        text.match(/→id="([^"]*)"/) ||
        text.match(/→ id='([^']*)'/) ||
        text.match(/→id='([^']*)'/) ||
        text.match(/→ id=([^ ]*)/) ||
        text.match(/→id=([^ ]*)/) ||
        text.match(/→ id="([^"]*)"$/) ||
        text.match(/→id="([^"]*)"$/);
      return idMatch ? idMatch[1] : "";
    };

    // 텍스트 전처리 함수 - ID 패턴을 제거하고 정제된 텍스트 반환
    const preprocessText = (rawText: string) => {
      // 줄 단위로 처리
      return rawText
        .split("\n")
        .map((line) => {
          // ID 패턴이 포함된 줄 처리
          if (
            line.includes("id=") ||
            line.includes("→") ||
            line.includes("(id") ||
            line.match(/ → id="[^"]*"$/) ||
            line.match(/→ id="[^"]*"$/) ||
            line.match(/ →id="[^"]*"$/) ||
            line.match(/→id="[^"]*"$/)
          ) {
            // 모든 ID 패턴 제거
            return line
              .replace(/ \(id="[^"]*"\)/g, "") // (id="...")
              .replace(/\*\*\(id="[^"]*"\)\*\*/g, "") // **(id="...")**
              .replace(/\(id="[^"]*"\)/g, "") // (id="...")
              .replace(/ → id="[^"]*"/g, "") // → id="..."
              .replace(/→ id="[^"]*"/g, "") // →id="..."
              .replace(/ →id="[^"]*"/g, "") // → id="..."
              .replace(/→id="[^"]*"/g, "") // →id="..."
              .replace(/ → id='[^']*'/g, "") // → id='...'
              .replace(/→ id='[^']*'/g, "") // →id='...'
              .replace(/ →id='[^']*'/g, "") // → id='...'
              .replace(/→id='[^']*'/g, "") // →id='...'
              .replace(/ → id=[^ \n]*/g, "") // → id=...
              .replace(/→ id=[^ \n]*/g, "") // →id=...
              .replace(/ →id=[^ \n]*/g, "") // → id=...
              .replace(/→id=[^ \n]*/g, ""); // →id=...
          }
          return line;
        })
        .join("\n");
    };

    // 전처리된 내용
    const preprocessedContent = preprocessText(content);

    // ID 표시 문자열 제거 (전체 내용에서 공통 적용)
    let formattedContent = preprocessedContent
      // 모든 ID 태그 패턴 제거
      .replace(/ \(id="[^"]*"\)/g, "") // (id="...") 패턴 제거
      .replace(/\*\*\(id="[^"]*"\)\*\*/g, "") // **(id="...")**
      .replace(/ \*\*\(id="[^"]*"\)\*\*/g, "") // **(id="...")**
      .replace(/\(id="[^"]*"\)/g, "") // 모든 (id="...") 패턴 제거
      .replace(/ →\s*id="[^"]*"/g, "") // → id="..."
      .replace(/→\s*id="[^"]*"/g, "") // →id="..." (공백 없는 경우)
      .replace(/ →\s*id='[^']*'/g, "") // → id='...'
      .replace(/→\s*id='[^']*'/g, "") // →id='...' (공백 없는 경우)
      .replace(/ →\s*id=[^ ]*/g, "") // → id=... (따옴표 없는 경우)
      .replace(/→\s*id=[^ ]*/g, "") // →id=... (공백 없는 경우)
      .replace(/\s*\* id="[^"]*"/g, "") // * id="..." 패턴 추가
      .replace(/ \(id=[^)]*\)/g, "") // (id=...) 패턴 제거
      // 모든 줄 끝 ID 패턴 처리
      .replace(/ → id="[^"]*"$/gm, "") // 줄 끝의 → id="..."
      .replace(/→ id="[^"]*"$/gm, "") // 줄 끝의 →id="..."
      .replace(/ →id="[^"]*"$/gm, "") // 줄 끝의 → id="..."
      .replace(/→id="[^"]*"$/gm, ""); // 줄 끝의 →id="..."

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
          } class="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-400 mt-6 sm:mt-8 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-200 dark:border-gray-700">${title}</h2>`;
        })

        // H3 섹션 처리 - 주요 섹션 헤더에 특별한 스타일 적용
        .replace(/^### ([^0-9\n][^\n]*)$/gm, (match, title) => {
          const id = extractId(match);

          // 특정 섹션에 대한 아이콘과 추가 스타일링
          if (title.includes("주요 뉴스 헤드라인")) {
            return `<h3 ${
              id ? `id="${id}"` : ""
            } class="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 sm:mt-8 mb-3 sm:mb-4 flex items-center">
                <span class="mr-2 text-blue-600 dark:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 sm:w-6 sm:h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                  </svg>
                </span>
                ${title}
              </h3>`;
          } else if (title.includes("핵심 내용 요약")) {
            return `<h3 ${
              id ? `id="${id}"` : ""
            } class="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 sm:mt-8 mb-3 sm:mb-4 flex items-center">
                <span class="mr-2 text-blue-600 dark:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 sm:w-6 sm:h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                  </svg>
                </span>
                ${title}
              </h3>`;
          } else if (title.includes("전반적인 트렌드 분석")) {
            return `<h3 ${
              id ? `id="${id}"` : ""
            } class="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 sm:mt-8 mb-3 sm:mb-4 flex items-center">
                <span class="mr-2 text-blue-600 dark:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 sm:w-6 sm:h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941" />
                  </svg>
                </span>
                ${title}
              </h3>`;
          }
          // 기본 H3 스타일
          return `<h3 ${
            id ? `id="${id}"` : ""
          } class="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mt-4 sm:mt-6 mb-2 sm:mb-3">${title}</h3>`;
        })

        // 숫자 목록 처리 (뉴스 헤드라인)
        .replace(/^([0-9]+)\.\s+(.*)$/gm, (match, num, content) => {
          const id = extractId(match);
          // 헤드라인 섹션 번호 목록은 더 눈에 띄게 처리
          if (headlinesSection && headlinesSection[0].includes(match)) {
            return `<div ${
              id ? `id="${id}"` : ""
            } class="flex mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg items-start hover:shadow-md transition-shadow">
                <span class="font-bold mr-2 sm:mr-3 mt-0.5 sm:mt-1 inline-flex items-center justify-center min-w-6 h-6 sm:min-w-7 sm:h-7 rounded-full bg-blue-500 dark:bg-blue-700 text-white text-xs sm:text-sm">${num}</span>
                <span class="flex-1 font-medium text-sm sm:text-base">${content}</span>
              </div>`;
          }
          // 기본 번호 목록
          return `<div ${
            id ? `id="${id}"` : ""
          } class="flex mb-2 sm:mb-3 items-start">
              <span class="font-bold mr-2 sm:mr-3 mt-0.5 inline-flex items-center justify-center min-w-5 h-5 sm:min-w-6 sm:h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs sm:text-sm">${num}</span>
              <span class="text-sm sm:text-base">${content}</span>
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
          // trend-analysis ID를 가진 경우 트렌드 분석 스타일 적용
          if (
            id === "trend-analysis" ||
            (match.includes("→") && match.includes("trend-analysis"))
          ) {
            return `<div id="trend-analysis" class="mb-4 p-4 border-l-4 border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
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

        // 트렌드 분석 섹션 전체를 감싸는 컨테이너 추가
        .replace(
          /<h3([^>]*)>([^<]*전반적인 트렌드 분석[^<]*)<\/h3>([\s\S]*?)(?=<h3|$)/g,
          (match, attrs, title, content) => {
            // ID 태그만 있는 줄 제거 (더 강력한 패턴)
            let processedContent = content
              .replace(/<p[^>]*>[^<]*→\s*id="[^"]*"[^<]*<\/p>\s*/m, "")
              .replace(/<p[^>]*>\s*\(id="[^"]*"\)\s*<\/p>\s*/m, "");

            // 트렌드 분석 텍스트 내용을 추출
            const paragraphs = [];
            if (trendSection) {
              // ID 및 불필요한 태그 제거 후 단락으로 분리
              const cleanContent = trendSection[0]
                .replace(/### 전반적인 트렌드 분석[\s\n]*/g, "")
                .replace(/→\s*id="[^"]*"[\s\n]*/g, "")
                .replace(/\(id="[^"]*"\)[\s\n]*/g, "")
                .trim();

              // 여러 구분자로 단락 분리
              const splitParagraphs: string[] = [];

              // 우선 빈 줄과 ₩ 문자로 분리
              const initialSplit = cleanContent
                .split(/\n\s*\n|\n₩\n|\n\s*₩\s*\n/)
                .map((p) => p.trim());

              // 각 부분에서 단일 ₩ 문자로도 추가 분리
              initialSplit.forEach((part) => {
                if (part.includes("₩")) {
                  // ₩ 문자로 추가 분리
                  splitParagraphs.push(...part.split(/₩/).map((p) => p.trim()));
                } else {
                  splitParagraphs.push(part);
                }
              });

              // 글머리 기호 제거 및 빈 줄 필터링
              paragraphs.push(
                ...splitParagraphs
                  .map((p) => p.replace(/^\s*\*\s*/, "")) // 글머리 기호(*) 제거
                  .filter((p) => p.trim())
              );
            }

            // 단락이 있으면 스타일 적용
            if (paragraphs.length > 0) {
              const colorClasses = [
                "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20",
                "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/20",
                "border-purple-500 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20",
                "border-amber-500 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20",
              ];

              processedContent = '<div class="space-y-4 my-4">';
              paragraphs.forEach((para, index) => {
                if (para.trim()) {
                  const colorClass = colorClasses[index % colorClasses.length];
                  processedContent += `
                    <div class="p-4 border-l-4 ${colorClass} rounded-r-lg">
                      <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">${para}</p>
                    </div>`;
                }
              });
              processedContent += "</div>";
            }

            return `<h3${attrs}>${title}</h3>
              <div class="bg-gray-50 dark:bg-gray-900/30 rounded-xl p-4 mb-6">
                ${processedContent}
              </div>`;
          }
        )

        // 나머지 굵은 텍스트 처리
        .replace(
          /\*\*([^*]+)\*\*/g,
          '<span class="font-bold text-blue-700 dark:text-blue-300">$1</span>'
        )

        // 일반 글머리 기호 목록 처리
        .replace(/^\* ([^*].*?)$/gm, (match, content) => {
          const id = extractId(match);
          // ID가 있는 경우 활용
          const idAttr = id ? `id="${id}"` : "";

          // 트렌드 분석 ID가 포함된 경우 특별 스타일 적용
          if (id === "trend-analysis" || match.includes("trend-analysis")) {
            return `<li ${idAttr} class="ml-5 mb-3 p-3 border-l-4 border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg">${content}</li>`;
          }

          return `<li ${idAttr} class="ml-5 mb-3">${content}</li>`;
        })

        // 구분선 처리
        .replace(
          /^---$/gm,
          '<hr class="my-8 border-t border-gray-300 dark:border-gray-700" />'
        );
    }

    // li 태그들을 ul로 감싸기
    formattedContent = formattedContent.replace(
      /(<li class="ml-5 mb-3.*?<\/li>\n?)+/g,
      (match) =>
        `<ul class="list-disc space-y-2 mb-6 bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">${match}</ul>`
    );

    // 트렌드 분석 ID가 있지만 다른 패턴의 경우 처리
    formattedContent = formattedContent.replace(
      /([^>]+)→ id="trend-analysis"([^<]*)/g,
      `<div id="trend-analysis" class="p-4 border-l-4 border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg my-4">
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">$1$2</p>
      </div>`
    );

    formattedContent = formattedContent.replace(
      /([^>]+)→id="trend-analysis"([^<]*)/g,
      `<div id="trend-analysis" class="p-4 border-l-4 border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg my-4">
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">$1$2</p>
      </div>`
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

    return (
      <div className="space-y-6">
        <TableOfContents results={results} />

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 overflow-auto print:shadow-none transition-all duration-200 hover:shadow-xl border border-gray-100 dark:border-gray-700">
          <div
            className="prose dark:prose-invert max-w-none prose-headings:font-display prose-p:leading-relaxed prose-p:text-justify"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-3 sm:mb-6">
      <div className="prose prose-blue dark:prose-invert prose-sm sm:prose-base max-w-none">
        <div
          className="text-gray-800 dark:text-gray-200 text-sm sm:text-base"
          dangerouslySetInnerHTML={{ __html: formatContent(results) }}
        />
      </div>
    </div>
  );
};
