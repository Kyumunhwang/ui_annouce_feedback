import { useRef, useState } from 'react';
import { Check, ChevronDown, FileCheck2 } from 'lucide-react';

interface BankAccount {
  id: string;
  name: string;
  balance: string;
  badgeColor: string;
}

const ACCOUNTS: BankAccount[] = [
  { id: 'toss', name: '토스뱅크 통장', balance: '2,450,000원', badgeColor: 'bg-[#3182F6]' },
  { id: 'kb', name: 'KB국민 Star*t', balance: '890,000원', badgeColor: 'bg-[#FFB800]' },
  { id: 'shinhan', name: '신한 쏠편한 입출금', balance: '340,200원', badgeColor: 'bg-[#0046FF]' },
];

export function BottomSheetDemo() {
  const [sheetMode, setSheetMode] = useState<'account' | 'terms' | null>(null);
  const [selectedId, setSelectedId] = useState<string>('toss');
  const [agreedAll, setAgreedAll] = useState(false);
  const [dragY, setDragY] = useState(0);
  const startYRef = useRef<number | null>(null);

  const selectedAccount = ACCOUNTS.find((a) => a.id === selectedId) ?? ACCOUNTS[0];

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    startYRef.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startYRef.current === null) return;
    const delta = Math.max(0, e.clientY - startYRef.current);
    setDragY(delta);
  };

  const handlePointerUp = () => {
    if (dragY > 75) {
      setSheetMode(null);
    }
    setDragY(0);
    startYRef.current = null;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-[20px] border border-[#E5E8EB] bg-white p-4 shadow-2xs">
        <p className="text-xs font-semibold text-[#8B95A1]">출금할 계좌</p>
        <button
          type="button"
          onClick={() => setSheetMode('account')}
          className="mt-2 flex w-full items-center justify-between rounded-2xl bg-[#F9FAFB] px-3.5 py-3 text-left transition hover:bg-[#F2F4F6]"
        >
          <div className="flex items-center gap-2.5">
            <span className={`h-3 w-3 rounded-full ${selectedAccount.badgeColor}`} />
            <div>
              <p className="text-[13.5px] font-bold text-[#191F28]">{selectedAccount.name}</p>
              <p className="text-xs text-[#8B95A1] tabular-nums">{selectedAccount.balance}</p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-[#8B95A1]" />
        </button>
      </div>

      <div className="rounded-[20px] border border-[#E5E8EB] bg-white p-4 shadow-2xs">
        <p className="text-xs font-bold text-[#191F28]">약관 동의 바텀 시트</p>
        <p className="mt-0.5 text-[11px] text-[#8B95A1]">
          엄지 영역에 맞춘 하단 CTA 확인 플로우를 테스트해 보세요.
        </p>
        <button
          type="button"
          onClick={() => setSheetMode('terms')}
          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#E8F3FF] py-2.5 text-xs font-bold text-[#3182F6] transition hover:bg-[#D5E7FF]"
        >
          <FileCheck2 className="h-4 w-4" />
          자동이체 약관 동의 열기
        </button>
      </div>

      {/* Scoped Bottom Sheet */}
      {sheetMode && (
        <div
          onClick={() => setSheetMode(null)}
          className="absolute inset-0 z-40 flex items-end bg-black/40 backdrop-blur-[1px]"
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            style={{
              transform: `translateY(${dragY}px)`,
              transition: dragY === 0 ? 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
              animation: dragY === 0 ? 'toss-slide-up 0.28s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
            }}
            className="w-full rounded-t-[28px] bg-white px-5 pb-6 pt-2.5 shadow-2xl"
          >
            {/* Interactive Drag Handle */}
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="cursor-grab py-2 active:cursor-grabbing"
              title="아래로 당겨서 닫기"
            >
              <div className="mx-auto h-1.5 w-10 rounded-full bg-[#D1D6DB]" />
            </div>

            {sheetMode === 'account' ? (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-[15px] font-bold text-[#191F28]">
                    어느 계좌에서 보낼까요?
                  </h3>
                  <span className="text-[11px] text-[#8B95A1]">핸들을 아래로 드래그</span>
                </div>
                <div className="space-y-1.5">
                  {ACCOUNTS.map((account) => {
                    const active = account.id === selectedId;
                    return (
                      <button
                        key={account.id}
                        type="button"
                        onClick={() => {
                          setSelectedId(account.id);
                          setSheetMode(null);
                        }}
                        className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-3 text-left transition ${
                          active ? 'bg-[#E8F3FF]' : 'hover:bg-[#F9FAFB]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`h-3 w-3 rounded-full ${account.badgeColor}`} />
                          <div>
                            <p
                              className={`text-[13.5px] ${
                                active ? 'font-bold text-[#3182F6]' : 'font-semibold text-[#191F28]'
                              }`}
                            >
                              {account.name}
                            </p>
                            <p className="text-xs text-[#8B95A1] tabular-nums">
                              잔액 {account.balance}
                            </p>
                          </div>
                        </div>
                        {active && <Check className="h-4 w-4 text-[#3182F6]" />}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <h3 className="mb-2 text-[15px] font-bold text-[#191F28]">
                  서비스 이용 약관에 동의해 주세요
                </h3>
                <div className="space-y-2 rounded-2xl bg-[#F9FAFB] p-3 text-xs text-[#4E5968]">
                  <p>• [필수] 오픈뱅킹 출금이체 동의</p>
                  <p>• [필수] 전자금융거래 기본약관</p>
                  <p>• [선택] 혜택 알림 수신 동의</p>
                </div>
                <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#191F28]">
                  <input
                    type="checkbox"
                    checked={agreedAll}
                    onChange={(e) => setAgreedAll(e.target.checked)}
                    className="h-4 w-4 accent-[#3182F6]"
                  />
                  필수 약관 내용을 모두 확인했습니다
                </label>
                <button
                  type="button"
                  disabled={!agreedAll}
                  onClick={() => {
                    setAgreedAll(false);
                    setSheetMode(null);
                  }}
                  className="mt-4 w-full rounded-2xl bg-[#3182F6] py-3 text-sm font-bold text-white transition hover:bg-[#1B64DA] disabled:bg-[#D1D6DB]"
                >
                  동의하고 계속하기
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
