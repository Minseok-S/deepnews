"use client";

import React from "react";

interface TableOfContentsProps {
  results: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  results,
}) => {
  // 목차 항목 추출
  const extractTOC = (content: string) => {
    const tocItems: { id: string; title: string }[] = [];

    // 새로운 형식 (ID 속성이 있는 목차 항목)
    let newFormatMatches = content.match(
      /목차:([\s\S]*?)(?:\n\* \[목차|\n\* [0-9]+\.|\n\* 종합|\n\n|$)/
    );

    // 목차: 단어로 시작하는 항목이 없으면 '* 목차:' 패턴도 검색
    if (!newFormatMatches) {
      newFormatMatches = content.match(
        /\* 목차:([\s\S]*?)(?:\n\* \[목차|\n\* [0-9]+\.|\n\* 종합|\n\n|$)/
      );
    }

    // '* **목차:**' 패턴도 검색
    if (!newFormatMatches) {
      newFormatMatches = content.match(
        /\* \*\*목차:\*\*([\s\S]*?)(?:\n\* \[목차|\n\* [0-9]+\.|\n\* 종합|\n\n|$)/
      );
    }

    if (newFormatMatches && newFormatMatches[1]) {
      const tocSection = newFormatMatches[1];

      // 목차 항목 찾기 (예: "1. [소주제 제목]")
      const itemMatches = Array.from(
        tocSection.matchAll(/([0-9]+)\.\s+\[([^\]]+)\]/g)
      );

      for (const match of itemMatches) {
        if (match[1] && match[2]) {
          tocItems.push({
            id: `section-${match[1]}`,
            title: `${match[1]}. ${match[2].trim()}`,
          });
        }
      }

      // 마지막 '종합 정리 및 전망' 항목 추가
      if (tocSection.includes("종합 정리 및 전망")) {
        tocItems.push({
          id: "section-final",
          title: "종합 정리 및 전망",
        });
      }
    }

    // 기존 형식 (목차 섹션이 지정된 경우)
    if (tocItems.length === 0) {
      const tocSection = content.match(/\* \*\*목차:\*\*([\s\S]*?)(?=\n---)/);

      if (tocSection && tocSection[1]) {
        // 목차 텍스트에서 제목과 ID 추출
        const matches = Array.from(
          tocSection[1].matchAll(/([0-9]+)\. (.*?) → id="([^"]*)"/g)
        );

        for (const match of matches) {
          if (match[2] && match[3]) {
            tocItems.push({
              id: match[3],
              title: `${match[1]}. ${match[2]}`,
            });
          }
        }
      }
    }

    // 섹션 ID로 직접 찾기 (section-1, section-2 등)
    if (tocItems.length === 0) {
      // 섹션 제목 찾기
      const sectionMatches = Array.from(
        content.matchAll(
          /\* \[목차 ([0-9]+)\. ([^\]]+)\][\s\S]*?id="(section-[0-9]+)"/g
        )
      );

      for (const match of sectionMatches) {
        if (match[1] && match[2] && match[3]) {
          tocItems.push({
            id: match[3],
            title: `${match[1]}. ${match[2].trim()}`,
          });
        }
      }

      // 번호 패턴으로 섹션 찾기 (별표 강조 스타일)
      const numberedSectionMatches = Array.from(
        content.matchAll(/\* \*\*([0-9]+)\. (.*?)\*\*/g)
      );

      for (const match of numberedSectionMatches) {
        if (match[1] && match[2]) {
          tocItems.push({
            id: `section-${match[1]}`,
            title: `${match[1]}. ${match[2].trim()}`,
          });
        }
      }

      // 번호 패턴으로 섹션 찾기 (별표 없는 스타일)
      const simpleSectionMatches = Array.from(
        content.matchAll(/\* ([0-9]+)\. (.*?)(?=\n)/g)
      );

      for (const match of simpleSectionMatches) {
        if (match[1] && match[2]) {
          tocItems.push({
            id: `section-${match[1]}`,
            title: `${match[1]}. ${match[2].trim()}`,
          });
        }
      }

      // 종합 정리 및 전망 섹션 찾기 (여러 패턴)
      const finalSectionMatch =
        content.match(/\* 종합 정리 및 전망:[\s\S]*?id="(section-final)"/) ||
        content.match(/\* \*\*종합 정리 및 전망\*\*/) ||
        content.match(/\* 종합 정리 및 전망:/);

      if (finalSectionMatch) {
        tocItems.push({
          id: "section-final",
          title: "종합 정리 및 전망",
        });
      }
    }

    return tocItems;
  };

  const tocItems = extractTOC(results);

  // 목차 항목이 없으면 렌더링하지 않음
  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl mb-6 sticky top-4 shadow-lg border border-gray-100 dark:border-gray-700">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white border-b pb-3 border-gray-200 dark:border-gray-700">
        목차
      </h3>
      <nav className="mt-3">
        <ul className="space-y-2">
          {tocItems.map((item, index) => (
            <li key={item.id} className="pl-1">
              <a
                href={`#${item.id}`}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 block py-2 px-3 rounded-lg transition-colors items-center gap-3"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.id);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {item.title.startsWith("종합") ? (
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                      <path
                        fillRule="evenodd"
                        d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold">
                    {item.title.split(".")[0]}
                  </span>
                )}
                <span className="flex-1">
                  {item.title.includes(".")
                    ? item.title.split(".").slice(1).join(".").trim()
                    : item.title}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
            />
          </svg>
          보고서 인쇄
        </button>
      </div>
    </div>
  );
};
