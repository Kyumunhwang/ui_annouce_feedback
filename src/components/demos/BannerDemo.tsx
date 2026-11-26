import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Info,
  Sparkles,
  WifiOff,
  X,
} from 'lucide-react';

type BannerSeverity = 'info' | 'warning' | 'error' | 'promo';

const BANNER_PRESETS: Record<
  BannerSeverity,
  {
    label: string;
    title: string;
    body: string;
    cta: string;
    bg: string;
    border: string;
    iconColor: string;
  }
> = {
  info: {
    label: '점검 안내',
    title: '오늘 23:50 ~ 00:30 은행 점검 예정',
    body: '점검 시간 동안 오픈뱅킹 잔액 조회 및 타행 이체가 일시 제한돼요.',
    cta: '점검 은행 보기',
    bg: 'bg-[#E8F3FF]',
    border: 'border-[#BFD9FF]',
    iconColor: 'text-[#3182F6]',
  },
  warning: {
    label: '조치 필요',
    title: '등록된 카드가 이번 달 만료돼요',
    body: '자동 납부가 중단되지 않도록 결제 카드를 미리 교체해 주세요.',
    cta: '카드 변경하기',
    bg: 'bg-[#FFF8EB]',
    border: 'border-[#FFD699]',
    iconColor: 'text-[#FF9500]',
  },
  error: {
    label: '연결 오류',
    title: '오프라인 상태여서 최신 잔액이 아니에요',
    body: '네트워크 연결이 복구되면 자동으로 최신 거래내역을 불러옵니다.',
    cta: '연결 다시 확인',
    bg: 'bg-[#FFF0F1]',
    border: 'border-[#FFC5CA]',
    iconColor: 'text-[#F04452]',
  },
  promo: {
    label: '혜택 공지',
    title: '이자 바로 받기 기능이 새로 열렸어요',
    body: '매일 쌓인 이자를 기다리지 않고 버튼 한 번으로 바로 받아보세요.',
    cta: '이자 받으러 가기',
    bg: 'bg-[#E6F9F0]',
    border: 'border-[#A7ECCB]',
    iconColor: 'text-[#00A862]',
  },
};

export function BannerDemo() {
  const [severity, setSeverity] = useState<BannerSeverity>('warning');
  const [visible, setVisible] = useState(true);
  const [ctaFeedback, setCtaFeedback] = useState<string | null>(null);

  const preset = BANNER_PRESETS[severity];

  const renderIcon = () => {
    if (severity === 'warning') return <AlertTriangle className={`h-4 w-4 ${preset.iconColor}`} />;
    if (severity === 'error') return <WifiOff className={`h-4 w-4 ${preset.iconColor}`} />;
    if (severity === 'promo') return <Sparkles className={`h-4 w-4 ${preset.iconColor}`} />;
    return <Info className={`h-4 w-4 ${preset.iconColor}`} />;
  };

  return (
    <div className="space-y-4">
      {/* Persistent Top Banner Slot */}
      {visible ? (
        <div
          role={severity === 'error' ? 'alert' : 'region'}
          style={{ animation: 'toss-slide-down 0.28s cubic-bezier(0.22, 1, 0.36, 1)' }}
          className={`flex items-start justify-between gap-2.5 rounded-2xl border p-3.5 ${preset.bg} ${preset.border}`}
        >
          <div className="flex gap-2.5">
            <div className="mt-0.5 shrink-0">{renderIcon()}</div>
            <div>
              <p className="text-[13px] font-bold text-[#191F28]">{preset.title}</p>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-[#4E5968]">
                {preset.body}
              </p>
              <button
                type="button"
                onClick={() => setCtaFeedback(`‘${preset.cta}’ 화면으로 이동했습니다`)}
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#3182F6] hover:underline"
              >
                {preset.cta}
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setVisible(false)}
            aria-label="배너 닫기"
            className="shrink-0 rounded-lg p-1 text-[#8B95A1] transition hover:bg-black/5 hover:text-[#191F28]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-2xl border border-dashed border-[#D1D6DB] bg-white px-4 py-3">
          <span className="text-xs font-medium text-[#8B95A1]">배너를 닫았어요</span>
          <button
            type="button"
            onClick={() => setVisible(true)}
            className="rounded-xl bg-[#E8F3FF] px-3 py-1.5 text-xs font-bold text-[#3182F6] hover:bg-[#D5E7FF]"
          >
            다시 표시하기
          </button>
        </div>
      )}

      {ctaFeedback && (
        <div className="flex items-center gap-2 rounded-xl bg-[#191F28] px-3.5 py-2.5 text-xs font-medium text-white">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#00C471]" />
          <span>{ctaFeedback}</span>
        </div>
      )}

      {/* Mock App Content + Severity Controls */}
      <div className="rounded-[20px] border border-[#E5E8EB] bg-white p-4 shadow-2xs">
        <p className="text-xs font-bold text-[#191F28]">배너 유형 전환 테스트</p>
        <p className="mt-0.5 text-[11px] text-[#8B95A1]">
          배너는 화면을 가리지 않고 본문을 아래로 밀어내며 지속 노출됩니다.
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {(Object.keys(BANNER_PRESETS) as BannerSeverity[]).map((key) => {
            const active = severity === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSeverity(key);
                  setVisible(true);
                  setCtaFeedback(null);
                }}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                  active
                    ? 'bg-[#3182F6] text-white'
                    : 'bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]'
                }`}
              >
                {BANNER_PRESETS[key].label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dummy Content Showing No Overlap */}
      <div className="rounded-[20px] border border-[#E5E8EB] bg-white p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#8B95A1]">내 소비 요약</span>
          <span className="text-xs font-bold text-[#191F28] tabular-nums">1,240,000원</span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#F2F4F6]">
          <div className="h-full w-3/5 rounded-full bg-[#3182F6]" />
        </div>
      </div>
    </div>
  );
}
