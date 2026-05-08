import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { visit } from 'unist-util-visit';
import 'highlight.js/styles/github-dark.css';
import { useMarkdownStore } from '../../store/useMarkdownStore';
import { scrollSync, handlePreviewScroll } from '../../utils/scrollSync';
import { Check, Copy, Info, AlertTriangle, Lightbulb, Flame, AlertCircle } from 'lucide-react';

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

const BlockquoteBlock = ({ children, ...props }: any) => {
  // Try to find if this is an alert block
  let alertType = null;
  let title = '';
  
  // ReactMarkdown passes the children as an array of elements or text.
  // The first child of a blockquote is usually a paragraph.
  let firstParagraphText = '';
  if (Array.isArray(children)) {
    const p = children.find(child => React.isValidElement(child) && child.type === 'p');
    if (p && p.props && p.props.children) {
      const pChildren = Array.isArray(p.props.children) ? p.props.children : [p.props.children];
      if (typeof pChildren[0] === 'string') {
        firstParagraphText = pChildren[0];
      }
    }
  } else if (React.isValidElement(children) && children.type === 'p') {
    const props = children.props as any;
    const pChildren = Array.isArray(props.children) ? props.children : [props.children];
    if (typeof pChildren[0] === 'string') {
      firstParagraphText = pChildren[0];
    }
  }

  const alertMap: Record<string, { icon: any, color: string, titleColor: string }> = {
    '[!NOTE]': { icon: Info, color: 'border-blue-500 bg-blue-500/10', titleColor: 'text-blue-500' },
    '[!TIP]': { icon: Lightbulb, color: 'border-green-500 bg-green-500/10', titleColor: 'text-green-500' },
    '[!IMPORTANT]': { icon: AlertCircle, color: 'border-purple-500 bg-purple-500/10', titleColor: 'text-purple-500' },
    '[!WARNING]': { icon: AlertTriangle, color: 'border-yellow-500 bg-yellow-500/10', titleColor: 'text-yellow-500' },
    '[!CAUTION]': { icon: Flame, color: 'border-red-500 bg-red-500/10', titleColor: 'text-red-500' }
  };

  for (const key in alertMap) {
    if (firstParagraphText.startsWith(key)) {
      alertType = key;
      title = key.replace(/\[!|\]/g, '');
      title = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
      break;
    }
  }

  if (alertType) {
    const { icon: Icon, color, titleColor } = alertMap[alertType as string];
    
    // We need to strip the alertType from the first paragraph
    const modifiedChildren = React.Children.map(children, child => {
      if (React.isValidElement(child) && child.type === 'p') {
        const props = child.props as any;
        const pChildren = Array.isArray(props.children) ? [...props.children] : [props.children];
        if (typeof pChildren[0] === 'string' && pChildren[0].startsWith(alertType)) {
          pChildren[0] = pChildren[0].substring(alertType.length).trimStart();
          if (pChildren[0].startsWith('\n')) {
             pChildren[0] = pChildren[0].substring(1);
          }
          if (pChildren[0] === '' && pChildren.length === 1) return null; // Remove empty paragraph
        }
        return React.cloneElement(child, child.props, ...pChildren);
      }
      return child;
    });

    return (
      <div className={`mt-4 mb-4 border-l-4 px-4 py-2 rounded-r-md ${color}`}>
        <div className={`flex items-center gap-2 mb-2 font-semibold ${titleColor}`}>
          <Icon className="w-4 h-4" />
          <span>{title}</span>
        </div>
        <div className="text-[var(--color-text-main)] overflow-hidden">
          {modifiedChildren}
        </div>
      </div>
    );
  }

  return (
    <blockquote {...props} className="border-l-4 border-[var(--color-border)] pl-4 italic text-[var(--color-text-muted)] my-4">
      {children}
    </blockquote>
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
      <article className="prose prose-invert max-w-none w-full prose-headings:border-b-0 prose-h1:border-b prose-h1:border-[var(--color-border)] prose-h1:pb-2 prose-h1:text-3xl prose-h1:font-bold prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4 prose-p:text-[#8b949e] prose-p:leading-relaxed prose-li:text-[#8b949e] prose-code:bg-[var(--color-border)] prose-code:px-1 prose-code:rounded prose-code:text-[#79c0ff] prose-code:before:content-none prose-code:after:content-none prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-none prose-pre:rounded-none prose-th:border prose-th:border-[var(--color-border)] prose-th:px-4 prose-th:py-2 prose-th:bg-[var(--color-bg-header)] prose-td:border prose-td:border-[var(--color-border)] prose-td:px-4 prose-td:py-2 prose-td:text-sm prose-th:text-sm prose-td:text-[#8b949e]">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeParseCodeMeta, rehypeHighlight]}
          components={{
            pre: PreBlock,
            blockquote: BlockquoteBlock,
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
