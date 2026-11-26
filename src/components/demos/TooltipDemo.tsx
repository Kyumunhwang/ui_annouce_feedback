import { useState } from 'react';
import { HelpCircle, Info } from 'lucide-react';

type Placement = 'top' | 'bottom' | 'left' | 'right';

const PLACEMENT_CLASSES: Record<
  Placement,
  { bubble: string; arrow: string }
> = {
  top: {
    bubble: 'bottom-full left-1/2 -translate-x-1/2 mb-2.5',
    arrow: 'top-full left-1/2 -translate-x-1/2 border-t-[#191F28]',
  },
  bottom: {
    bubble: 'top-full left-1/2 -translate-x-1/2 mt-2.5',
    arrow: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#191F28]',
  },
  left: {
    bubble: 'right-full top-1/2 -translate-y-1/2 mr-2.5',
    arrow: 'left-full top-1/2 -translate-y-1/2 border-l-[#191F28]',
  },
  right: {
    bubble: 'left-full top-1/2 -translate-y-1/2 ml-2.5',
    arrow: 'right-full top-1/2 -translate-y-1/2 border-r-[#191F28]',
  },
};

export function TooltipDemo() {
  const [placement, setPlacement] = useState<Placement>('top');
  const [triggerMode, setTriggerMode] = useState<'hover' | 'click'>('click');
  const [openTip, setOpenTip] = useState<'yield' | 'fee' | null>('yield');

  const classes = PLACEMENT_CLASSES[placement];

  return (
    <div className="space-y-4">
      {/* Placement & Trigger Settings */}
      <div className="rounded-[20px] border border-[#E5E8EB] bg-white p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#191F28]">툴팁 방향</span>
          <div className="flex gap-1">
            {(['top', 'bottom', 'left', 'right'] as Placement[]).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => setPlacement(dir)}
                className={`rounded-lg px-2 py-1 text-[11px] font-semibold uppercase transition ${
                  placement === dir
                    ? 'bg-[#3182F6] text-white'
                    : 'bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]'
                }`}
              >
                {dir}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#191F28]">열기 방식</span>
          <div className="flex rounded-lg bg-[#F2F4F6] p-0.5 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setTriggerMode('click')}
              className={`rounded-md px-2.5 py-1 transition ${
                triggerMode === 'click' ? 'bg-white text-[#3182F6] shadow-2xs' : 'text-[#8B95A1]'
              }`}
            >
              탭 / 클릭
            </button>
            <button
              type="button"
              onClick={() => {
                setTriggerMode('hover');
                setOpenTip(null);
              }}
              className={`rounded-md px-2.5 py-1 transition ${
                triggerMode === 'hover' ? 'bg-white text-[#3182F6] shadow-2xs' : 'text-[#8B95A1]'
              }`}
            >
              마우스 호버
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Product Card with Tooltips */}
      <div className="rounded-[24px] border border-[#E5E8EB] bg-white px-5 py-12 shadow-2xs space-y-6">
        {/* Item 1 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-[#191F28]">연 예상 수익률</span>
            <div
              className="relative inline-flex"
              onMouseEnter={() => {
                if (triggerMode === 'hover') setOpenTip('yield');
              }}
              onMouseLeave={() => {
                if (triggerMode === 'hover') setOpenTip(null);
              }}
            >
              <button
                type="button"
                aria-describedby="tooltip-yield"
                onClick={() => setOpenTip((prev) => (prev === 'yield' ? null : 'yield'))}
                className={`rounded-full p-1 transition ${
                  openTip === 'yield'
                    ? 'bg-[#E8F3FF] text-[#3182F6]'
                    : 'text-[#8B95A1] hover:bg-[#F2F4F6] hover:text-[#3182F6]'
                }`}
              >
                <HelpCircle className="h-4 w-4" />
              </button>

              {openTip === 'yield' && (
                <div
                  id="tooltip-yield"
                  role="tooltip"
                  style={{ animation: 'toss-pop 0.2s cubic-bezier(0.22, 1, 0.36, 1)' }}
                  className={`absolute z-30 w-48 rounded-2xl bg-[#191F28] px-3.5 py-2.5 text-[11.5px] leading-relaxed text-white shadow-xl ${classes.bubble}`}
                >
                  세전 기준 추정 금리이며, 실제 이자 지급 시 15.4% 세금이 원천징수됩니다.
                  <span className={`absolute border-[5px] border-transparent ${classes.arrow}`} />
                </div>
              )}
            </div>
          </div>
          <span className="text-base font-extrabold text-[#3182F6] tabular-nums">연 3.4%</span>
        </div>

        {/* Item 2 */}
        <div className="flex items-center justify-between border-t border-[#F2F4F6] pt-5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-[#191F28]">타행 이체 수수료</span>
            <div
              className="relative inline-flex"
              onMouseEnter={() => {
                if (triggerMode === 'hover') setOpenTip('fee');
              }}
              onMouseLeave={() => {
                if (triggerMode === 'hover') setOpenTip(null);
              }}
            >
              <button
                type="button"
                aria-describedby="tooltip-fee"
                onClick={() => setOpenTip((prev) => (prev === 'fee' ? null : 'fee'))}
                className={`rounded-full p-1 transition ${
                  openTip === 'fee'
                    ? 'bg-[#E8F3FF] text-[#3182F6]'
                    : 'text-[#8B95A1] hover:bg-[#F2F4F6] hover:text-[#3182F6]'
                }`}
              >
                <Info className="h-4 w-4" />
              </button>

              {openTip === 'fee' && (
                <div
                  id="tooltip-fee"
                  role="tooltip"
                  style={{ animation: 'toss-pop 0.2s cubic-bezier(0.22, 1, 0.36, 1)' }}
                  className={`absolute z-30 w-48 rounded-2xl bg-[#191F28] px-3.5 py-2.5 text-[11.5px] leading-relaxed text-white shadow-xl ${classes.bubble}`}
                >
                  실적 조건 없이 모든 은행 이체 및 ATM 출금 수수료가 횟수 무제한 면제돼요.
                  <span className={`absolute border-[5px] border-transparent ${classes.arrow}`} />
                </div>
              )}
            </div>
          </div>
          <span className="rounded-full bg-[#E6F9F0] px-2.5 py-1 text-xs font-bold text-[#00A862]">
            평생 무료
          </span>
        </div>
      </div>
    </div>
  );
}
