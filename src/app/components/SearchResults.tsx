"use client";

import React from "react";
import { TableOfContents } from "./TableOfContents";

interface SearchResultsProps {
  results: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  // 마크다운 형식의 결과를 HTML로 변환하는 함수
  const formatContent = (content: string) => {
    // 구조화된 보고서 형식 파싱 및 스타일링
    let formattedContent = content;

    // 새로운 리포트 형식을 처리 (section-1, toc-item-1 등의 ID 포맷)
    if (content.includes('id="section-') || content.includes('id="toc-item-')) {
      formattedContent = formattedContent
        // 날짜 처리
        .replace(
          /\* 날짜:[^]*?id="report-date"/g,
          '<div class="text-sm text-gray-500 dark:text-gray-400 mb-3" id="report-date">$&</div>'
        )

        // 대제목 처리
        .replace(
          /\* 대제목:[^]*?\[(.*?)\][^]*?id="report-title"/g,
          '<h1 class="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700" id="report-title">$1</h1>'
        )

        // 요약 처리
        .replace(
          /\* 요약:[^]*?id="report-summary"/g,
          '<div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-8 shadow-sm text-gray-700 dark:text-gray-300" id="report-summary">$&</div>'
        )

        // 목차 타이틀 숨기기 (TableOfContents 컴포넌트에서 표시)
        .replace(
          /\* 목차:[^]*?id="toc-item-summary"/g,
          '<div class="hidden">$&</div>'
        )

        // 섹션 제목 처리 (section-1, section-2 등)
        .replace(
          /\* \[목차 ([0-9]+)\. ([^\]]+)\][^]*?id="(section-[0-9]+)"/g,
          '<h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4 pt-6 border-t border-gray-200 dark:border-gray-700" id="$3">$1. $2</h2>'
        )

        // 섹션 내용 처리 (content-1, content-2 등)
        .replace(
          /\* \[관련 상세 정보 및 뉴스\][^]*?id="(content-[0-9]+)"/g,
          '<div class="ml-5 text-gray-700 dark:text-gray-300 mb-6" id="$1">$&</div>'
        )

        // '종합 정리 및 전망' 처리
        .replace(
          /\* 종합 정리 및 전망:[^]*?id="section-final"/g,
          '<h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4 pt-6 border-t border-gray-200 dark:border-gray-700" id="section-final">종합 정리 및 전망</h2>'
        )

        // 참고 링크 처리
        .replace(
          /\* 참고 링크:[^]*/g,
          '<div class="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700"><h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">참고 링크</h3>$&</div>'
        )

        // 참고 링크 항목 처리
        .replace(
          /\* \[([^\]]+)\][^]*?id="(reference-link-[0-9]+)"/g,
          '<div class="ml-5 mb-3 text-blue-600 dark:text-blue-400" id="$2">• $1</div>'
        )

        // 글머리 기호 목록 처리
        .replace(/\* ([^*\[].+?)$/gm, '<li class="ml-6 mb-3">$1</li>')

        // 강조 표시 처리
        .replace(
          /\*\*([^*]+)\*\*/g,
          '<span class="font-bold text-blue-700 dark:text-blue-300">$1</span>'
        )

        // 이스케이프된 URL 복원
        .replace(
          /`(https?:\/\/[^`]+)`/g,
          '<a href="$1" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
        );
    }
    // 기존 형식 처리 (## ✅ 형식)
    else if (content.includes("## ✅")) {
      formattedContent = formattedContent
        // 대제목 (h2) 처리
        .replace(
          /^## ✅ \[(.*?)\](.*?)→ id="([^"]*)"/gm,
          '<h2 id="$3" class="text-2xl font-bold text-blue-700 dark:text-blue-400 mt-8 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">$1</h2>'
        )

        // H3 섹션 처리 (목차 항목과 연결)
        .replace(
          /^### ([0-9]+)\. (.*?)$/gm,
          (match, num, title) =>
            `<h3 id="report-toc-content${
              parseInt(num) - 1
            }" class="text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-3">
              <span class="mr-2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">${num}</span>${title}
            </h3>`
        )

        // 일반 H3 섹션 처리
        .replace(
          /^### (.*?)$/gm,
          '<h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-3">$1</h3>'
        )

        // 강조 표시 처리
        .replace(
          /\*\*(.*?)\*\*/g,
          '<span class="font-bold text-blue-700 dark:text-blue-300">$1</span>'
        )

        // ID 속성을 보존하면서 내용 스타일링
        .replace(
          /\* \*\*(.*?):\*\* (.*?) → id="([^"]*)"/g,
          '<div id="$3" class="mb-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded"><span class="font-bold text-blue-700 dark:text-blue-400">$1:</span> $2</div>'
        )

        // ID 없는 항목 처리
        .replace(
          /\* \*\*(.*?):\*\* (.*?)$/gm,
          '<div class="mb-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded"><span class="font-bold text-blue-700 dark:text-blue-400">$1:</span> $2</div>'
        )

        // 일반 글머리 기호 목록 처리
        .replace(/^\* ([^*].*?)$/gm, '<li class="ml-5 mb-3">$1</li>')

        // 숫자 목록 처리 (TOC 항목이 아닌 경우)
        .replace(
          /^([0-9]+)\. ((?!.*?→ id=").*)$/gm,
          '<div class="flex mb-3 items-start"><span class="font-bold mr-3 mt-0.5 inline-flex items-center justify-center min-w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">$1</span><span>$2</span></div>'
        )

        // 목차 항목 처리 (ID 속성 유지)
        .replace(
          /^([0-9]+)\. (.*?) → id="([^"]*)"/gm,
          '<div id="$3" class="flex mb-3 items-start"><span class="font-bold mr-3 mt-0.5 inline-flex items-center justify-center min-w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">$1</span><span>$2</span></div>'
        )

        // 구분선 처리
        .replace(
          /^---$/gm,
          '<hr class="my-8 border-t border-gray-300 dark:border-gray-700" />'
        );
    }

    // li 태그들을 ul로 감싸기
    formattedContent = formattedContent.replace(
      /(<li class="ml-[456] mb-[23]">.*?<\/li>\n?)+/g,
      (match) =>
        `<ul class="list-disc space-y-2 mb-6 bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">${match}</ul>`
    );

    // 참고 링크 섹션 처리
    formattedContent = formattedContent.replace(
      /## ✅ 참고 링크(.*?)id="reference-links"/,
      '<h2 id="reference-links" class="text-2xl font-bold text-blue-700 dark:text-blue-400 mt-10 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">참고 링크</h2>'
    );

    // 링크 처리
    formattedContent = formattedContent.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    return formattedContent;
  };

  // 검색 결과가 복잡한 구조화된 형식인지 확인 (다양한 형식 지원)
  const isStructuredReport =
    results.includes("## ✅") ||
    results.includes('id="report-') ||
    results.includes('id="section-') ||
    results.includes('id="toc-item-');

  // 특정 형식을 가진 구조화된 보고서인 경우 formatted HTML을 반환
  if (isStructuredReport) {
    const htmlContent = formatContent(results);

    return (
      <div className="space-y-6">
        <TableOfContents results={results} />

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 overflow-auto print:shadow-none transition-all duration-200 hover:shadow-xl border border-gray-100 dark:border-gray-700">
          <div
            className="prose dark:prose-invert max-w-none prose-headings:font-display prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </div>
    );
  }

  // 일반 텍스트 형식인 경우 줄바꿈 처리만 하여 표시
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
