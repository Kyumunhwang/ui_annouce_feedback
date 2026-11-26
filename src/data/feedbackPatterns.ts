export type PatternId =
  | 'toast'
  | 'snackbar'
  | 'banner'
  | 'modal'
  | 'bottom-sheet'
  | 'inline-error'
  | 'tooltip'
  | 'coach-mark'
  | 'badge';

export type PatternCategory = '일시적' | '지속형' | '차단형' | '맥락형';

export interface FeedbackPatternMeta {
  id: PatternId;
  number: string;
  name: string;
  englishName: string;
  category: PatternCategory;
  urgency: '낮음' | '중간' | '높음';
  blocking: boolean;
  tagline: string;
  description: string;
  keywords: string[];
  whenToUse: string[];
  whenNotToUse: string[];
  uxGuidelines: {
    timing: string;
    placement: string;
    accessibility: string;
  };
  files: {
    reactFileName: string;
    htmlFileName: string;
  };
  snippets: {
    reactTailwind: string;
    vanillaHtml: string;
  };
}

export const FEEDBACK_PATTERNS: FeedbackPatternMeta[] = [
  {
    id: 'toast',
    number: '01',
    name: '토스트 알림',
    englishName: 'Toast',
    category: '일시적',
    urgency: '낮음',
    blocking: false,
    tagline: '작업 흐름을 방해하지 않고 결과를 짧게 전달하는 일시적 팝업',
    description:
      '저장, 복사, 송금 완료처럼 사용자의 즉각적인 판단이나 액션이 필요하지 않은 결과를 가볍게 알려줄 때 사용합니다. 일정 시간이 지나면 자동으로 사라집니다.',
    keywords: ['toast', '알림', '비차단', '자동소멸', '성공', '복사'],
    whenToUse: [
      '클립보드 복사, 설정 저장, 좋아요 등 가벼운 작업 완료 확인',
      '백그라운드 동기화 완료 또는 일시적 네트워크 지연 알림',
      '사용자가 현재 보던 화면 맥락을 끊지 않고 피드백만 전달할 때',
    ],
    whenNotToUse: [
      '실행 취소(Undo)나 재시도 버튼이 꼭 필요한 경우 (Snackbar 사용 권장)',
      '치명적인 오류나 사용자의 명시적 동의가 필요한 중요 경고 (Modal 사용)',
    ],
    uxGuidelines: {
      timing: '기본 2.5~3.5초 노출 후 자동 소멸 (마우스 호버 시 타이머 일시 정지)',
      placement: '모바일은 하단/상단 중앙 floating, 데스크톱은 우측 상단 또는 하단 중앙',
      accessibility: 'role="status" 및 aria-live="polite" 적용, 텍스트는 1~2줄 이내로 유지',
    },
    files: {
      reactFileName: 'ToastPattern.tsx',
      htmlFileName: 'toast-pattern.html',
    },
    snippets: {
      reactTailwind: `import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  variant: ToastVariant;
  message: string;
}

export function ToastExample() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const pushToast = (variant: ToastVariant, message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev.slice(-2), { id, variant, message }]);
  };

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3000);
    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <div className="p-6">
      <div className="flex gap-2">
        <button
          onClick={() => pushToast('success', '계좌번호가 복사되었어요')}
          className="rounded-xl bg-[#3182F6] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1B64DA]"
        >
          성공 토스트
        </button>
        <button
          onClick={() => pushToast('error', '네트워크 연결을 확인해주세요')}
          className="rounded-xl bg-[#F2F4F6] px-4 py-2.5 text-sm font-semibold text-[#333D4B] hover:bg-[#E5E8EB]"
        >
          오류 토스트
        </button>
      </div>

      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-6 left-1/2 z-50 flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center justify-between gap-3 rounded-2xl bg-[#191F28]/95 px-4 py-3 text-sm font-medium text-white shadow-lg backdrop-blur"
          >
            <div className="flex items-center gap-2.5">
              {toast.variant === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00C471]" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-[#F04452]" />
              )}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== toast.id))}
              aria-label="닫기"
              className="rounded-lg p-1 text-white/60 hover:bg-white/10 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}`,
      vanillaHtml: `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 24px; }
    .btn {
      border: 0; border-radius: 12px; padding: 10px 16px;
      font-size: 14px; font-weight: 600; cursor: pointer;
      background: #3182F6; color: #fff;
    }
    .toast-stack {
      position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%);
      display: flex; flex-direction: column; gap: 8px; z-index: 50; width: 320px;
    }
    .toast {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 16px; border-radius: 16px;
      background: rgba(25, 31, 40, 0.95); color: #fff; font-size: 14px;
      box-shadow: 0 12px 24px rgba(0, 27, 55, 0.16);
      animation: popIn 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .dot { width: 8px; height: 8px; border-radius: 999px; background: #00C471; flex-shrink: 0; }
    @keyframes popIn {
      from { opacity: 0; transform: translateY(8px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  </style>
</head>
<body>
  <button class="btn" onclick="showToast('계좌번호가 복사되었어요')">토스트 띄우기</button>
  <div id="toastStack" class="toast-stack" role="status" aria-live="polite"></div>

  <script>
    function showToast(message) {
      const stack = document.getElementById('toastStack');
      const el = document.createElement('div');
      el.className = 'toast';
      el.innerHTML = '<span class="dot"></span><span>' + message + '</span>';
      stack.appendChild(el);
      setTimeout(() => el.remove(), 3000);
    }
  </script>
</body>
</html>`,
    },
  },
  {
    id: 'snackbar',
    number: '02',
    name: '스낵바',
    englishName: 'Snackbar',
    category: '일시적',
    urgency: '중간',
    blocking: false,
    tagline: '짧은 결과 안내와 함께 실행 취소(Undo)·재시도 액션을 제공하는 하단 바',
    description:
      'Toast와 유사하게 화면 하단에 나타나지만, 단일 행동 버튼("실행 취소", "다시 시도")을 포함해 사용자가 방금 수행한 작업을 즉시 되돌릴 수 있게 돕습니다.',
    keywords: ['snackbar', 'undo', '실행취소', '복구', '삭제', '재시도'],
    whenToUse: [
      '항목 삭제·보관 처리 후 확인 모달 대신 빠른 실행 취소(Undo) 제공 시',
      '일시적 API 실패 후 "다시 시도" 버튼으로 즉시 복구 기회를 줄 때',
      '메시지 전송 취소나 필터 초기화 등 되돌리기 UX를 구현할 때',
    ],
    whenNotToUse: [
      '복구 불가능한 금융 거래나 계정 영구 삭제 (Modal로 사전 확인 필수)',
      '2개 이상의 복잡한 선택지가 필요한 경우 (Bottom Sheet 권장)',
    ],
    uxGuidelines: {
      timing: '액션 클릭 여유를 위해 4~5초 노출, 한 번에 1개만 표시',
      placement: '화면 하단 (모바일 하단 네비게이션 바 바로 위 16px 간격)',
      accessibility: '액션 버튼은 최소 44x36px 터치 영역 확보, 포커스 이동 가능하도록 구현',
    },
    files: {
      reactFileName: 'SnackbarPattern.tsx',
      htmlFileName: 'snackbar-pattern.html',
    },
    snippets: {
      reactTailwind: `import { useEffect, useState } from 'react';
import { Trash2, RotateCcw } from 'lucide-react';

export function SnackbarExample() {
  const [items, setItems] = useState(['자동이체 - 월세 65만원', '청약저축 - 매월 10일']);
  const [deleted, setDeleted] = useState<{ item: string; index: number } | null>(null);

  useEffect(() => {
    if (!deleted) return;
    const timer = setTimeout(() => setDeleted(null), 4500);
    return () => clearTimeout(timer);
  }, [deleted]);

  const handleDelete = (index: number) => {
    const target = items[index];
    setItems((prev) => prev.filter((_, i) => i !== index));
    setDeleted({ item: target, index });
  };

  const handleUndo = () => {
    if (!deleted) return;
    setItems((prev) => {
      const next = [...prev];
      next.splice(deleted.index, 0, deleted.item);
      return next;
    });
    setDeleted(null);
  };

  return (
    <div className="relative mx-auto max-w-sm space-y-2 p-4">
      {items.map((item, idx) => (
        <div
          key={item}
          className="flex items-center justify-between rounded-2xl border border-[#E5E8EB] bg-white px-4 py-3.5"
        >
          <span className="text-sm font-medium text-[#191F28]">{item}</span>
          <button
            onClick={() => handleDelete(idx)}
            className="rounded-lg p-1.5 text-[#8B95A1] hover:bg-[#FFEBEE] hover:text-[#F04452]"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      {deleted && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 flex w-[calc(100%-32px)] max-w-sm -translate-x-1/2 items-center justify-between rounded-2xl bg-[#191F28] px-4 py-3 text-sm text-white shadow-xl"
        >
          <span className="truncate pr-3">항목이 삭제되었어요</span>
          <button
            onClick={handleUndo}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#3182F6]/20 px-2.5 py-1 text-xs font-bold text-[#64A8FF] hover:bg-[#3182F6]/30"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            실행 취소
          </button>
        </div>
      )}
    </div>
  );
}`,
      vanillaHtml: `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 24px; background: #F2F4F6; }
    .card {
      display: flex; justify-content: space-between; align-items: center;
      background: #fff; padding: 14px 16px; border-radius: 16px; max-width: 340px;
    }
    .snackbar {
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      display: none; align-items: center; justify-content: space-between; gap: 16px;
      width: 320px; background: #191F28; color: #fff;
      padding: 12px 16px; border-radius: 16px; font-size: 14px;
    }
    .snackbar.show { display: flex; }
    .undo-btn {
      border: 0; background: transparent; color: #64A8FF;
      font-weight: 700; cursor: pointer; font-size: 13px;
    }
  </style>
</head>
<body>
  <div id="row" class="card">
    <span>자동이체 예약 항목</span>
    <button onclick="removeRow()">삭제</button>
  </div>
  <div id="snackbar" class="snackbar" role="status">
    <span>예약이 삭제되었어요</span>
    <button class="undo-btn" onclick="undoRow()">실행 취소</button>
  </div>

  <script>
    let timer;
    function removeRow() {
      document.getElementById('row').style.display = 'none';
      const bar = document.getElementById('snackbar');
      bar.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(() => bar.classList.remove('show'), 4500);
    }
    function undoRow() {
      document.getElementById('row').style.display = 'flex';
      document.getElementById('snackbar').classList.remove('show');
    }
  </script>
</body>
</html>`,
    },
  },
  {
    id: 'banner',
    number: '03',
    name: '상단 배너',
    englishName: 'Banner',
    category: '지속형',
    urgency: '중간',
    blocking: false,
    tagline: '시스템 상태나 필수 공지를 화면 상단에 고정해 지속적으로 안내하는 바',
    description:
      '자동으로 사라지지 않고 사용자가 문제를 해결하거나 직접 닫을 때까지 상단 레이아웃에 자리 잡아 중요한 시스템 상태와 행동 유도를 전달합니다.',
    keywords: ['banner', '공지', '시스템점검', '오프라인', '결제만료', '지속노출'],
    whenToUse: [
      '은행 점검 시간 안내, 오프라인 상태 등 서비스 전역 상태 공지',
      '결제 수단 만료 임박, 본인인증 미완료 등 조치가 필요한 알림',
      '레이아웃 시프트 없이 상단에 고정해 계속 인지시켜야 하는 정보',
    ],
    whenNotToUse: [
      '단순 저장/복사 성공처럼 몇 초 뒤 사라져도 되는 일회성 알림',
      '즉시 진행을 막고 반드시 확인을 받아야 하는 치명적 경고',
    ],
    uxGuidelines: {
      timing: '조건 해소 시점 또는 사용자가 닫기(X)를 누를 때까지 지속 노출',
      placement: '페이지 헤더 바로 아래 또는 관련 섹션 최상단 (전체 너비)',
      accessibility: '오류/경고 배너는 role="alert" 또는 명확한 명도 대비(4.5:1 이상) 준수',
    },
    files: {
      reactFileName: 'BannerPattern.tsx',
      htmlFileName: 'banner-pattern.html',
    },
    snippets: {
      reactTailwind: `import { useState } from 'react';
import { AlertTriangle, ArrowRight, X } from 'lucide-react';

export function BannerExample() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="rounded-xl bg-[#E8F3FF] px-3.5 py-2 text-xs font-semibold text-[#3182F6]"
      >
        배너 다시 보기
      </button>
    );
  }

  return (
    <div
      role="region"
      aria-label="결제 수단 안내"
      className="flex items-start justify-between gap-3 rounded-2xl border border-[#FFD699] bg-[#FFF8EB] p-4 text-[#191F28]"
    >
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#FF9500]" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-[#191F28]">등록된 카드가 이번 달 만료돼요</p>
          <p className="text-xs leading-relaxed text-[#4E5968]">
            정기 결제가 중단되지 않도록 새 카드를 미리 등록해 주세요.
          </p>
          <button className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#3182F6] hover:underline">
            카드 변경하기 <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <button
        onClick={() => setVisible(false)}
        aria-label="배너 닫기"
        className="rounded-lg p-1 text-[#8B95A1] hover:bg-black/5 hover:text-[#191F28]"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}`,
      vanillaHtml: `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 24px; }
    .banner {
      display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
      padding: 14px 16px; border-radius: 16px;
      background: #FFF8EB; border: 1px solid #FFD699; color: #191F28; max-width: 460px;
    }
    .banner-title { font-size: 14px; font-weight: 700; margin: 0 0 4px; }
    .banner-desc { font-size: 12px; color: #4E5968; margin: 0 0 8px; }
    .banner-cta { color: #3182F6; font-size: 12px; font-weight: 700; text-decoration: none; }
    .close-btn { border: 0; background: transparent; cursor: pointer; color: #8B95A1; font-size: 16px; }
  </style>
</head>
<body>
  <div id="noticeBanner" class="banner" role="region" aria-label="시스템 공지">
    <div>
      <p class="banner-title">오늘 23:50 ~ 00:30 은행 점검 예정</p>
      <p class="banner-desc">점검 중에는 오픈뱅킹 잔액 조회 및 이체가 일시 제한됩니다.</p>
      <a href="#details" class="banner-cta">자세히 보기 →</a>
    </div>
    <button class="close-btn" onclick="document.getElementById('noticeBanner').style.display='none'">✕</button>
  </div>
</body>
</html>`,
    },
  },
  {
    id: 'modal',
    number: '04',
    name: '확인 모달',
    englishName: 'Confirm Modal',
    category: '차단형',
    urgency: '높음',
    blocking: true,
    tagline: '배경을 차단하고 사용자의 명시적 결정을 요구하는 다이얼로그',
    description:
      '되돌릴 수 없는 삭제, 금융 송금 최종 승인, 약관 동의 등 중요한 분기점에서 사용자의 실수를 방지하기 위해 현재 화면 조작을 잠시 멈추고 명확한 선택을 받습니다.',
    keywords: ['modal', 'dialog', 'alert', '차단형', '삭제확인', '송금확인'],
    whenToUse: [
      '계정 탈퇴, 연결 해제, 데이터 영구 삭제 등 되돌릴 수 없는 위험 작업',
      '실제 금전 이체·결제 직전 금액과 수신자를 최종 검토할 때',
      '사용자 입력 없이 다음 흐름으로 넘어갈 수 없는 필수 의사결정',
    ],
    whenNotToUse: [
      '단순 결과 알림이나 정보 제공 목적 (Toast 또는 Banner 사용)',
      '모바일에서 옵션 목록 4~5개 중 하나를 고르는 경우 (Bottom Sheet가 엄지 조작에 유리)',
    ],
    uxGuidelines: {
      timing: '중요 액션 직전 트리거, 파괴적 모달은 배경 클릭 닫기 비활성화 권장',
      placement: '뷰포트 정중앙 오버레이 (어두운 딤드 배경 rgba(0, 0, 0, 0.45))',
      accessibility: 'role="dialog", aria-modal="true", 포커스 트랩 및 ESC 키 핸들링 필수',
    },
    files: {
      reactFileName: 'ModalPattern.tsx',
      htmlFileName: 'modal-pattern.html',
    },
    snippets: {
      reactTailwind: `import { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';

export function ModalExample() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <div className="p-6">
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-[#F04452] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#D93644]"
      >
        계좌 연결 해제
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="w-full max-w-xs rounded-[24px] bg-white p-6 shadow-2xl"
          >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFEBEE] text-[#F04452]">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h3 id="modal-title" className="text-lg font-bold text-[#191F28]">
              연결된 계좌를 해제할까요?
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#4E5968]">
              해제하면 자동이체와 잔액 알림이 즉시 중단되며, 다시 인증해야 연결할 수 있어요.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setOpen(false)}
                className="rounded-2xl bg-[#F2F4F6] py-3 text-sm font-semibold text-[#4E5968] hover:bg-[#E5E8EB]"
              >
                취소
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-2xl bg-[#F04452] py-3 text-sm font-semibold text-white hover:bg-[#D93644]"
              >
                해제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`,
      vanillaHtml: `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 24px; }
    .backdrop {
      position: fixed; inset: 0; background: rgba(0, 0, 0, 0.45);
      display: none; align-items: center; justify-content: center; padding: 16px;
    }
    .backdrop.open { display: flex; }
    .dialog {
      background: #fff; border-radius: 24px; padding: 24px; width: 100%; max-width: 320px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }
    .actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px; }
    .btn { border: 0; border-radius: 14px; padding: 12px; font-weight: 600; cursor: pointer; }
    .btn-cancel { background: #F2F4F6; color: #4E5968; }
    .btn-danger { background: #F04452; color: #fff; }
  </style>
</head>
<body>
  <button class="btn btn-danger" onclick="toggleModal(true)">계좌 해제</button>
  <div id="modalBackdrop" class="backdrop">
    <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dlgTitle">
      <h3 id="dlgTitle" style="margin:0 0 8px;font-size:18px;">계좌 연결을 해제할까요?</h3>
      <p style="margin:0;font-size:14px;color:#4E5968;line-height:1.5;">
        해제 시 예약된 자동이체 알림이 중단됩니다.
      </p>
      <div class="actions">
        <button class="btn btn-cancel" onclick="toggleModal(false)">취소</button>
        <button class="btn btn-danger" onclick="toggleModal(false)">해제하기</button>
      </div>
    </div>
  </div>

  <script>
    function toggleModal(open) {
      document.getElementById('modalBackdrop').classList.toggle('open', open);
    }
  </script>
</body>
</html>`,
    },
  },
  {
    id: 'bottom-sheet',
    number: '05',
    name: '바텀 시트',
    englishName: 'Bottom Sheet',
    category: '차단형',
    urgency: '중간',
    blocking: true,
    tagline: '모바일 엄지 영역에서 자연스럽게 선택·확인을 끌어내는 하단 시트',
    description:
      '화면 아래에서 부드럽게 올라와 한 손으로도 쉽게 조작할 수 있는 모바일 특화 컨테이너입니다. 은행 선택, 정렬 필터, 약관 동의 등 다수의 선택지를 깔끔하게 제공합니다.',
    keywords: ['bottom-sheet', '모바일', '엄지영역', '선택목록', '드래그', 'drawer'],
    whenToUse: [
      '모바일 환경에서 계좌·결제수단·정렬 옵션 등 복수 선택지 제공',
      '약관 동의나 간략한 정보 확인 후 다음 단계로 바로 이어지는 플로우',
      '중앙 모달보다 시각적 압박감을 낮추면서 맥락을 유지하고 싶을 때',
    ],
    whenNotToUse: [
      '데스크톱 넓은 화면의 단순 짧은 예/아니오 확인 (중앙 Modal이 시선 이동이 적음)',
      '복잡한 멀티 스텝 폼 입력 (별도 전체 페이지 전환 권장)',
    ],
    uxGuidelines: {
      timing: '280~320ms spring easing 진입, 핸들 드래그(80px 이상) 또는 배경 터치로 닫기',
      placement: '화면 최하단 고정, 상단 모서리 24px 둥글기 + 중앙 드래그 핸들 바 표시',
      accessibility: '핸들에 닫기 대체 버튼 또는 role="dialog" 포커스 관리 제공',
    },
    files: {
      reactFileName: 'BottomSheetPattern.tsx',
      htmlFileName: 'bottom-sheet-pattern.html',
    },
    snippets: {
      reactTailwind: `import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

const BANKS = ['토스뱅크 계좌 · 2,450,000원', 'KB국민 주거래 · 890,000원', '신한 쏠편한 · 120,500원'];

export function BottomSheetExample() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(BANKS[0]);

  return (
    <div className="p-4">
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between rounded-2xl border border-[#E5E8EB] bg-white px-4 py-3.5 text-sm font-semibold text-[#191F28]"
      >
        <span>{selected}</span>
        <ChevronDown className="h-4 w-4 text-[#8B95A1]" />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-[28px] bg-white px-5 pb-8 pt-3 shadow-2xl"
          >
            <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-[#D1D6DB]" />
            <h3 className="mb-3 text-base font-bold text-[#191F28]">출금할 계좌를 선택하세요</h3>
            <div className="space-y-1.5">
              {BANKS.map((bank) => {
                const active = selected === bank;
                return (
                  <button
                    key={bank}
                    onClick={() => {
                      setSelected(bank);
                      setOpen(false);
                    }}
                    className={\`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-sm font-medium transition \${
                      active ? 'bg-[#E8F3FF] text-[#3182F6] font-bold' : 'text-[#333D4B] hover:bg-[#F2F4F6]'
                    }\`}
                  >
                    <span>{bank}</span>
                    {active && <Check className="h-4 w-4 text-[#3182F6]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`,
      vanillaHtml: `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 24px; background: #F2F4F6; }
    .sheet-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.4);
      display: none; align-items: flex-end; justify-content: center;
    }
    .sheet-backdrop.open { display: flex; }
    .sheet {
      width: 100%; max-width: 420px; background: #fff;
      border-radius: 28px 28px 0 0; padding: 12px 20px 28px;
      animation: slideUp 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .handle { width: 40px; height: 5px; border-radius: 999px; background: #D1D6DB; margin: 0 auto 18px; }
    .opt {
      display: block; width: 100%; border: 0; background: transparent;
      text-align: left; padding: 14px 12px; border-radius: 14px; font-size: 14px; cursor: pointer;
    }
    .opt:hover { background: #E8F3FF; color: #3182F6; font-weight: 700; }
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  </style>
</head>
<body>
  <button onclick="openSheet(true)">출금 계좌 선택하기</button>
  <div id="sheetBg" class="sheet-backdrop" onclick="openSheet(false)">
    <div class="sheet" onclick="event.stopPropagation()">
      <div class="handle"></div>
      <h3 style="margin:0 0 12px;font-size:16px;">출금 계좌 선택</h3>
      <button class="opt" onclick="openSheet(false)">토스뱅크 계좌 · 2,450,000원</button>
      <button class="opt" onclick="openSheet(false)">KB국민 계좌 · 890,000원</button>
    </div>
  </div>

  <script>
    function openSheet(isOpen) {
      document.getElementById('sheetBg').classList.toggle('open', isOpen);
    }
  </script>
</body>
</html>`,
    },
  },
  {
    id: 'inline-error',
    number: '06',
    name: '인라인 에러',
    englishName: 'Inline Error',
    category: '맥락형',
    urgency: '중간',
    blocking: false,
    tagline: '입력 필드 바로 아래에서 원인과 해결 방법을 즉시 알려주는 폼 검증',
    description:
      '폼 제출 후 상단에 모아서 오류를 보여주거나 알림창을 띄우는 대신, 문제가 발생한 입력창 테두리와 하단 문구로 즉시 수정 지점을 정확히 짚어줍니다.',
    keywords: ['inline', 'validation', 'form', '입력오류', '에러메시지', '유효성'],
    whenToUse: [
      '송금 금액 한도 초과, 계좌번호 자릿수 오류 등 입력 필드별 검증',
      '비밀번호 규칙, 이메일 형식 등 실시간 충족 여부 안내',
      '사용자가 오류를 수정하자마자 즉시 정상 상태로 복구(긍정 피드백)할 때',
    ],
    whenNotToUse: [
      '서버 점검이나 권한 만료처럼 특정 입력칸과 무관한 전역 시스템 오류',
      '입력 전에 미리 알릴 필요가 없는 복잡한 설명 (Tooltip 권장)',
    ],
    uxGuidelines: {
      timing: '최초 입력 중에는 방해하지 않고 onBlur 시점부터 검증, 수정 중(onChange)엔 즉시 해소 반영',
      placement: '오류가 발생한 Input 바로 아래 6px 간격 + 붉은 보더(#F04452) 및 아이콘 병기',
      accessibility: '색상만으로 구분 금지(아이콘+텍스트 필수), aria-invalid 및 aria-describedby 연결',
    },
    files: {
      reactFileName: 'InlineErrorPattern.tsx',
      htmlFileName: 'inline-error-pattern.html',
    },
    snippets: {
      reactTailwind: `import { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function InlineErrorExample() {
  const [amount, setAmount] = useState('');
  const [touched, setTouched] = useState(false);

  const numericAmount = Number(amount.replace(/[^0-9]/g, ''));
  const errorMessage = !touched
    ? ''
    : numericAmount === 0
      ? '송금할 금액을 입력해 주세요.'
      : numericAmount > 2000000
        ? '1회 최대 송금 한도(2,000,000원)를 초과했어요.'
        : '';

  const isValid = touched && !errorMessage && numericAmount > 0;

  return (
    <div className="max-w-sm space-y-2 p-4">
      <label htmlFor="transfer-amount" className="block text-xs font-semibold text-[#4E5968]">
        송금 금액 (1회 한도 200만원)
      </label>
      <div className="relative">
        <input
          id="transfer-amount"
          type="text"
          inputMode="numeric"
          value={amount}
          onBlur={() => setTouched(true)}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby="amount-feedback"
          placeholder="예: 150000"
          className={\`w-full rounded-2xl border px-4 py-3 pr-10 text-sm font-semibold outline-none transition \${
            errorMessage
              ? 'border-[#F04452] bg-[#FFF5F6] text-[#191F28] focus:ring-2 focus:ring-[#F04452]/20'
              : isValid
                ? 'border-[#00C471] bg-white focus:ring-2 focus:ring-[#00C471]/20'
                : 'border-[#E5E8EB] bg-white focus:border-[#3182F6] focus:ring-2 focus:ring-[#3182F6]/20'
          }\`}
        />
        {isValid && (
          <CheckCircle2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#00C471]" />
        )}
      </div>
      {errorMessage && (
        <p id="amount-feedback" className="flex items-center gap-1.5 text-xs font-medium text-[#F04452]">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </p>
      )}
    </div>
  );
}`,
      vanillaHtml: `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 24px; }
    .field { max-width: 320px; }
    .input {
      width: 100%; box-sizing: border-box; padding: 12px 14px;
      border-radius: 14px; border: 1.5px solid #E5E8EB; font-size: 14px; outline: none;
    }
    .input.error { border-color: #F04452; background: #FFF5F6; }
    .msg { font-size: 12px; color: #F04452; margin-top: 6px; min-height: 18px; }
  </style>
</head>
<body>
  <div class="field">
    <label for="amt" style="display:block;font-size:12px;color:#4E5968;margin-bottom:6px;">송금 금액 (최대 200만원)</label>
    <input id="amt" class="input" placeholder="금액 입력" oninput="validate(this)" />
    <div id="err" class="msg"></div>
  </div>

  <script>
    function validate(el) {
      const val = Number(el.value.replace(/[^0-9]/g, ''));
      const err = document.getElementById('err');
      if (val > 2000000) {
        el.classList.add('error');
        err.textContent = '⚠ 1회 한도(2,000,000원)를 초과했어요.';
      } else {
        el.classList.remove('error');
        err.textContent = '';
      }
    }
  </script>
</body>
</html>`,
    },
  },
  {
    id: 'tooltip',
    number: '07',
    name: '툴팁',
    englishName: 'Tooltip',
    category: '맥락형',
    urgency: '낮음',
    blocking: false,
    tagline: '요소 주변에 짧고 명쾌한 보조 설명을 띄우는 마이크로 헬프 레이어',
    description:
      '금융 용어, 수수료 면제 조건, 아이콘 버튼의 기능 등 화면을 어지럽히지 않으면서 사용자가 궁금해할 때만 부가 정보를 제공하는 경량 팝오버입니다.',
    keywords: ['tooltip', '도움말', '아이콘설명', '용어안내', 'hover', 'tap'],
    whenToUse: [
      '아이콘만 있는 버튼의 의미나 단축키 설명 (데스크톱 Hover / Focus)',
      '"우대 금리 조건", "세전 수익률" 등 금융 용어 옆 (?) 아이콘 설명',
      '1~2줄 내외의 간결한 보충 설명이 필요할 때',
    ],
    whenNotToUse: [
      '사용자가 반드시 읽어야 하는 핵심 경고나 에러 메시지 (화면에 직접 표시해야 함)',
      '내부에 링크·버튼 여러 개가 들어가는 복잡한 상호작용 (Popover/Sheet 사용)',
    ],
    uxGuidelines: {
      timing: '호버/포커스 시 150ms 내 부드럽게 노출, 모바일에선 탭 토글 방식 지원',
      placement: '대상 요소 상단(Top) 기본, 화면 가장자리 충돌 시 하단/좌우 자동 반전',
      accessibility: '트리거에 aria-describedby 연결, role="tooltip", ESC 키로 닫힘 지원',
    },
    files: {
      reactFileName: 'TooltipPattern.tsx',
      htmlFileName: 'tooltip-pattern.html',
    },
    snippets: {
      reactTailwind: `import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export function TooltipExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-1.5 p-10">
      <span className="text-sm font-semibold text-[#191F28]">연 예상 수익률</span>
      <div
        className="relative inline-flex"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          aria-describedby="yield-tooltip"
          className="rounded-full p-1 text-[#8B95A1] hover:bg-[#F2F4F6] hover:text-[#3182F6]"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        {open && (
          <div
            id="yield-tooltip"
            role="tooltip"
            className="absolute bottom-full left-1/2 z-40 mb-2 w-56 -translate-x-1/2 rounded-xl bg-[#191F28] px-3.5 py-2.5 text-xs leading-relaxed text-white shadow-lg"
          >
            세전 기준 추정치이며 실제 지급 시 이자소득세(15.4%)가 원천징수됩니다.
            <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#191F28]" />
          </div>
        )}
      </div>
    </div>
  );
}`,
      vanillaHtml: `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 72px 24px; }
    .tip-wrap { position: relative; display: inline-flex; align-items: center; gap: 6px; }
    .tip-btn {
      width: 20px; height: 20px; border-radius: 999px; border: 0;
      background: #E5E8EB; color: #4E5968; font-size: 12px; font-weight: 700; cursor: pointer;
    }
    .tip-box {
      position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);
      width: 220px; background: #191F28; color: #fff; font-size: 12px; line-height: 1.45;
      padding: 10px 12px; border-radius: 12px; display: none;
    }
    .tip-wrap:hover .tip-box, .tip-wrap.active .tip-box { display: block; }
  </style>
</head>
<body>
  <div class="tip-wrap" id="tipWrap">
    <span>예상 이자 수익</span>
    <button class="tip-btn" onclick="document.getElementById('tipWrap').classList.toggle('active')">?</button>
    <div class="tip-box" role="tooltip">매일 자정 기준 잔액으로 일할 계산되어 익일 지급됩니다.</div>
  </div>
</body>
</html>`,
    },
  },
  {
    id: 'coach-mark',
    number: '08',
    name: '코치마크',
    englishName: 'Coach Mark',
    category: '맥락형',
    urgency: '낮음',
    blocking: true,
    tagline: '새로운 기능이나 첫 온보딩 동선을 스포트라이트로 짚어주는 단계별 가이드',
    description:
      '화면 전체를 살짝 어둡게 가리고 특정 UI 요소만 밝게 강조(Spotlight)하여 신규 사용자가 핵심 기능의 위치와 역할을 직관적으로 익히도록 돕습니다.',
    keywords: ['coach-mark', 'onboarding', 'spotlight', '온보딩', '투어', '신규기능'],
    whenToUse: [
      '최초 진입 사용자를 위한 핵심 기능 2~3단계 온보딩 투어',
      '대규모 UI 개편으로 주요 버튼 위치가 변경되었을 때 첫 1회 안내',
      '발견하기 어려운 숨은 편의 기능(예: 흔들어 송금하기) 홍보',
    ],
    whenNotToUse: [
      '매 방문마다 반복 노출 (최초 1회 노출 후 localStorage 등으로 상태 저장 필수)',
      '5단계 이상의 긴 튜토리얼 (사용자가 "건너뛰기"를 누를 확률이 급증)',
    ],
    uxGuidelines: {
      timing: '최초 1회만 자동 실행, 반드시 "건너뛰기" 버튼 및 단계 표시(1/3) 제공',
      placement: '대상 UI 요소 주변 스포트라이트 링 + 진행 방향 따라 상/하 카드 배치',
      accessibility: '포커스 이동 및 키보드 "다음/건너뛰기" 조작 지원',
    },
    files: {
      reactFileName: 'CoachMarkPattern.tsx',
      htmlFileName: 'coach-mark-pattern.html',
    },
    snippets: {
      reactTailwind: `import { useState } from 'react';

const STEPS = [
  { title: '원터치 빠른 송금', desc: '자주 보내는 계좌를 눌러 3초 만에 송금해 보세요.' },
  { title: '이번 달 소비 리포트', desc: '카테고리별 지출 변화를 한눈에 확인할 수 있어요.' },
];

export function CoachMarkExample() {
  const [step, setStep] = useState<number | null>(0);

  return (
    <div className="relative rounded-3xl bg-[#F2F4F6] p-5">
      <div className="space-y-3">
        <div
          className={\`rounded-2xl bg-white p-4 transition \${
            step === 0 ? 'relative z-20 ring-4 ring-[#3182F6] shadow-xl' : ''
          }\`}
        >
          <p className="text-sm font-bold text-[#191F28]">빠른 송금</p>
        </div>
        <div
          className={\`rounded-2xl bg-white p-4 transition \${
            step === 1 ? 'relative z-20 ring-4 ring-[#3182F6] shadow-xl' : ''
          }\`}
        >
          <p className="text-sm font-bold text-[#191F28]">소비 리포트</p>
        </div>
      </div>

      {step !== null && (
        <>
          <div className="fixed inset-0 z-10 bg-black/50" />
          <div className="relative z-20 mt-4 rounded-2xl bg-[#191F28] p-4 text-white shadow-xl">
            <div className="flex items-center justify-between text-xs text-[#64A8FF] font-semibold">
              <span>가이드 {step + 1} / {STEPS.length}</span>
              <button onClick={() => setStep(null)} className="text-white/60 hover:text-white">
                건너뛰기
              </button>
            </div>
            <p className="mt-1.5 text-sm font-bold">{STEPS[step].title}</p>
            <p className="mt-1 text-xs text-white/80">{STEPS[step].desc}</p>
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => setStep(step + 1 < STEPS.length ? step + 1 : null)}
                className="rounded-xl bg-[#3182F6] px-3.5 py-1.5 text-xs font-bold text-white"
              >
                {step + 1 < STEPS.length ? '다음' : '완료'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}`,
      vanillaHtml: `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 24px; background: #F2F4F6; }
    .dim { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.55); z-index: 10; }
    .target {
      position: relative; z-index: 20; background: #fff; padding: 16px;
      border-radius: 16px; box-shadow: 0 0 0 4px #3182F6; max-width: 280px;
    }
    .coach-card {
      position: relative; z-index: 20; margin-top: 12px; max-width: 280px;
      background: #191F28; color: #fff; border-radius: 16px; padding: 16px;
    }
  </style>
</head>
<body>
  <div id="dim" class="dim"></div>
  <div class="target"><strong>원터치 송금 버튼</strong></div>
  <div id="coachCard" class="coach-card">
    <div style="font-size:12px;color:#64A8FF;font-weight:700;">1 / 2 · 새로운 기능</div>
    <p style="margin:6px 0 12px;font-size:13px;">여기서 즐겨찾는 계좌로 바로 송금할 수 있어요.</p>
    <button onclick="closeTour()" style="background:#3182F6;color:#fff;border:0;border-radius:10px;padding:8px 12px;cursor:pointer;">확인</button>
  </div>

  <script>
    function closeTour() {
      document.getElementById('dim').style.display = 'none';
      document.getElementById('coachCard').style.display = 'none';
    }
  </script>
</body>
</html>`,
    },
  },
  {
    id: 'badge',
    number: '09',
    name: '배지 & 인디케이터',
    englishName: 'Badge & Status',
    category: '지속형',
    urgency: '낮음',
    blocking: false,
    tagline: '읽지 않은 알림 수나 진행 상태를 아이콘·텍스트 옆에 요약하는 표식',
    description:
      '사용자의 시선을 강제로 빼앗지 않으면서도 새 알림 존재 여부(Red Dot), 미확인 개수(99+), 승인·심사 등 현재 상태 라벨을 한눈에 인지시킵니다.',
    keywords: ['badge', 'indicator', 'dot', '알림수', '상태라벨', 'pill'],
    whenToUse: [
      '하단 탭 바 또는 알림 벨 아이콘 위의 읽지 않은 알림 개수 표시',
      '주문/심사/송금 상태("진행 중", "승인 완료", "실패") 요약 태그',
      '신규 기능 메뉴 옆의 "NEW" 또는 업데이트 Dot 표식',
    ],
    whenNotToUse: [
      '수백 개가 넘어가는 숫자를 그대로 노출 (99+로 상한 캡핑 필요)',
      '긴 문장이나 액션 버튼을 배지 안에 우겨넣는 행위',
    ],
    uxGuidelines: {
      timing: '상태 변경 즉시 반영, 알림을 열람하면 지체 없이 카운트 차감 또는 소멸',
      placement: '아이콘 우측 상단 모서리(-4px 오프셋) 또는 리스트 항목 우측 정렬',
      accessibility: '숫자 배지는 aria-label="읽지 않은 알림 5건"처럼 맥락 있는 대체 텍스트 제공',
    },
    files: {
      reactFileName: 'BadgePattern.tsx',
      htmlFileName: 'badge-pattern.html',
    },
    snippets: {
      reactTailwind: `import { useState } from 'react';
import { Bell } from 'lucide-react';

export function BadgeExample() {
  const [unread, setUnread] = useState(5);
  const formattedCount = unread > 99 ? '99+' : String(unread);

  return (
    <div className="flex items-center gap-4 p-6">
      <button
        onClick={() => setUnread(0)}
        aria-label={\`읽지 않은 알림 \${unread}건\`}
        className="relative rounded-2xl bg-[#F2F4F6] p-3 text-[#333D4B] hover:bg-[#E5E8EB]"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-[#F04452] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white ring-2 ring-white">
            {formattedCount}
          </span>
        )}
      </button>

      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F9F0] px-2.5 py-1 text-xs font-semibold text-[#009957]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#00C471]" />
        심사 승인 완료
      </span>
    </div>
  );
}`,
      vanillaHtml: `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 24px; display: flex; gap: 16px; align-items: center; }
    .bell-btn {
      position: relative; width: 44px; height: 44px; border-radius: 14px;
      border: 0; background: #F2F4F6; font-size: 18px; cursor: pointer;
    }
    .count-badge {
      position: absolute; top: -4px; right: -4px;
      min-width: 18px; padding: 2px 5px; border-radius: 999px;
      background: #F04452; color: #fff; font-size: 11px; font-weight: 700;
      border: 2px solid #fff;
    }
    .status-pill {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 10px; border-radius: 999px;
      background: #E6F9F0; color: #009957; font-size: 12px; font-weight: 600;
    }
    .status-dot { width: 6px; height: 6px; border-radius: 999px; background: #00C471; }
  </style>
</head>
<body>
  <button class="bell-btn" onclick="clearBadge()" aria-label="읽지 않은 알림 12건">
    🔔<span id="badge" class="count-badge">12</span>
  </button>
  <span class="status-pill"><span class="status-dot"></span>입금 확인됨</span>

  <script>
    function clearBadge() {
      document.getElementById('badge').style.display = 'none';
    }
  </script>
</body>
</html>`,
    },
  },
];
