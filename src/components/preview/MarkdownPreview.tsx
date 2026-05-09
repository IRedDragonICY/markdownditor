import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkGemoji from 'remark-gemoji';
import rehypeHighlight from 'rehype-highlight';
import { visit } from 'unist-util-visit';
import { useMarkdownStore } from '../../store/useMarkdownStore';
import { scrollSync, handlePreviewScroll } from '../../utils/scrollSync';
import { Check, Copy, Info, AlertTriangle, Lightbulb, Flame, AlertCircle } from 'lucide-react';
import remarkGitHubAlerts from '../../utils/remarkGitHubAlerts';

const rehypeParseCodeMeta = () => {
  return (tree: any) => {
    visit(tree, 'element', (node: any, index, parent) => {
      if (node.tagName === 'code' && parent && parent.tagName === 'pre') {
        let className = node.properties?.className || [];
        if (!Array.isArray(className)) {
          className = [className];
        }
        
        let lang = '';
        let filename = '';
        
        const langClass = className.find((c: string) => c.startsWith('language-'));
        if (langClass) {
          if (langClass.includes(':')) {
            const parts = langClass.split(':');
            lang = parts[0].replace('language-', '');
            filename = parts.slice(1).join(':');
            // update className so rehype-highlight can recognize the language
            node.properties.className = className.map((c: string) => c === langClass ? parts[0] : c);
          } else {
            lang = langClass.replace('language-', '');
            // Check if there is data-meta or meta (from remark)
            if (node.data?.meta) {
               filename = node.data.meta;
            } else if (node.properties?.metastring) {
               filename = node.properties.metastring;
            }
          }
        }
        
        // Save the metadata on the pre node so the PreBlock component can read it
        parent.properties['data-lang'] = lang;
        parent.properties['data-filename'] = filename;
      }
    });
  };
};

const PreBlock = ({ children, node, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = () => {
    if (preRef.current) {
      navigator.clipboard.writeText(preRef.current.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lang = props['data-lang'] || '';
  const filename = props['data-filename'] || '';

  return (
    <div className="relative group my-8 rounded-lg overflow-hidden border border-[var(--color-border)] shadow-sm">
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-bg-editor)] border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          {lang && (
            <span className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-wider">
              {lang}
            </span>
          )}
          {filename && (
            <span className="text-xs text-[var(--color-text-muted)] font-mono">
              {filename}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-bg-hover)] transition-colors"
          title="Copy code"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Code Body */}
      <div className="relative bg-[var(--color-bg-header)]">
        <pre ref={preRef} {...props} className="m-0 p-4 overflow-x-auto text-sm leading-relaxed border-none rounded-none w-full max-w-full isolate">
          {children}
        </pre>
      </div>
    </div>
  );
};

export const MarkdownPreview: React.FC = () => {
  const { tabs, activeTabId, setContent } = useMarkdownStore();
  const activeTab = tabs.find(t => t.id === activeTabId);
  const content = activeTab ? activeTab.content : '';
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollSync.preview = scrollRef.current;
    }
    return () => {
      scrollSync.preview = null;
    };
  }, []);

  return (
    <div 
      ref={scrollRef}
      onScroll={handlePreviewScroll as any}
      className="h-full w-full overflow-y-auto px-10 py-10"
    >
      <article className="prose max-w-none w-full text-[var(--color-text-main)] prose-headings:text-[var(--color-text-main)] prose-p:text-[var(--color-text-muted)] prose-li:text-[var(--color-text-muted)] prose-strong:text-[var(--color-text-main)] prose-a:text-[var(--color-accent)] prose-headings:border-b-0 prose-h1:border-b prose-h1:border-[var(--color-border)] prose-h1:pb-2 prose-h1:text-3xl prose-h1:font-bold prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4 prose-p:leading-relaxed prose-code:bg-[var(--color-border)] prose-code:px-1 prose-code:rounded prose-code:text-[var(--color-accent)] prose-code:before:content-none prose-code:after:content-none prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-none prose-pre:rounded-none prose-th:border prose-th:border-[var(--color-border)] prose-th:px-4 prose-th:py-2 prose-th:bg-[var(--color-bg-header)] prose-th:text-[var(--color-text-main)] prose-td:border prose-td:border-[var(--color-border)] prose-td:px-4 prose-td:py-2 prose-td:text-sm prose-th:text-sm prose-td:text-[var(--color-text-muted)] prose-blockquote:border-l-4 prose-blockquote:border-[var(--color-border)] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-[var(--color-text-muted)] prose-blockquote:my-4">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkGemoji, remarkGitHubAlerts]}
          rehypePlugins={[rehypeParseCodeMeta, rehypeHighlight]}
          components={{
            pre: PreBlock,
            input: ({ node, ...props }) => {
              if (props.type === 'checkbox') {
                const { checked, disabled, ...rest } = props;
                return (
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      const article = e.target.closest('article');
                      if (!article) return;
                      const checkboxes = Array.from(article.querySelectorAll('input[type="checkbox"]'));
                      const index = checkboxes.indexOf(e.target as HTMLInputElement);
                      if (index !== -1) {
                        let currentIdx = 0;
                        const newContent = content.replace(/^((?:\s*>)*\s*[-*+]\s*\[)([xX ])(\])/gm, (match, p1, p2, p3) => {
                          if (currentIdx === index) {
                            currentIdx++;
                            return `${p1}${e.target.checked ? 'x' : ' '}${p3}`;
                          }
                          currentIdx++;
                          return match;
                        });
                        setContent(newContent);
                      }
                    }}
                    {...rest}
                    className="w-4 h-4 rounded appearance-none border border-[var(--color-border)] checked:bg-blue-500 checked:border-blue-500 checked:after:content-['✓'] checked:after:text-white checked:after:flex checked:after:justify-center checked:after:items-center checked:after:text-xs cursor-pointer align-middle relative mr-2 -mt-1 outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                );
              }
              return <input {...props} />;
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
};
