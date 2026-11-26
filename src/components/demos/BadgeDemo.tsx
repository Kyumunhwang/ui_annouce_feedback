import { useState } from 'react';
import { Bell, CreditCard, Home, Mail, Sparkles } from 'lucide-react';

interface InboxAlert {
  id: string;
  title: string;
  time: string;
  unread: boolean;
}

const INITIAL_ALERTS: InboxAlert[] = [
  { id: 'a1', title: '홍길동님에게 45,000원 입금됨', time: '방금 전', unread: true },
  { id: 'a2', title: '이번 달 카드 캐시백 4,200원 도착', time: '12분 전', unread: true },
  { id: 'a3', title: '정기 예금 만기 3일 전 안내', time: '1시간 전', unread: true },
];

export function BadgeDemo() {
  const [alerts, setAlerts] = useState<InboxAlert[]>(INITIAL_ALERTS);
  const [extraUnread, setExtraUnread] = useState(0);

  const unreadCount = alerts.filter((a) => a.unread).length + extraUnread;
  const displayCount = unreadCount > 99 ? '99+' : String(unreadCount);

  const markAlertRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Numeric Controls */}
      <div className="rounded-[20px] border border-[#E5E8EB] bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#191F28]">카운트 배지 시뮬레이터</p>
            <p className="text-[11px] text-[#8B95A1]">99 초과 시 99+로 자동 캡핑됩니다</p>
          </div>
          <span className="rounded-lg bg-[#F2F4F6] px-2.5 py-1 text-xs font-bold text-[#191F28] tabular-nums">
            현재 {unreadCount}건
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setExtraUnread((c) => c + 1)}
            className="rounded-xl bg-[#E8F3FF] px-3 py-1.5 text-xs font-bold text-[#3182F6] hover:bg-[#D5E7FF]"
          >
            +1 추가
          </button>
          <button
            type="button"
            onClick={() => setExtraUnread((c) => c + 15)}
            className="rounded-xl bg-[#F2F4F6] px-3 py-1.5 text-xs font-bold text-[#333D4B] hover:bg-[#E5E8EB]"
          >
            +15
          </button>
          <button
            type="button"
            onClick={() => setExtraUnread(120)}
            className="rounded-xl bg-[#FFF4E5] px-3 py-1.5 text-xs font-bold text-[#D97706] hover:bg-[#FFE8C7]"
          >
            120건(99+ 테스트)
          </button>
          <button
            type="button"
            onClick={() => {
              setAlerts((prev) => prev.map((a) => ({ ...a, unread: false })));
              setExtraUnread(0);
            }}
            className="rounded-xl bg-[#191F28] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#333D4B]"
          >
            모두 읽음
          </button>
        </div>
      </div>

      {/* Status Pills Showcase */}
      <div className="rounded-[20px] border border-[#E5E8EB] bg-white p-4 shadow-2xs">
        <p className="mb-2.5 text-xs font-bold text-[#191F28]">상태 인디케이터 배지</p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F9F0] px-2.5 py-1 text-[11px] font-bold text-[#009957]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00C471]" />
            송금 완료
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F3FF] px-2.5 py-1 text-[11px] font-bold text-[#3182F6]">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[#3182F6]" />
            심사 진행 중
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFEBEE] px-2.5 py-1 text-[11px] font-bold text-[#F04452]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F04452]" />
            출금 실패
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-[#3182F6] px-2 py-0.5 text-[10px] font-extrabold text-white">
            <Sparkles className="h-2.5 w-2.5" />
            NEW
          </span>
        </div>
      </div>

      {/* Interactive Inbox with Dot Indicators */}
      <div className="rounded-[20px] border border-[#E5E8EB] bg-white p-3 shadow-2xs space-y-1">
        <p className="px-2 py-1 text-[11px] font-semibold text-[#8B95A1]">
          항목을 클릭해 읽음 처리해 보세요
        </p>
        {alerts.map((alert) => (
          <button
            key={alert.id}
            type="button"
            onClick={() => markAlertRead(alert.id)}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition ${
              alert.unread ? 'bg-[#F9FAFB] hover:bg-[#E8F3FF]/50' : 'opacity-65'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`h-2 w-2 shrink-0 rounded-full transition ${
                  alert.unread ? 'bg-[#3182F6]' : 'bg-transparent'
                }`}
              />
              <span className="truncate text-xs font-semibold text-[#191F28]">{alert.title}</span>
            </div>
            <span className="shrink-0 pl-2 text-[10px] text-[#8B95A1]">{alert.time}</span>
          </button>
        ))}
      </div>

      {/* Simulated Bottom Tab Bar with Live Badges */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-[#E5E8EB] bg-white/95 px-4 pb-5 pt-2.5 backdrop-blur">
        <button type="button" className="flex flex-col items-center gap-0.5 text-[#8B95A1]">
          <Home className="h-4 w-4" />
          <span className="text-[10px] font-semibold">홈</span>
        </button>

        <button type="button" className="relative flex flex-col items-center gap-0.5 text-[#8B95A1]">
          <div className="relative">
            <CreditCard className="h-4 w-4" />
            <span className="absolute -right-1 -top-0.5 h-2 w-2 rounded-full bg-[#F04452] ring-2 ring-white" />
          </div>
          <span className="text-[10px] font-semibold">혜택(Dot)</span>
        </button>

        <button
          type="button"
          aria-label={`읽지 않은 알림 ${unreadCount}건`}
          className="relative flex flex-col items-center gap-0.5 text-[#3182F6]"
        >
          <div className="relative">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-2.5 -top-1.5 inline-flex min-w-4 items-center justify-center rounded-full bg-[#F04452] px-1 py-0.5 text-[9px] font-extrabold leading-none text-white ring-2 ring-white tabular-nums">
                {displayCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">알림</span>
        </button>

        <button type="button" className="flex flex-col items-center gap-0.5 text-[#8B95A1]">
          <Mail className="h-4 w-4" />
          <span className="text-[10px] font-semibold">메시지</span>
        </button>
      </div>
    </div>
  );
}
