import type { ReactNode } from 'react';
import { Monitor, RotateCcw, Smartphone, Wifi, BatteryFull, Signal } from 'lucide-react';
import type { FeedbackPatternMeta } from '../../data/feedbackPatterns';

export type ViewportMode = 'mobile' | 'web';

interface MobileFrameProps {
  pattern: FeedbackPatternMeta;
  viewport: ViewportMode;
  onViewportChange: (mode: ViewportMode) => void;
  onResetDemo: () => void;
  children: ReactNode;
}

export function MobileFrame({
  pattern,
  viewport,
  onViewportChange,
  onResetDemo,
  children,
}: MobileFrameProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Frame Controls Toolbar */}
      <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-2">
        <div
          className="inline-flex rounded-xl border border-[#E5E8EB] bg-white p-1 shadow-2xs"
          role="group"
          aria-label="프리뷰 뷰포트 전환"
        >
          <button
            type="button"
            onClick={() => onViewportChange('mobile')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              viewport === 'mobile'
                ? 'bg-[#3182F6] text-white shadow-xs'
                : 'text-[#4E5968] hover:text-[#191F28]'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            모바일 앱 (375px)
          </button>
          <button
            type="button"
            onClick={() => onViewportChange('web')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              viewport === 'web'
                ? 'bg-[#3182F6] text-white shadow-xs'
                : 'text-[#4E5968] hover:text-[#191F28]'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            웹 카드 (540px)
          </button>
        </div>

        <button
          type="button"
          onClick={onResetDemo}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E8EB] bg-white px-3 py-2 text-xs font-semibold text-[#4E5968] shadow-2xs transition hover:border-[#D1D6DB] hover:bg-[#F9FAFB] hover:text-[#191F28]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          데모 초기화
        </button>
      </div>

      {/* Simulated Device or Web Frame */}
      {viewport === 'mobile' ? (
        <div className="w-full max-w-[375px] rounded-[44px] border-[8px] border-[#191F28] bg-white shadow-[0_24px_60px_-15px_rgba(0,27,55,0.18)]">
          {/* Dynamic Island & Status Bar */}
          <div className="relative flex items-center justify-between rounded-t-[36px] bg-white px-6 pb-2 pt-3">
            <span className="text-[11px] font-bold tracking-tight text-[#191F28] tabular-nums">
              9:41
            </span>
            <div className="absolute left-1/2 top-2.5 h-5 w-24 -translate-x-1/2 rounded-full bg-[#191F28]" />
            <div className="flex items-center gap-1 text-[#191F28]">
              <Signal className="h-3 w-3" />
              <Wifi className="h-3 w-3" />
              <BatteryFull className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* App Header */}
          <div className="flex items-center justify-between border-b border-[#F2F4F6] bg-white px-5 py-2.5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8B95A1]">
                Interactive Sandbox
              </p>
              <h3 className="text-[14px] font-bold text-[#191F28]">
                {pattern.name} 체험
              </h3>
            </div>
            <span className="rounded-full bg-[#E8F3FF] px-2.5 py-1 text-[10px] font-bold text-[#3182F6]">
              {pattern.englishName}
            </span>
          </div>

          {/* Interactive Stage (Scoped Positioning Root) */}
          <div className="relative flex h-[540px] flex-col overflow-hidden rounded-b-[36px] bg-[#F9FAFB]">
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
            {/* Home Indicator Bar */}
            <div className="pointer-events-none relative z-30 flex justify-center bg-transparent pb-2 pt-1">
              <div className="h-1 w-28 rounded-full bg-[#191F28]/15" />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[540px] overflow-hidden rounded-[24px] border border-[#E5E8EB] bg-white shadow-[0_20px_50px_-15px_rgba(0,27,55,0.12)]">
          {/* Browser Chrome */}
          <div className="flex items-center justify-between border-b border-[#F2F4F6] bg-[#F9FAFB] px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
            </div>
            <div className="rounded-lg border border-[#E5E8EB] bg-white px-3 py-1 text-[11px] font-medium text-[#8B95A1]">
              preview.toss-ui.dev/patterns/{pattern.id}
            </div>
            <span className="rounded-md bg-[#E8F3FF] px-2 py-0.5 text-[10px] font-bold text-[#3182F6]">
              WEB
            </span>
          </div>

          {/* Interactive Web Stage */}
          <div className="relative flex h-[500px] flex-col overflow-hidden bg-[#F9FAFB]">
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}
