import { useEffect, useState } from 'react';
import { CheckCircle2, Lock, Send, ShieldAlert } from 'lucide-react';

type ModalType = 'destructive' | 'confirm' | null;

export function ModalDemo() {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [allowBackdropClose, setAllowBackdropClose] = useState(false);
  const [lastDecision, setLastDecision] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalType(null);
    };
    if (modalType) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modalType]);

  const finishDecision = (msg: string) => {
    setLastDecision(msg);
    setModalType(null);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-[20px] border border-[#E5E8EB] bg-white p-4 shadow-2xs">
        <span className="text-[11px] font-semibold text-[#8B95A1]">연결된 외부 계좌</span>
        <div className="mt-1 flex items-center justify-between">
          <div>
            <p className="text-[15px] font-bold text-[#191F28]">신한은행 주거래 우대</p>
            <p className="text-xs text-[#8B95A1] tabular-nums">110-382-991021</p>
          </div>
          <span className="rounded-full bg-[#E6F9F0] px-2.5 py-1 text-[11px] font-bold text-[#00A862]">
            연결됨
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setModalType('confirm')}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#3182F6] py-2.5 text-xs font-bold text-white transition hover:bg-[#1B64DA]"
          >
            <Send className="h-3.5 w-3.5" />
            15만원 송금하기
          </button>
          <button
            type="button"
            onClick={() => setModalType('destructive')}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FFEBEE] py-2.5 text-xs font-bold text-[#F04452] transition hover:bg-[#FFD6DC]"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            연결 해제하기
          </button>
        </div>
      </div>

      {/* Backdrop Policy Control */}
      <div className="rounded-[20px] border border-[#E5E8EB] bg-white p-4 shadow-2xs">
        <label className="flex cursor-pointer items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-[#191F28]">배경(딤드) 클릭으로 닫기 허용</p>
            <p className="mt-0.5 text-[11px] text-[#8B95A1]">
              중요 금융 결정을 다룰 땐 실수 방지를 위해 OFF를 권장합니다
            </p>
          </div>
          <input
            type="checkbox"
            checked={allowBackdropClose}
            onChange={(e) => setAllowBackdropClose(e.target.checked)}
            className="h-4 w-4 accent-[#3182F6]"
          />
        </label>
      </div>

      {lastDecision && (
        <div className="flex items-center gap-2 rounded-2xl bg-[#E8F3FF] px-4 py-3 text-xs font-semibold text-[#1B64DA]">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{lastDecision}</span>
        </div>
      )}

      {/* Scoped Blocking Modal Overlay */}
      {modalType && (
        <div
          onClick={() => {
            if (allowBackdropClose) setModalType(null);
          }}
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/45 p-5 backdrop-blur-[2px]"
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'toss-pop 0.24s cubic-bezier(0.22, 1, 0.36, 1)' }}
            className="w-full max-w-[300px] rounded-[24px] bg-white p-5 shadow-2xl"
          >
            {modalType === 'destructive' ? (
              <>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFEBEE] text-[#F04452]">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <h3 className="text-[16px] font-bold text-[#191F28]">
                  계좌 연결을 해제할까요?
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#4E5968]">
                  연결을 해제하면 해당 계좌의 잔액 알림과 예약 이체가 즉시 중단됩니다.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => finishDecision('계좌 연결 해제를 취소했어요')}
                    className="rounded-xl bg-[#F2F4F6] py-2.5 text-xs font-bold text-[#4E5968] hover:bg-[#E5E8EB]"
                  >
                    유지하기
                  </button>
                  <button
                    type="button"
                    onClick={() => finishDecision('신한은행 계좌 연결이 해제되었어요')}
                    className="rounded-xl bg-[#F04452] py-2.5 text-xs font-bold text-white hover:bg-[#D93644]"
                  >
                    해제하기
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E8F3FF] text-[#3182F6]">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="text-[16px] font-bold text-[#191F28]">
                  김민수님께 150,000원 보낼까요?
                </h3>
                <div className="mt-3 rounded-xl bg-[#F9FAFB] p-3 text-xs">
                  <div className="flex justify-between text-[#8B95A1]">
                    <span>받는 계좌</span>
                    <span className="font-semibold text-[#333D4B]">카카오뱅크 3333-01</span>
                  </div>
                  <div className="mt-1.5 flex justify-between text-[#8B95A1]">
                    <span>수수료</span>
                    <span className="font-semibold text-[#00A862]">평생 무료</span>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => finishDecision('송금을 취소했어요')}
                    className="rounded-xl bg-[#F2F4F6] py-2.5 text-xs font-bold text-[#4E5968] hover:bg-[#E5E8EB]"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={() => finishDecision('150,000원 송금이 완료되었어요')}
                    className="rounded-xl bg-[#3182F6] py-2.5 text-xs font-bold text-white hover:bg-[#1B64DA]"
                  >
                    보내기
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
