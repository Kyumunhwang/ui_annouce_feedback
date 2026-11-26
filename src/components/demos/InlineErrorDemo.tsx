import { useState } from 'react';
import { AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

export function InlineErrorDemo() {
  const [amount, setAmount] = useState('2500000');
  const [account, setAccount] = useState('10001234');
  const [touchedAmount, setTouchedAmount] = useState(true);
  const [touchedAccount, setTouchedAccount] = useState(true);
  const [shakeKey, setShakeKey] = useState(0);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const numericAmount = Number(amount.replace(/[^0-9]/g, ''));
  const cleanAccount = account.replace(/[^0-9]/g, '');

  const amountError = !touchedAmount
    ? ''
    : numericAmount === 0
      ? '송금할 금액을 입력해 주세요.'
      : numericAmount > 2000000
        ? '1회 최대 송금 한도(2,000,000원)를 초과했어요.'
        : '';

  const accountError = !touchedAccount
    ? ''
    : cleanAccount.length === 0
      ? '입금할 계좌번호를 입력해 주세요.'
      : cleanAccount.length < 10
        ? `계좌번호가 너무 짧아요. (${cleanAccount.length}/10~14자리)`
        : '';

  const isAmountValid = touchedAmount && !amountError && numericAmount > 0;
  const isAccountValid = touchedAccount && !accountError && cleanAccount.length >= 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouchedAmount(true);
    setTouchedAccount(true);

    const hasAmountErr = numericAmount === 0 || numericAmount > 2000000;
    const hasAccountErr = cleanAccount.length < 10;

    if (hasAmountErr || hasAccountErr) {
      setSubmittedSuccess(false);
      setShakeKey((k) => k + 1);
      return;
    }

    setSubmittedSuccess(true);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="rounded-[20px] border border-[#E5E8EB] bg-white p-4 shadow-2xs space-y-4">
        {/* Amount Field */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="demo-amount" className="text-xs font-bold text-[#333D4B]">
              송금 금액
            </label>
            <span className="text-[11px] font-medium text-[#8B95A1]">1회 한도 200만원</span>
          </div>

          <div
            key={`amt-${shakeKey}`}
            style={
              amountError && shakeKey > 0
                ? { animation: 'toss-shake 0.36s cubic-bezier(0.36, 0.07, 0.19, 0.97)' }
                : undefined
            }
            className="relative"
          >
            <input
              id="demo-amount"
              type="text"
              inputMode="numeric"
              value={numericAmount ? numericAmount.toLocaleString('ko-KR') : ''}
              onBlur={() => setTouchedAmount(true)}
              onChange={(e) => {
                setSubmittedSuccess(false);
                setAmount(e.target.value.replace(/[^0-9]/g, ''));
              }}
              aria-invalid={Boolean(amountError)}
              aria-describedby="demo-amount-msg"
              placeholder="얼마를 보낼까요?"
              className={`w-full rounded-2xl border px-3.5 py-3 pr-10 text-sm font-bold tabular-nums outline-none transition ${
                amountError
                  ? 'border-[#F04452] bg-[#FFF5F6] text-[#191F28] focus:ring-2 focus:ring-[#F04452]/20'
                  : isAmountValid
                    ? 'border-[#00C471] bg-white text-[#191F28] focus:ring-2 focus:ring-[#00C471]/20'
                    : 'border-[#E5E8EB] bg-white text-[#191F28] focus:border-[#3182F6] focus:ring-2 focus:ring-[#3182F6]/15'
              }`}
            />
            {isAmountValid && (
              <CheckCircle2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#00C471]" />
            )}
          </div>

          {amountError && (
            <p
              id="demo-amount-msg"
              role="alert"
              className="mt-1.5 flex items-center gap-1.5 text-[11.5px] font-semibold text-[#F04452]"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{amountError}</span>
            </p>
          )}

          {/* Quick Amount Presets */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[
              { label: '50만원(정상)', value: '500000' },
              { label: '150만원(정상)', value: '1500000' },
              { label: '250만원(한도초과)', value: '2500000' },
            ].map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => {
                  setAmount(preset.value);
                  setTouchedAmount(true);
                  setSubmittedSuccess(false);
                }}
                className="rounded-lg bg-[#F2F4F6] px-2.5 py-1 text-[11px] font-semibold text-[#4E5968] hover:bg-[#E5E8EB]"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Account Field */}
        <div>
          <label htmlFor="demo-account" className="mb-1.5 block text-xs font-bold text-[#333D4B]">
            입금 계좌번호 (숫자 10~14자리)
          </label>
          <div
            key={`acc-${shakeKey}`}
            style={
              accountError && shakeKey > 0
                ? { animation: 'toss-shake 0.36s cubic-bezier(0.36, 0.07, 0.19, 0.97)' }
                : undefined
            }
            className="relative"
          >
            <input
              id="demo-account"
              type="text"
              inputMode="numeric"
              maxLength={14}
              value={cleanAccount}
              onBlur={() => setTouchedAccount(true)}
              onChange={(e) => {
                setSubmittedSuccess(false);
                setAccount(e.target.value.replace(/[^0-9]/g, ''));
              }}
              aria-invalid={Boolean(accountError)}
              aria-describedby="demo-account-msg"
              placeholder="하이픈(-) 없이 숫자만 입력"
              className={`w-full rounded-2xl border px-3.5 py-3 pr-10 text-sm font-semibold tabular-nums outline-none transition ${
                accountError
                  ? 'border-[#F04452] bg-[#FFF5F6] text-[#191F28] focus:ring-2 focus:ring-[#F04452]/20'
                  : isAccountValid
                    ? 'border-[#00C471] bg-white text-[#191F28] focus:ring-2 focus:ring-[#00C471]/20'
                    : 'border-[#E5E8EB] bg-white text-[#191F28] focus:border-[#3182F6] focus:ring-2 focus:ring-[#3182F6]/15'
              }`}
            />
            {isAccountValid && (
              <CheckCircle2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#00C471]" />
            )}
          </div>

          {accountError && (
            <p
              id="demo-account-msg"
              role="alert"
              className="mt-1.5 flex items-center gap-1.5 text-[11.5px] font-semibold text-[#F04452]"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{accountError}</span>
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-[#3182F6] py-3 text-sm font-bold text-white transition hover:bg-[#1B64DA]"
        >
          입력 검증 후 송금하기
        </button>
      </div>

      {submittedSuccess && (
        <div
          style={{ animation: 'toss-pop 0.25s cubic-bezier(0.22, 1, 0.36, 1)' }}
          className="flex items-center gap-2 rounded-2xl bg-[#E6F9F0] px-4 py-3 text-xs font-bold text-[#009957]"
        >
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>모든 입력이 유효해 송금 요청이 정상 처리되었어요!</span>
        </div>
      )}
    </form>
  );
}
