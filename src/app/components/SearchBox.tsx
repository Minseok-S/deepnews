"use client";

import React, { useState } from "react";

interface SearchBoxProps {
  onSearch: (query: string) => Promise<void>;
  isLoading: boolean;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isReportMode, setIsReportMode] = useState(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // 고급 모드에서는 검색어를 그대로 전달
    if (isAdvancedMode) {
      await onSearch(searchQuery);
      return;
    }

    // 보고서 모드가 활성화된 경우 검색어에 "보고서" 키워드 추가
    const finalQuery = isReportMode
      ? `${searchQuery} 상세 분석 보고서`
      : searchQuery;

    await onSearch(finalQuery);
  };

  const applyReportTemplate = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const reportTemplate = `리포트 생성 요청
1. 주제: [${searchQuery || "여기에 주제를 입력하세요"}]
2. 기준 날짜: [${currentDate}]
3. 정보 범위: 미국 및 주요 관련 국가(예: 한국, 중국 등 주제와 관련된 국가)에서 [2번 기준 날짜] 당일 및 직전일(예: 4월 9일~10일)을 포함하여, 리포트 생성 시점까지 발표된 가장 최신 속보, 변경사항, 또는 예외 조치까지 반드시 포함하여 [1번 주제] 관련 뉴스를 검색 및 분석해주세요.
4. 핵심 요구사항:
* 주어진 **[1번 주제]**와 **[3번 정보 범위]**에 맞춰 최신 정보를 최소 30개의 기사를 검색하고 각 기사를 분석해주세요.
* 초기 발표 내용뿐만 아니라, 이에 대한 후속 조치, 수정 발표, 예외 적용, 유예 기간 부여 등 정책의 변경 가능성을 염두에 두고 관련 정보를 면밀히 검색해주세요.
* 만약 **기존에 발표된 내용과 상반되거나 이를 수정하는 중요한 최신 정보(예: 특정 조건 하 관세 유예 발표 등)**가 있다면, 이를 반드시 주요 내용으로 포함하고 명확히 기술해주세요.
* 한국 및 해외 정보를 국가별로 분리하지 말고, 주요 내용/이슈별로 통합하여 서술해주세요.
* 아래 지정된 **[양식]**을 엄격히 준수하여 리포트를 작성해주세요.
* 목차는 실제 검색된 내용을 바탕으로, 핵심 소주제를 중요도 순서대로 구체적으로 구성해주세요.
* 참고 링크에는 검색 및 참조된 실제 뉴스 기사 또는 유튜브 영상 링크를 최소 5개 이상 포함해주세요. (검색 시점 기준 유효한 URL)
* 보고서의 주요 섹션들에 적용할 수 있도록, 각 항목별 id 속성 이름 목록을 반드시 포함해주세요.

[양식]
* 날짜: (요청한 기준 날짜: [${currentDate}])
    * id="report-date"
* 대제목: ([${
      searchQuery || "주제"
    }] 관련 최신 동향 보고서 - [생성된 리포트의 핵심 내용을 함축하는 부제 자동 생성])
    * id="report-title"
* 요약: (리포트 전체 내용을 2~3문장으로 요약)
    * id="report-summary"
* 목차: 1.  [소주제 1 제목 - 실제 내용 기반 자동 생성]     * id="toc-item-1" 2.  [소주제 2 제목 - 실제 내용 기반 자동 생성]     * id="toc-item-2" 3.  [소주제 3 제목 - 실제 내용 기반 자동 생성]     * id="toc-item-3" 4.  [소주제 4 제목 - 실제 내용 기반, 필요시 추가]     * id="toc-item-4" 5.  [소주제 5 제목 - 실제 내용 기반, 필요시 추가]     * id="toc-item-5" 6.  종합 정리 및 전망     * id="toc-item-summary"
* [목차 1. 소주제 제목]   * [관련 뉴스 및 유튜브 내용 분석 및 정리]   * id="section-1"
        * [관련 상세 정보 및 뉴스]
        * id="content-1"
* [목차 2. 소주제 제목]   * [관련 뉴스 및 유튜브 내용 분석 및 정리]   * id="section-2"
        * [관련 상세 정보 및 뉴스]
        * id="content-2"
* [목차 3. 소주제 제목]   * [관련 뉴스 및 유튜브 내용 분석 및 정리]   * id="section-3"
        * [관련 상세 정보 및 뉴스]
        * id="content-3"
* [목차 4. 소주제 제목]   * [관련 뉴스 및 유튜브 내용 분석 및 정리]   * id="section-4"
        * [관련 상세 정보 및 뉴스]
        * id="content-4"
* [목차 5. 소주제 제목]   * [관련 뉴스 및 유튜브 내용 분석 및 정리]   * id="section-5"
        * [관련 상세 정보 및 뉴스]
        * id="content-5"
* 종합 정리 및 전망: (리포트 내용을 종합하고 향후 전망 요약)   * id="section-final"
* 참고 링크:   
        * [뉴스 기사 제목/출처 및 실제 URL]     * id="reference-link-1"   
        * [뉴스 기사 제목/출처 및 실제 URL]     * id="reference-link-2"   
        * [뉴스 기사 제목/출처 및 실제 URL]     * id="reference-link-3"  
        * [뉴스 기사 제목/출처 및 실제 URL]     * id="reference-link-4"
        * [최소 5개 이상, 필요시 링크 추가]     * id="reference-link-5"`;

    setSearchQuery(reportTemplate);
    setIsAdvancedMode(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        뉴스 검색
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isAdvancedMode ? (
          <textarea
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="리포트 생성 요청 또는 검색어를 입력하세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[300px] font-mono text-sm"
            required
          />
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="검색어를 입력하세요 (예: 인공지능, 경제, 기후변화)"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4">
            {!isAdvancedMode && (
              <>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="report-mode"
                    checked={isReportMode}
                    onChange={(e) => {
                      setIsReportMode(e.target.checked);
                    }}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="report-mode"
                    className="text-sm text-gray-600 dark:text-gray-300"
                  >
                    상세 보고서 형식
                  </label>
                </div>
              </>
            )}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="advanced-mode"
                checked={isAdvancedMode}
                onChange={(e) => setIsAdvancedMode(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor="advanced-mode"
                className="text-sm text-gray-600 dark:text-gray-300"
              >
                고급 모드
              </label>
            </div>
          </div>

          {isAdvancedMode && (
            <button
              type="button"
              onClick={applyReportTemplate}
              className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
              disabled={isLoading}
            >
              리포트 템플릿 적용
            </button>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {isAdvancedMode
              ? "리포트 양식에 맞게 텍스트를 직접 작성하거나 수정하세요. 템플릿을 적용한 후 주제를 변경할 수 있습니다."
              : isReportMode
              ? "검색어를 입력하면 관련 뉴스를 검색하고 상세 분석 보고서를 생성합니다."
              : "검색어를 입력하면 관련 뉴스를 검색하고 주요 내용을 요약합니다."}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50"
          >
            {isLoading ? "검색 중..." : "검색"}
          </button>
        </div>
      </form>
    </div>
  );
};
