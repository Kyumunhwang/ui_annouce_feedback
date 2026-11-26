import { useEffect, useState } from 'react';
import { RefreshCw, RotateCcw, Trash2, WifiOff } from 'lucide-react';

interface ScheduledTransfer {
  id: string;
  title: string;
  amount: string;
  cycle: string;
}

const INITIAL_ITEMS: ScheduledTransfer[] = [
  { id: '1', title: '월세 자동이체', amount: '650,000원', cycle: '매월 25일' },
  { id: '2', title: '청년주택드림 적금', amount: '500,000원', cycle: '매월 10일' },
  { id: '3', title: '가족 넷플릭스 모임통장', amount: '17,000원', cycle: '매월 1일' },
];

type SnackbarState =
  | { kind: 'undo'; item: ScheduledTransfer; index: number }
  | { kind: 'retry'; message: string };

export function SnackbarDemo() {
  const [items, setItems] = useState<ScheduledTransfer[]>(INITIAL_ITEMS);
  const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!snackbar) return;
    const timer = setTimeout(() => setSnackbar(null), 4500);
    return () => clearTimeout(timer);
  }, [snackbar]);

  const handleDelete = (item: ScheduledTransfer, index: number) => {
    setItems((prev) => prev.filter((entry) => entry.id !== item.id));
    setSnackbar({ kind: 'undo', item, index });
  };

  const handleUndo = () => {
    if (!snackbar || snackbar.kind !== 'undo') return;
    const { item, index } = snackbar;
    setItems((prev) => {
      const next = [...prev];
      next.splice(Math.min(index, next.length), 0, item);
      return next;
    });
    setSnackbar(null);
  };

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      setRetrying(false);
      setSnackbar(null);
    }, 700);
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-[#191F28]">예약 송금 목록</h4>
          <p className="text-[11px] text-[#8B95A1]">
            휴지통을 누르면 확인 모달 없이 즉시 삭제되고 스낵바가 뜹니다
          </p>
        </div>
        {items.length < INITIAL_ITEMS.length && (
          <button
            type="button"
            onClick={() => {
              setItems(INITIAL_ITEMS);
              setSnackbar(null);
            }}
            className="text-xs font-semibold text-[#3182F6] hover:underline"
          >
            목록 복원
          </button>
        )}
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-[#D1D6DB] bg-white px-4 py-8 text-center">
            <p className="text-xs font-semibold text-[#8B95A1]">모든 예약 송금이 삭제되었어요</p>
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-[20px] border border-[#E5E8EB] bg-white px-4 py-3.5 shadow-2xs transition hover:border-[#D1D6DB]"
            >
              <div>
                <p className="text-[13.5px] font-bold text-[#191F28]">{item.title}</p>
                <p className="mt-0.5 text-xs text-[#8B95A1] tabular-nums">
                  {item.cycle} · {item.amount}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(item, idx)}
                aria-label={`${item.title} 삭제`}
                className="rounded-xl p-2 text-[#8B95A1] transition hover:bg-[#FFEBEE] hover:text-[#F04452]"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Network Retry Simulation Button */}
      <div className="rounded-[20px] border border-[#E5E8EB] bg-white p-4 shadow-2xs">
        <p className="text-xs font-bold text-[#191F28]">재시도(Retry) 스낵바 시뮬레이션</p>
        <p className="mt-0.5 text-[11px] text-[#8B95A1]">
          일시적 API 실패 시 사용자에게 즉시 재요청 기회를 제공합니다.
        </p>
        <button
          type="button"
          onClick={() =>
            setSnackbar({ kind: 'retry', message: '최근 이체 내역을 불러오지 못했어요' })
          }
          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#F2F4F6] py-2.5 text-xs font-bold text-[#333D4B] transition hover:bg-[#E5E8EB]"
        >
          <WifiOff className="h-3.5 w-3.5 text-[#F04452]" />
          네트워크 오류 발생시키기
        </button>
      </div>

      {/* Scoped Bottom Snackbar */}
      {snackbar && (
        <div
          role="status"
          aria-live="polite"
          style={{ animation: 'toss-pop 0.25s cubic-bezier(0.22, 1, 0.36, 1)' }}
          className="absolute inset-x-4 bottom-5 z-30 flex items-center justify-between gap-3 rounded-2xl bg-[#191F28] px-4 py-3 text-white shadow-[0_14px_32px_rgba(0,27,55,0.28)]"
        >
          <span className="truncate text-[13px] font-medium">
            {snackbar.kind === 'undo'
              ? `‘${snackbar.item.title}’ 삭제됨`
              : snackbar.message}
          </span>

          {snackbar.kind === 'undo' ? (
            <button
              type="button"
              onClick={handleUndo}
              className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-[#3182F6]/20 px-3 py-1.5 text-xs font-bold text-[#64A8FF] transition hover:bg-[#3182F6]/35"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              실행 취소
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRetry}
              disabled={retrying}
              className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-[#3182F6] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#1B64DA] disabled:opacity-60"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${retrying ? 'animate-spin' : ''}`} />
              {retrying ? '재시도 중' : '다시 시도'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
