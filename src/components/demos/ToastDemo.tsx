import { useEffect, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Loader2,
  X,
} from 'lucide-react';

type ToastVariant = 'success' | 'warning' | 'error' | 'loading';

interface ToastItem {
  id: number;
  variant: ToastVariant;
  message: string;
}

export function ToastDemo() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom');
  const [paused, setPaused] = useState(false);

  const pushToast = (variant: ToastVariant, message: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev.slice(-2), { id, variant, message }]);
    return id;
  };

  const triggerAsyncToast = () => {
    const id = pushToast('loading', '거래내역서 PDF를 생성하고 있어요...');
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, variant: 'success', message: '거래내역서 준비가 완료되었어요' }
            : item
        )
      );
    }, 1400);
  };

  useEffect(() => {
    if (paused) return;
    const autoTargets = toasts.filter((t) => t.variant !== 'loading');
    if (autoTargets.length === 0) return;

    const timer = setTimeout(() => {
      const oldestId = autoTargets[0].id;
      setToasts((prev) => prev.filter((item) => item.id !== oldestId));
    }, 2800);

    return () => clearTimeout(timer);
  }, [toasts, paused]);

  return (
    <div className="space-y-4 pb-16">
      {/* Realistic Account Card */}
      <div className="rounded-[20px] border border-[#E5E8EB] bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#8B95A1]">토스뱅크 통장</span>
            <p className="mt-0.5 text-lg font-bold tracking-tight text-[#191F28] tabular-nums">
              2,480,500원
            </p>
          </div>
          <button
            type="button"
            onClick={() => pushToast('success', '계좌번호(1000-1234-5678)가 복사되었어요')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#F2F4F6] px-3 py-2 text-xs font-semibold text-[#333D4B] transition hover:bg-[#E5E8EB]"
          >
            <Copy className="h-3.5 w-3.5 text-[#4E5968]" />
            계좌 복사
          </button>
        </div>
      </div>

      {/* Trigger Controls */}
      <div className="rounded-[20px] border border-[#E5E8EB] bg-white p-4 shadow-2xs">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold text-[#191F28]">상태별 토스트 실행</p>
          <div className="flex rounded-lg bg-[#F2F4F6] p-0.5 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setPosition('bottom')}
              className={`rounded-md px-2 py-1 transition ${
                position === 'bottom' ? 'bg-white text-[#3182F6] shadow-2xs' : 'text-[#8B95A1]'
              }`}
            >
              하단
            </button>
            <button
              type="button"
              onClick={() => setPosition('top')}
              className={`rounded-md px-2 py-1 transition ${
                position === 'top' ? 'bg-white text-[#3182F6] shadow-2xs' : 'text-[#8B95A1]'
              }`}
            >
              상단
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => pushToast('success', '자동이체 설정이 저장되었어요')}
            className="rounded-xl bg-[#E8F3FF] px-3 py-2.5 text-xs font-bold text-[#3182F6] transition hover:bg-[#D5E7FF]"
          >
            성공 (Success)
          </button>
          <button
            type="button"
            onClick={() => pushToast('warning', '일일 이체 한도의 80%를 썼어요')}
            className="rounded-xl bg-[#FFF4E5] px-3 py-2.5 text-xs font-bold text-[#D97706] transition hover:bg-[#FFE8C7]"
          >
            주의 (Warning)
          </button>
          <button
            type="button"
            onClick={() => pushToast('error', '네트워크가 불안정해 저장하지 못했어요')}
            className="rounded-xl bg-[#FFEBEE] px-3 py-2.5 text-xs font-bold text-[#F04452] transition hover:bg-[#FFD6DC]"
          >
            오류 (Error)
          </button>
          <button
            type="button"
            onClick={triggerAsyncToast}
            className="rounded-xl bg-[#191F28] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#333D4B]"
          >
            비동기 (Loading→완료)
          </button>
        </div>
        <p className="mt-2.5 text-[11px] text-[#8B95A1]">
          최대 3개까지 누적되며, 토스트 위에 마우스를 올리면 자동 소멸이 일시 정지됩니다.
        </p>
      </div>

      {/* Scoped Floating Toast Container */}
      <div
        role="status"
        aria-live="polite"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className={`pointer-events-none absolute inset-x-4 z-30 flex flex-col gap-2 ${
          position === 'bottom' ? 'bottom-5' : 'top-3'
        }`}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{ animation: 'toss-pop 0.28s cubic-bezier(0.22, 1, 0.36, 1)' }}
            className="pointer-events-auto flex items-center justify-between gap-2.5 rounded-2xl bg-[#191F28]/95 px-4 py-3 text-[13px] font-medium text-white shadow-[0_12px_28px_rgba(0,27,55,0.22)] backdrop-blur-md"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              {toast.variant === 'success' && (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00C471]" />
              )}
              {toast.variant === 'warning' && (
                <AlertTriangle className="h-4 w-4 shrink-0 text-[#FF9500]" />
              )}
              {toast.variant === 'error' && (
                <AlertCircle className="h-4 w-4 shrink-0 text-[#F04452]" />
              )}
              {toast.variant === 'loading' && (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#64A8FF]" />
              )}
              <span className="truncate">{toast.message}</span>
            </div>

            <button
              type="button"
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== toast.id))}
              aria-label="토스트 닫기"
              className="shrink-0 rounded-lg p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
