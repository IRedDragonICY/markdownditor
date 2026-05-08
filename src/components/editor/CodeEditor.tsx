import React, { useEffect, useRef } from 'react';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { githubDark } from '@uiw/codemirror-theme-github';
import { openSearchPanel } from '@codemirror/search';
import { useMarkdownStore } from '../../store/useMarkdownStore';
import { scrollSync, handleEditorScroll } from '../../utils/scrollSync';

export const CodeEditor: React.FC = () => {
  const { tabs, activeTabId, setContent, formatTrigger, searchTrigger } = useMarkdownStore();
  const activeTab = tabs.find(t => t.id === activeTabId);
  const content = activeTab ? activeTab.content : '';
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // Use an interval to keep checking for the scroller until it's rendered
    timer = setInterval(() => {
      const scroller = document.querySelector('.cm-scroller') as HTMLElement;
      if (scroller) {
        scrollSync.editor = scroller;
        scroller.addEventListener('scroll', handleEditorScroll);
        clearInterval(timer);
      }
    }, 100);

    return () => {
      clearInterval(timer);
      const scroller = document.querySelector('.cm-scroller') as HTMLElement;
      if (scroller) {
        scroller.removeEventListener('scroll', handleEditorScroll);
      }
      scrollSync.editor = null;
    };
  }, []);

  useEffect(() => {
    if (!formatTrigger || !editorRef.current?.view) return;

    const { view } = editorRef.current;
    const { prefix, suffix = '', block = false } = formatTrigger.payload;
    
    // Perform command injection
    const selection = view.state.selection.main;
    const selectedText = view.state.sliceDoc(selection.from, selection.to);
    
    if (block) {
      // For block elements, we might want to ensure we're on a new line
      const line = view.state.doc.lineAt(selection.from);
      const insertFrom = line.from;
      view.dispatch({
        changes: {
          from: insertFrom,
          to: selection.to,
          insert: `${prefix}${selectedText || 'text'}${suffix}`
        },
        selection: { anchor: insertFrom + prefix.length, head: insertFrom + prefix.length + (selectedText || 'text').length }
      });
    } else {
      // Inline elements
      view.dispatch({
        changes: {
          from: selection.from,
          to: selection.to,
          insert: `${prefix}${selectedText || 'text'}${suffix}`
        },
        selection: { anchor: selection.from + prefix.length, head: selection.from + prefix.length + (selectedText || 'text').length }
      });
    }
    view.focus();
  }, [formatTrigger]);

  useEffect(() => {
    if (!searchTrigger || !editorRef.current?.view) return;
    openSearchPanel(editorRef.current.view);
  }, [searchTrigger]);

  return (
    <div className="h-full w-full overflow-hidden flex flex-col bg-[var(--color-bg-deep)]">
      <CodeMirror
        ref={editorRef}
        value={content}
        height="100%"
        theme={githubDark}
        extensions={[
          markdown({ base: markdownLanguage, codeLanguages: languages })
        ]}
        onChange={(value) => setContent(value)}
        className="flex-1 overflow-auto text-base editor-container"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
      />
      <style suppressHydrationWarning>{`
        .cm-editor { height: 100%; outline: none !important; }
        .cm-scroller { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace; }
      `}</style>
    </div>
  );
};
