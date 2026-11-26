import { BellRing, Grid2X2, Search, ShieldAlert, Sparkles, X } from 'lucide-react';
import type { FeedbackPatternMeta, PatternCategory, PatternId } from '../../data/feedbackPatterns';

interface SidebarProps {
  patterns: FeedbackPatternMeta[];
  totalCount: number;
  selectedId: PatternId;
  onSelect: (id: PatternId) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeCategory: PatternCategory | '전체';
  onCategoryChange: (category: PatternCategory | '전체') => void;
  onOpenMatrix: () => void;
  onCloseMobileDrawer?: () => void;
}

const CATEGORIES: Array<PatternCategory | '전체'> = ['전체', '일시적', '지속형', '차단형', '맥락형'];

export function Sidebar({
  patterns,
  totalCount,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  onOpenMatrix,
  onCloseMobileDrawer,
}: SidebarProps) {
  const handleSelect = (id: PatternId) => {
    onSelect(id);
    onCloseMobileDrawer?.();
  };

  return (
    <aside className="flex h-full w-full flex-col border-r border-[#E5E8EB] bg-white">
      {/* Brand Header */}
      <div className="border-b border-[#F2F4F6] px-5 pb-4 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#3182F6] text-white shadow-[0_6px_16px_rgba(49,130,246,0.28)]">
            <BellRing className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="truncate text-[15px] font-bold tracking-tight text-[#191F28]">
                Feedback Studio
              </h1>
              <span className="rounded-md bg-[#E8F3FF] px-1.5 py-0.5 text-[10px] font-bold text-[#3182F6]">
                09
              </span>
            </div>
            <p className="truncate text-xs text-[#8B95A1]">알림·피드백 UI/UX 패턴 라이브러리</p>
          </div>
        </div>

        {/* Search Box */}
        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B95A1]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="패턴 이름, 용도, 영문명 검색..."
            aria-label="패턴 검색"
            className="w-full rounded-xl border border-transparent bg-[#F2F4F6] py-2 pl-9 pr-8 text-[13px] font-medium text-[#191F28] placeholder:text-[#8B95A1] focus:border-[#3182F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3182F6]/15"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="검색어 지우기"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-[#8B95A1] hover:bg-[#E5E8EB] hover:text-[#333D4B]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="mt-3 flex flex-wrap gap-1.5" role="tablist" aria-label="카테고리 필터">
          {CATEGORIES.map((category) => {
            const active = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onCategoryChange(category)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  active
                    ? 'bg-[#191F28] text-white shadow-xs'
                    : 'bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pattern Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="9가지 피드백 패턴">
        <div className="mb-2 flex items-center justify-between px-2 text-[11px] font-semibold text-[#8B95A1]">
          <span>패턴 목록</span>
          <span>
            {patterns.length} / {totalCount}
          </span>
        </div>

        {patterns.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-[#F9FAFB] p-5 text-center">
            <Sparkles className="mx-auto mb-2 h-5 w-5 text-[#8B95A1]" />
            <p className="text-xs font-semibold text-[#4E5968]">일치하는 패턴이 없어요</p>
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                onCategoryChange('전체');
              }}
              className="mt-3 rounded-xl bg-[#E8F3FF] px-3 py-1.5 text-xs font-bold text-[#3182F6] hover:bg-[#D5E7FF]"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <ul className="space-y-1">
            {patterns.map((pattern) => {
              const isSelected = pattern.id === selectedId;
              return (
                <li key={pattern.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(pattern.id)}
                    aria-current={isSelected ? 'page' : undefined}
                    className={`group relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all duration-150 ${
                      isSelected
                        ? 'bg-[#E8F3FF] text-[#191F28]'
                        : 'text-[#333D4B] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#3182F6]" />
                    )}

                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold tabular-nums transition-colors ${
                        isSelected
                          ? 'bg-[#3182F6] text-white'
                          : 'bg-[#F2F4F6] text-[#4E5968] group-hover:bg-[#E5E8EB]'
                      }`}
                    >
                      {pattern.number}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <span
                          className={`truncate text-[13.5px] ${
                            isSelected ? 'font-bold text-[#1B64DA]' : 'font-semibold text-[#191F28]'
                          }`}
                        >
                          {pattern.name}
                        </span>
                        {pattern.blocking && (
                          <span
                            title="사용자 화면 조작을 차단하는 패턴"
                            className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-[#FFF4E5] px-1.5 py-0.5 text-[10px] font-semibold text-[#D97706]"
                          >
                            <ShieldAlert className="h-2.5 w-2.5" />
                            차단
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[11px] font-medium text-[#8B95A1]">
                        {pattern.englishName} · {pattern.category}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </nav>

      {/* Footer Quick Comparison Matrix Trigger */}
      <div className="border-t border-[#F2F4F6] p-3">
        <button
          type="button"
          onClick={onOpenMatrix}
          className="flex w-full items-center justify-between rounded-2xl bg-[#F9FAFB] px-3.5 py-3 text-left transition hover:bg-[#E8F3FF] group"
        >
          <div>
            <p className="text-xs font-bold text-[#191F28] group-hover:text-[#3182F6]">
              패턴 선택 가이드 매트릭스
            </p>
            <p className="mt-0.5 text-[11px] text-[#8B95A1]">긴급도·차단 여부 한눈에 비교</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#4E5968] shadow-xs group-hover:text-[#3182F6]">
            <Grid2X2 className="h-4 w-4" />
          </div>
        </button>
      </div>
    </aside>
  );
}
