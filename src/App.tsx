import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Code2,
  Eye,
  LayoutPanelLeft,
  MapPin,
  Menu,
  ShieldCheck,
  X,
  XCircle,
} from 'lucide-react';
import {
  FEEDBACK_PATTERNS,
  type PatternCategory,
  type PatternId,
} from './data/feedbackPatterns';
import { Sidebar } from './components/layout/Sidebar';
import { ComparisonMatrixModal } from './components/layout/ComparisonMatrixModal';
import { MobileFrame, type ViewportMode } from './components/preview/MobileFrame';
import { CodeViewer } from './components/code/CodeViewer';
import { ToastDemo } from './components/demos/ToastDemo';
import { SnackbarDemo } from './components/demos/SnackbarDemo';
import { BannerDemo } from './components/demos/BannerDemo';
import { ModalDemo } from './components/demos/ModalDemo';
import { BottomSheetDemo } from './components/demos/BottomSheetDemo';
import { InlineErrorDemo } from './components/demos/InlineErrorDemo';
import { TooltipDemo } from './components/demos/TooltipDemo';
import { CoachMarkDemo } from './components/demos/CoachMarkDemo';
import { BadgeDemo } from './components/demos/BadgeDemo';

function renderPatternDemo(id: PatternId) {
  switch (id) {
    case 'toast':
      return <ToastDemo />;
    case 'snackbar':
      return <SnackbarDemo />;
    case 'banner':
      return <BannerDemo />;
    case 'modal':
      return <ModalDemo />;
    case 'bottom-sheet':
      return <BottomSheetDemo />;
    case 'inline-error':
      return <InlineErrorDemo />;
    case 'tooltip':
      return <TooltipDemo />;
    case 'coach-mark':
      return <CoachMarkDemo />;
    case 'badge':
      return <BadgeDemo />;
  }
}

