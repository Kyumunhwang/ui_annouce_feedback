import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { Check, Copy, FileCode2, WrapText } from 'lucide-react';
import type { FeedbackPatternMeta } from '../../data/feedbackPatterns';

type CodeTab = 'react' | 'html';

interface CodeViewerProps {
  pattern: FeedbackPatternMeta;
}

export function CodeViewer({ pattern }: CodeViewerProps) {
  const [activeTab, setActiveTab] = useState<CodeTab>('react');
  const [copied, setCopied] = useState(false);
  const [wordWrap, setWordWrap] = useState(false);

  const code =
    activeTab === 'react' ? pattern.snippets.reactTailwind : pattern.snippets.vanillaHtml;
  const language = activeTab === 'react' ? 'tsx' : 'markup';
  const fileName =
    activeTab === 'react' ? pattern.files.reactFileName : pattern.files.htmlFileName;
  const lineCount = code.split('\n').length;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <section
      aria-label="코드 스니펫 뷰어"
      className="flex h-full flex-col overflow-hidden bg-[#161B22] text-[#E6EDF3]"
    >
      {/* Top Editor Chrome */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#0D1117] px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]/90" />
          </div>
          <div className="flex min-w-0 items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 text-xs font-medium text-[#C9D1D9]">
            <FileCode2 className="h-3.5 w-3.5 shrink-0 text-[#58A6FF]" />
            <span className="truncate font-mono">{fileName}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setWordWrap((prev) => !prev)}
            title={wordWrap ? '줄 바꿈 끄기' : '줄 바꿈 켜기'}
            aria-pressed={wordWrap}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition ${
              wordWrap
                ? 'bg-[#3182F6]/25 text-[#64A8FF]'
                : 'text-[#8B949E] hover:bg-white/10 hover:text-white'
            }`}
          >
            <WrapText className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">줄바꿈</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              copied
                ? 'bg-[#00C471] text-white shadow-[0_0_16px_rgba(0,196,113,0.35)]'
                : 'bg-[#3182F6] text-white hover:bg-[#1B64DA]'
            }`}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>복사됨!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>코드 복사</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Language Tabs */}
      <div
        className="flex items-center gap-1 border-b border-white/10 bg-[#0D1117]/70 px-4 pt-2"
        role="tablist"
        aria-label="코드 형식 선택"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'react'}
          onClick={() => setActiveTab('react')}
          className={`relative rounded-t-lg px-3.5 py-2 text-xs font-semibold transition ${
            activeTab === 'react'
              ? 'bg-[#161B22] text-white'
              : 'text-[#8B949E] hover:text-[#C9D1D9]'
          }`}
        >
          React + Tailwind
          {activeTab === 'react' && (
            <span className="absolute inset-x-0 top-0 h-0.5 rounded-full bg-[#3182F6]" />
          )}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'html'}
          onClick={() => setActiveTab('html')}
          className={`relative rounded-t-lg px-3.5 py-2 text-xs font-semibold transition ${
            activeTab === 'html'
              ? 'bg-[#161B22] text-white'
              : 'text-[#8B949E] hover:text-[#C9D1D9]'
          }`}
        >
          HTML + CSS + JS
          {activeTab === 'html' && (
            <span className="absolute inset-x-0 top-0 h-0.5 rounded-full bg-[#3182F6]" />
          )}
        </button>
      </div>

      {/* Highlighted Code Body */}
      <div className="code-scrollbar flex-1 overflow-auto p-4 font-mono text-[12.5px] leading-6">
        <Highlight theme={themes.oneDark} code={code.trimEnd()} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} m-0 bg-transparent! p-0! ${
                wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
              }`}
              style={{ ...style, backgroundColor: 'transparent' }}
            >
              {tokens.map((line, i) => (
                <div
                  key={i}
                  {...getLineProps({ line })}
                  className="table-row hover:bg-white/[0.04]"
                >
                  <span className="table-cell select-none pr-4 text-right text-[11px] text-[#484F58] tabular-nums">
                    {i + 1}
                  </span>
                  <span className="table-cell">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>

      {/* Editor Footer */}
      <div className="flex items-center justify-between border-t border-white/10 bg-[#0D1117] px-4 py-2 text-[11px] text-[#8B949E]">
        <span>즉시 복사·실행 가능한 독립 스니펫</span>
        <span className="font-mono tabular-nums">
          {lineCount} lines · {activeTab === 'react' ? 'TSX' : 'HTML5'}
        </span>
      </div>
    </section>
  );
}
