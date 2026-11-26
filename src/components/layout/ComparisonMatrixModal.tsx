import { useEffect } from 'react';
import { ArrowRight, ShieldAlert, X } from 'lucide-react';
import type { FeedbackPatternMeta, PatternId } from '../../data/feedbackPatterns';

interface ComparisonMatrixModalProps {
  open: boolean;
  patterns: FeedbackPatternMeta[];
  selectedId: PatternId;
  onSelect: (id: PatternId) => void;
  onClose: () => void;
}

export function ComparisonMatrixModal({
  open,
  patterns,
  selectedId,
  onSelect,
  onClose,
}: ComparisonMatrixModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="matrix-title"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'toss-pop 0.24s cubic-bezier(0.22, 1, 0.36, 1)' }}
        className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#F2F4F6] px-6 py-5">
          <div>
            <h2 id="matrix-title" className="text-lg font-bold text-[#191F28]">
              9가지 알림·피드백 패턴 선택 가이드 매트릭스
            </h2>
            <p className="mt-0.5 text-xs text-[#8B95A1]">
              행을 클릭하면 해당 패턴의 라이브 프리뷰와 코드로 바로 이동합니다
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="매트릭스 닫기"
            className="rounded-xl p-2 text-[#8B95A1] transition hover:bg-[#F2F4F6] hover:text-[#191F28]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-auto p-6">
          <table className="w-full min-w-[680px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E8EB] text-[11px] font-bold text-[#8B95A1]">
                <th className="pb-3 pr-4">패턴</th>
                <th className="pb-3 pr-4">분류</th>
                <th className="pb-3 pr-4">긴급도</th>
                <th className="pb-3 pr-4">화면 차단</th>
                <th className="pb-3 pr-4">핵심 사용 목적</th>
                <th className="pb-3 text-right">이동</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F6]">
              {patterns.map((item) => {
                const active = item.id === selectedId;
                return (
                  <tr
                    key={item.id}
                    onClick={() => {
                      onSelect(item.id);
                      onClose();
                    }}
                    className={`cursor-pointer transition ${
                      active ? 'bg-[#E8F3FF]/60' : 'hover:bg-[#F9FAFB]'
                    }`}
                  >
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#F2F4F6] text-[11px] font-bold text-[#4E5968] tabular-nums">
                          {item.number}
                        </span>
                        <div>
                          <p className="font-bold text-[#191F28]">{item.name}</p>
                          <p className="text-[11px] text-[#8B95A1]">{item.englishName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="rounded-lg bg-[#F2F4F6] px-2 py-1 text-[11px] font-semibold text-[#4E5968]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={`rounded-lg px-2 py-1 text-[11px] font-bold ${
                          item.urgency === '높음'
                            ? 'bg-[#FFEBEE] text-[#F04452]'
                            : item.urgency === '중간'
                              ? 'bg-[#FFF4E5] text-[#D97706]'
                              : 'bg-[#E6F9F0] text-[#009957]'
                        }`}
                      >
                        {item.urgency}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4">
                      {item.blocking ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-[#D97706]">
                          <ShieldAlert className="h-3.5 w-3.5" />
                          차단함
                        </span>
                      ) : (
                        <span className="font-medium text-[#8B95A1]">비차단</span>
                      )}
                    </td>
                    <td className="py-3.5 pr-4 text-[#4E5968]">{item.tagline}</td>
                    <td className="py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 font-bold text-[#3182F6]">
                        보기 <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