function getInitialPatternId(): PatternId {
  if (typeof window === 'undefined') return 'toast';
  const hashId = window.location.hash.replace(/^#/, '') as PatternId;
  return FEEDBACK_PATTERNS.some((p) => p.id === hashId) ? hashId : 'toast';
}

export function App() {
  const [selectedId, setSelectedId] = useState<PatternId>(getInitialPatternId);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<PatternCategory | '전체'>('전체');
  const [viewport, setViewport] = useState<ViewportMode>('mobile');
  const [resetSeed, setResetSeed] = useState(0);
  const [mobilePane, setMobilePane] = useState<'preview' | 'code'>('preview');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [matrixOpen, setMatrixOpen] = useState(false);

  useEffect(() => {
    const syncFromHash = () => {
      const hashId = window.location.hash.replace(/^#/, '') as PatternId;
      if (FEEDBACK_PATTERNS.some((p) => p.id === hashId)) {
        setSelectedId(hashId);
      }
    };
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const filteredPatterns = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return FEEDBACK_PATTERNS.filter((pattern) => {
      const matchesCategory =
        activeCategory === '전체' || pattern.category === activeCategory;
      if (!matchesCategory) return false;
      if (!query) return true;

      const haystack = [
        pattern.number,
        pattern.name,
        pattern.englishName,
        pattern.tagline,
        ...pattern.keywords,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [searchQuery, activeCategory]);

  const activePattern =
    FEEDBACK_PATTERNS.find((p) => p.id === selectedId) ?? FEEDBACK_PATTERNS[0];

  const handleSelectPattern = (id: PatternId) => {
    setSelectedId(id);
    setResetSeed((s) => s + 1);
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F2F4F6] text-[#191F28]">
      {/* Mobile / Tablet Top Bar (< lg) */}
      <header className="flex items-center justify-between border-b border-[#E5E8EB] bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="패턴 메뉴 열기"
            className="rounded-xl bg-[#F2F4F6] p-2 text-[#333D4B] hover:bg-[#E5E8EB]"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div>
            <p className="text-[10px] font-bold text-[#3182F6]">
              {activePattern.number} · {activePattern.englishName}
            </p>
            <h2 className="text-sm font-bold text-[#191F28]">{activePattern.name}</h2>
          </div>
        </div>

        <div className="flex rounded-xl bg-[#F2F4F6] p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMobilePane('preview')}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 transition ${
              mobilePane === 'preview' ? 'bg-white text-[#3182F6] shadow-2xs' : 'text-[#4E5968]'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            프리뷰
          </button>
          <button
            type="button"
            onClick={() => setMobilePane('code')}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 transition ${
              mobilePane === 'code' ? 'bg-white text-[#3182F6] shadow-2xs' : 'text-[#4E5968]'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            코드
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Drawer */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-50 flex bg-black/40 lg:hidden"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative h-full w-72 max-w-[85vw] bg-white shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="메뉴 닫기"
              className="absolute right-3 top-4 z-10 rounded-lg p-1.5 text-[#8B95A1] hover:bg-[#F2F4F6]"
            >
              <X className="h-4 w-4" />
            </button>
            <Sidebar
              patterns={filteredPatterns}
              totalCount={FEEDBACK_PATTERNS.length}
              selectedId={activePattern.id}
              onSelect={handleSelectPattern}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              onOpenMatrix={() => {
                setDrawerOpen(false);
                setMatrixOpen(true);
              }}
              onCloseMobileDrawer={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 3-Column Split Dashboard Layout */}
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[276px_minmax(0,1fr)_440px] xl:grid-cols-[288px_minmax(0,1fr)_500px]">
        {/* Left Column: Fixed Navigation Sidebar */}
        <div className="hidden min-h-0 lg:block">
          <Sidebar
            patterns={filteredPatterns}
            totalCount={FEEDBACK_PATTERNS.length}
            selectedId={activePattern.id}
            onSelect={handleSelectPattern}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            onOpenMatrix={() => setMatrixOpen(true)}
          />
        </div>

        {/* Center Column: Interactive Live Preview + UX Guidelines */}
        <main
          className={`min-h-0 overflow-y-auto px-5 py-6 sm:px-8 ${
            mobilePane === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="mx-auto max-w-2xl space-y-6">
            {/* Pattern Summary Header */}
            <section className="rounded-[24px] border border-[#E5E8EB] bg-white p-6 shadow-[0_4px_20px_rgba(0,27,55,0.03)]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-[#3182F6] px-2.5 py-1 text-xs font-bold text-white tabular-nums">
                    {activePattern.number}
                  </span>
                  <span className="rounded-lg bg-[#E8F3FF] px-2.5 py-1 text-xs font-bold text-[#3182F6]">
                    {activePattern.category}
                  </span>
                  <span
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                      activePattern.blocking
                        ? 'bg-[#FFF4E5] text-[#D97706]'
                        : 'bg-[#E6F9F0] text-[#009957]'
                    }`}
                  >
                    {activePattern.blocking ? '화면 차단형' : '비차단형'}
                  </span>
                  <span className="rounded-lg bg-[#F2F4F6] px-2.5 py-1 text-xs font-semibold text-[#4E5968]">
                    긴급도: {activePattern.urgency}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setMatrixOpen(true)}
                  className="hidden items-center gap-1 text-xs font-semibold text-[#8B95A1] transition hover:text-[#3182F6] sm:inline-flex"
                >
                  <LayoutPanelLeft className="h-3.5 w-3.5" />
                  패턴 비교표
                </button>
              </div>

              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#191F28]">
                {activePattern.name}{' '}
                <span className="text-lg font-semibold text-[#8B95A1]">
                  {activePattern.englishName}
                </span>
              </h2>
              <p className="mt-1.5 text-[14.5px] font-semibold text-[#3182F6]">
                {activePattern.tagline}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#4E5968]">
                {activePattern.description}
              </p>
            </section>

            {/* Interactive Mobile / Web Preview Frame */}
            <section aria-label="인터랙티브 데모 프리뷰">
              <MobileFrame
                pattern={activePattern}
                viewport={viewport}
                onViewportChange={setViewport}
                onResetDemo={() => setResetSeed((s) => s + 1)}
              >
                <div key={`${activePattern.id}-${resetSeed}`} className="h-full">
                  {renderPatternDemo(activePattern.id)}
                </div>
              </MobileFrame>
            </section>

            {/* Practical UX Guidelines Card */}
            <section className="rounded-[24px] border border-[#E5E8EB] bg-white p-6 shadow-[0_4px_20px_rgba(0,27,55,0.03)] space-y-5">
              <h3 className="text-base font-bold text-[#191F28]">
                실무 UI/UX 설계 가이드
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#F9FAFB] p-4">
                  <div className="mb-2.5 flex items-center gap-1.5 text-xs font-bold text-[#009957]">
                    <CheckCircle2 className="h-4 w-4" />
                    언제 사용하면 좋나요?
                  </div>
                  <ul className="space-y-2 text-xs leading-relaxed text-[#333D4B]">
                    {activePattern.whenToUse.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#00C471]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-[#FFF8F8] p-4">
                  <div className="mb-2.5 flex items-center gap-1.5 text-xs font-bold text-[#F04452]">
                    <XCircle className="h-4 w-4" />
                    피해야 할 안티패턴
                  </div>
                  <ul className="space-y-2 text-xs leading-relaxed text-[#333D4B]">
                    {activePattern.whenNotToUse.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#F04452]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid gap-3 border-t border-[#F2F4F6] pt-4 sm:grid-cols-3">
                <div className="rounded-xl border border-[#F2F4F6] p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#3182F6]">
                    <Clock className="h-3.5 w-3.5" />
                    노출 타이밍
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#4E5968]">
                    {activePattern.uxGuidelines.timing}
                  </p>
                </div>

                <div className="rounded-xl border border-[#F2F4F6] p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#3182F6]">
                    <MapPin className="h-3.5 w-3.5" />
                    배치 기준
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#4E5968]">
                    {activePattern.uxGuidelines.placement}
                  </p>
                </div>

                <div className="rounded-xl border border-[#F2F4F6] p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#3182F6]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    접근성 (A11y)
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#4E5968]">
                    {activePattern.uxGuidelines.accessibility}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Right Column: Syntax-Highlighted Code Viewer */}
        <div
          className={`min-h-0 border-l border-[#E5E8EB] ${
            mobilePane === 'code' ? 'block flex-1' : 'hidden lg:block'
          }`}
        >
          <CodeViewer pattern={activePattern} />
        </div>
      </div>

      {/* Pattern Comparison Matrix Modal */}
      <ComparisonMatrixModal
        open={matrixOpen}
        patterns={FEEDBACK_PATTERNS}
        selectedId={activePattern.id}
        onSelect={handleSelectPattern}
        onClose={() => setMatrixOpen(false)}
      />
    </div>
  );
}

export default App;
