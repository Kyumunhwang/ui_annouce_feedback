import { useState } from 'react';
import { Bell, PieChart, RotateCcw, Send, Sparkles } from 'lucide-react';

interface TourStep {
  target: 'send' | 'report' | 'alerts';
  title: string;
  description: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    target: 'send',
    title: '3초 만에 원터치 송금',
    description: '최근 송금한 계좌가 상단에 고정되어 버튼 한 번으로 바로 보낼 수 있어요.',
  },
  {
    target: 'report',
    title: '주간 소비 분석 리포트',
    description: '지난주 대비 지출 증감률과 고정비 내역을 매주 월요일 아침 요약해 드려요.',
  },
  {
    target: 'alerts',
    title: '맞춤 입출금 & 혜택 알림',
    description: '불필요한 광고 없이 내가 설정한 계좌 변동과 만기 일정만 모아봅니다.',
  },
];

export function CoachMarkDemo() {
  const [stepIndex, setStepIndex] = useState<number | null>(0);
  const currentStep = stepIndex !== null ? TOUR_STEPS[stepIndex] : null;

  const isTarget = (key: TourStep['target']) => currentStep?.target === key;

  return (
    <div className="space-y-3">
      {/* Top Bar inside App */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[#8B95A1]">토스 홈</p>
          <p className="text-sm font-bold text-[#191F28]">오늘의 자산 관리</p>
        </div>

        <button
          type="button"
          className={`relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-2xs transition-all ${
            isTarget('alerts')
              ? 'z-30 ring-4 ring-[#3182F6] ring-offset-2 ring-offset-[#191F28]/60'
              : 'border border-[#E5E8EB]'
          }`}
          aria-label="알림함"
        >
          <Bell className="h-4 w-4 text-[#191F28]" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#F04452]" />
        </button>
      </div>

      {/* Target 1: Quick Send Card */}
      <div
        className={`relative rounded-[20px] bg-white p-4 transition-all ${
          isTarget('send')
            ? 'z-30 ring-4 ring-[#3182F6] shadow-2xl'
            : 'border border-[#E5E8EB] shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#8B95A1]">토스뱅크 통장</span>
            <p className="text-lg font-extrabold text-[#191F28] tabular-nums">3,120,000원</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#3182F6] px-3.5 py-2 text-xs font-bold text-white"
          >
            <Send className="h-3.5 w-3.5" />
            송금
          </button>
        </div>
      </div>

      {/* Target 2: Spending Report Card */}
      <div
        className={`relative rounded-[20px] bg-white p-4 transition-all ${
          isTarget('report')
            ? 'z-30 ring-4 ring-[#3182F6] shadow-2xl'
            : 'border border-[#E5E8EB] shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E8F3FF] text-[#3182F6]">
              <PieChart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#191F28]">이번 달 소비 리포트</p>
              <p className="text-[11px] text-[#8B95A1]">지난달보다 12% 덜 썼어요</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#00A862]">양호</span>
        </div>
      </div>

      {/* Replay Button when Tour Finished */}
      {stepIndex === null && (
        <div className="rounded-[20px] border border-dashed border-[#BFD9FF] bg-[#E8F3FF]/60 p-4 text-center">
          <Sparkles className="mx-auto mb-1.5 h-5 w-5 text-[#3182F6]" />
          <p className="text-xs font-bold text-[#191F28]">온보딩 투어가 완료되었어요</p>
          <p className="mt-0.5 text-[11px] text-[#4E5968]">
            실제 서비스에서는 최초 1회 노출 후 상태를 저장합니다.
          </p>
          <button
            type="button"
            onClick={() => setStepIndex(0)}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#3182F6] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#1B64DA]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            코치마크 다시 시작
          </button>
        </div>
      )}

      {/* Scoped Dim Backdrop + Coach Mark Card */}
      {currentStep && stepIndex !== null && (
        <>
          <div
            onClick={() => setStepIndex(null)}
            className="absolute inset-0 z-20 bg-[#0B1018]/60 backdrop-blur-[1px]"
          />

          <div
            role="dialog"
            aria-label="기능 안내 가이드"
            style={{ animation: 'toss-pop 0.25s cubic-bezier(0.22, 1, 0.36, 1)' }}
            className="absolute inset-x-4 bottom-5 z-30 rounded-[24px] bg-[#191F28] p-5 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {TOUR_STEPS.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === stepIndex ? 'w-5 bg-[#3182F6]' : 'w-1.5 bg-white/25'
                    }`}
                  />
                ))}
                <span className="ml-1.5 text-[11px] font-bold text-[#64A8FF] tabular-nums">
                  {stepIndex + 1} / {TOUR_STEPS.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setStepIndex(null)}
                className="text-xs font-medium text-white/60 hover:text-white"
              >
                건너뛰기
              </button>
            </div>

            <h4 className="mt-2.5 text-[15px] font-bold">{currentStep.title}</h4>
            <p className="mt-1 text-xs leading-relaxed text-white/80">
              {currentStep.description}
            </p>

            <div className="mt-4 flex items-center justify-end gap-2">
              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setStepIndex(stepIndex - 1)}
                  className="rounded-xl bg-white/10 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/20"
                >
                  이전
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  setStepIndex(stepIndex + 1 < TOUR_STEPS.length ? stepIndex + 1 : null)
                }
                className="rounded-xl bg-[#3182F6] px-4 py-2 text-xs font-bold text-white hover:bg-[#1B64DA]"
              >
                {stepIndex + 1 < TOUR_STEPS.length ? '다음' : '확인 완료'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
