import React, { useState, useEffect } from 'react';
import { useMarkdownStore } from '../../store/useMarkdownStore';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Package, Download, Folder, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';

interface CodeBlock {
  language: string;
  filename: string;
  code: string;
  path: string;
}

export const CodeExtractorModal: React.FC = () => {
  const { showCodeExtractor, setShowCodeExtractor, tabs, activeTabId } = useMarkdownStore();
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
  const [expandedBlocks, setExpandedBlocks] = useState<Set<number>>(new Set());
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const activeTab = tabs.find(t => t.id === activeTabId);

  useEffect(() => {
    if (showCodeExtractor && activeTab) {
      extractBlocks(activeTab.content);
      // Default to closed => empty set
      setExpandedBlocks(new Set());
      setCopiedIndex(null);
    }
  }, [showCodeExtractor, activeTab]);

  const extractBlocks = (content: string) => {
    const blocks: CodeBlock[] = [];
    // Matches indentation, 3+ backticks, header text, newlines, content, newline, matching indentation, and exact same backticks
    const blockRegex = /^([ \t]*)(`{3,})([^\n]*?)\r?\n([\s\S]*?)\r?\n\1\2[ \t]*(?:\r?\n|$)/gm;
    let match;
    let index = 1;

    while ((match = blockRegex.exec(content)) !== null) {
      const rawHeader = match[3].trim();
      let language = 'text';
      let filenameInfo = '';

      if (rawHeader) {
        const spaceIdx = rawHeader.indexOf(' ');
        if (spaceIdx !== -1) {
          language = rawHeader.slice(0, spaceIdx).trim();
          filenameInfo = rawHeader.slice(spaceIdx + 1).trim();
        } else {
          language = rawHeader;
        }

        if (language.includes(':')) {
          const parts = language.split(':');
          language = parts[0];
          if (!filenameInfo && parts.length > 1) {
            filenameInfo = parts.slice(1).join(':');
          }
        }
      }
      
      const code = match[4];
      
      // Attempt to find filename in the first line if it's a comment
      if (!filenameInfo) {
        const firstLine = code.split('\n')[0].trim();
        if (firstLine.startsWith('//') || firstLine.startsWith('#') || firstLine.startsWith('/*')) {
           const cleaned = firstLine.replace(/^(\/\/|#|\/\*)\s*/, '').replace(/\*\/$/, '').trim();
           // Very rudimentary check that it looks like a path
           if (cleaned.includes('.') || cleaned.includes('/')) {
              filenameInfo = cleaned;
           }
        }
      }

      const pathInfo = filenameInfo || `${language}-block-${index}.${getFileExtension(language)}`;
      const filename = pathInfo.split('/').pop() || pathInfo;

      blocks.push({
        language,
        filename,
        path: pathInfo,
        code
      });
      index++;
    }
    setCodeBlocks(blocks);
  };

  const getFileExtension = (lang: string) => {
    const extMap: Record<string, string> = {
      javascript: 'js', js: 'js',
      typescript: 'ts', ts: 'ts',
      jsx: 'jsx', tsx: 'tsx',
      python: 'py', py: 'py',
      html: 'html', css: 'css',
      json: 'json', markdown: 'md', md: 'md',
      bash: 'sh', shell: 'sh',
      text: 'txt', txt: 'txt'
    };
    return extMap[lang.toLowerCase()] || 'txt';
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    
    codeBlocks.forEach(block => {
      // create folders based on path
      zip.file(block.path, block.code);
    });

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `extracted-code-${Date.now()}.zip`);
    } catch (e) {
      console.error('Error generating zip:', e);
      alert('Failed to generate ZIP check console');
    }
  };

  const toggleBlock = (index: number) => {
    setExpandedBlocks(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleCopy = async (e: React.MouseEvent, text: string, index: number) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!showCodeExtractor) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCodeExtractor(false)}>
      <div className="bg-[var(--color-bg-deep)] border border-[var(--color-border)] rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-[var(--color-border)] font-semibold flex items-center justify-between bg-[var(--color-bg-header)] shrink-0">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-400" />
            <span>Extracted Code Blocks</span>
          </div>
          <button onClick={() => setShowCodeExtractor(false)} className="text-[var(--color-text-muted)] hover:text-white">&times;</button>
        </div>
        
        <div className="p-4 overflow-auto flex-1 bg-[var(--color-bg-main)]">
          {codeBlocks.length === 0 ? (
            <div className="text-center py-8 text-[var(--color-text-muted)] flex flex-col items-center gap-2">
              <Folder className="w-12 h-12 opacity-20" />
              <p>No code blocks found in this markdown file.</p>
              <p className="text-xs">
                To name a file, add it after the language like: <br/>
                <code className="text-[var(--color-text-main)]">```tsx src/App.tsx</code>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {codeBlocks.map((block, i) => (
                <div key={i} className="border border-[var(--color-border)] rounded overflow-hidden flex flex-col">
                  <div 
                    className="bg-[var(--color-bg-header)] px-3 py-1.5 flex items-center justify-between border-b border-[var(--color-border)] text-xs cursor-pointer select-none"
                    onClick={() => toggleBlock(i)}
                  >
                    <div className="flex items-center gap-2">
                      {expandedBlocks.has(i) ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      <span className="font-mono text-[var(--color-accent)]">{block.path}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="opacity-50">{block.language}</span>
                      <button 
                        onClick={(e) => handleCopy(e, block.code, i)}
                        className="text-[var(--color-text-muted)] hover:text-white flex items-center gap-1 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === i ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  {expandedBlocks.has(i) && (
                    <div className="p-3 bg-[var(--color-bg-editor)] max-h-[300px] overflow-auto">
                      <pre className="text-xs font-mono m-0">
                        <code>{block.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-bg-header)] flex justify-between shrink-0">
          <div className="text-xs text-[var(--color-text-muted)] flex items-center">
            {codeBlocks.length} block{codeBlocks.length !== 1 && 's'} found
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowCodeExtractor(false)} className="px-3 py-1.5 text-[var(--color-text-muted)] hover:text-white transition-colors text-sm">Cancel</button>
            <button 
              onClick={handleDownload} 
              disabled={codeBlocks.length === 0}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Download ZIP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
