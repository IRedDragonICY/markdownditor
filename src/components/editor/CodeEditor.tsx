import React, { useEffect, useRef, useMemo } from 'react';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import { openSearchPanel } from '@codemirror/search';
import { EditorView } from '@codemirror/view';
import { vim } from '@replit/codemirror-vim';
import { Extension } from '@codemirror/state';
import { undo, redo } from '@codemirror/commands';
import { useMarkdownStore } from '../../store/useMarkdownStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { scrollSync, handleEditorScroll } from '../../utils/scrollSync';

export const CodeEditor: React.FC = () => {
  const { tabs, activeTabId, setContent, formatTrigger, searchTrigger, undoTrigger, redoTrigger } = useMarkdownStore();
  const { vimMode, wordWrap, lineNumbers, theme } = useSettingsStore();

  const activeTab = tabs.find(t => t.id === activeTabId);
  const content = activeTab ? activeTab.content : '';
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  const extensions = useMemo(() => {
    const exts: Extension[] = [markdown({ base: markdownLanguage, codeLanguages: languages })];
    if (vimMode) {
      exts.push(vim());
    }
    if (wordWrap) {
      exts.push(EditorView.lineWrapping);
    }
    return exts;
  }, [vimMode, wordWrap]);

  const [isSystemDark, setIsSystemDark] = React.useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setIsSystemDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const effectiveTheme = theme === 'system' ? (isSystemDark ? 'dark' : 'light') : theme;
  const editorTheme = effectiveTheme === 'light' ? githubLight : githubDark;

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
    const { prefix, suffix = '', block = false, replace = false, isMath = false } = formatTrigger.payload;
    
    const selection = view.state.selection.main;
    const selectedText = view.state.sliceDoc(selection.from, selection.to);

    let finalPrefix = prefix;
    let finalSuffix = suffix;

    if (isMath) {
      const fullDoc = view.state.doc.toString();
      const textBefore = fullDoc.slice(0, selection.from);
      
      let totalDoubleBefore = (textBefore.match(/(?<!\\)\$\$/g) || []).length;
      
      const currentLineTextBefore = textBefore.split('\n').pop() || '';
      const stringWithoutDouble = currentLineTextBefore.replace(/(?<!\\)\$\$/g, '');
      let currentLineSingleBefore = (stringWithoutDouble.match(/(?<!\\)\$/g) || []).length;

      const inMath = totalDoubleBefore % 2 !== 0 || currentLineSingleBefore % 2 !== 0;

      if (!inMath) {
        if (block) {
          finalPrefix = `$$\n${prefix}`;
          finalSuffix = `${suffix}\n$$`;
        } else {
          finalPrefix = `$${prefix}`;
          finalSuffix = `${suffix}$`;
        }
      }
    }

    if (replace) {
      view.dispatch({
        changes: {
          from: selection.from,
          to: selection.to,
          insert: finalPrefix
        },
        // Put cursor after inserted template
        selection: { anchor: selection.from + finalPrefix.length, head: selection.from + finalPrefix.length }
      });
      view.focus();
      return;
    }
    
    const isLineByLine = block && !finalSuffix && !isMath;
    
    if (isLineByLine) {
      const lineStart = view.state.doc.lineAt(selection.from).from;
      const lineEnd = view.state.doc.lineAt(selection.to).to;
      const fullSelectedText = view.state.sliceDoc(lineStart, lineEnd);
      
      let fullInsertStr = '';
      if (finalPrefix.includes('\n')) {
        const parts = finalPrefix.split('\n');
        const firstLinePrefix = finalPrefix;
        const restLinePrefix = parts[parts.length - 1]; // E.g., "> " from "> [!NOTE]\n> "
        
        fullInsertStr = fullSelectedText.split('\n').map((line, i) => i === 0 ? `${firstLinePrefix}${line}` : `${restLinePrefix}${line}`).join('\n');
      } else {
        fullInsertStr = fullSelectedText.split('\n').map((line, i) => {
          if (finalPrefix === '1. ') {
            return `${i + 1}. ${line}`;
          }
          return `${finalPrefix}${line}`;
        }).join('\n');
      }
      
      view.dispatch({
        changes: {
          from: lineStart,
          to: lineEnd,
          insert: fullInsertStr
        },
        selection: { anchor: lineStart, head: lineStart + fullInsertStr.length }
      });
      view.focus();
      return;
    }

    if (block && !isMath) {
      // For block elements that wrap the whole section (Code Blocks, Divs)
      const lineStart = view.state.doc.lineAt(selection.from).from;
      const lineEnd = view.state.doc.lineAt(selection.to).to;
      const fullSelectedText = view.state.sliceDoc(lineStart, lineEnd);
      
      const insertContent = fullSelectedText ? `${finalPrefix}${fullSelectedText}${finalSuffix}` : (suffix ? `${finalPrefix}text${finalSuffix}` : `${finalPrefix}${finalSuffix}`);
      
      view.dispatch({
        changes: {
          from: lineStart,
          to: lineEnd,
          insert: insertContent
        },
        selection: { anchor: lineStart + finalPrefix.length, head: lineStart + finalPrefix.length + (fullSelectedText ? fullSelectedText.length : (suffix ? 4 : 0)) }
      });
    } else {
      // Inline elements
      const insertContent = selectedText ? `${finalPrefix}${selectedText}${finalSuffix}` : (suffix ? `${finalPrefix}text${finalSuffix}` : `${finalPrefix}${finalSuffix}`);

      view.dispatch({
        changes: {
          from: selection.from,
          to: selection.to,
          insert: insertContent
        },
        selection: { anchor: selection.from + finalPrefix.length, head: selection.from + finalPrefix.length + (selectedText ? selectedText.length : (suffix ? 4 : 0)) }
      });
    }
    view.focus();
  }, [formatTrigger]);

  useEffect(() => {
    if (!searchTrigger || !editorRef.current?.view) return;
    openSearchPanel(editorRef.current.view);
  }, [searchTrigger]);

  useEffect(() => {
    if (!undoTrigger || !editorRef.current?.view) return;
    undo(editorRef.current.view);
  }, [undoTrigger]);

  useEffect(() => {
    if (!redoTrigger || !editorRef.current?.view) return;
    redo(editorRef.current.view);
  }, [redoTrigger]);

  return (
    <div className="h-full w-full overflow-hidden flex flex-col bg-[var(--color-bg-editor)]">
      <CodeMirror
        ref={editorRef}
        value={content}
        height="100%"
        theme={editorTheme}
        extensions={extensions}
        onChange={(value) => setContent(value)}
        className="flex-1 overflow-auto text-base editor-container"
        basicSetup={{
          lineNumbers: lineNumbers,
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
