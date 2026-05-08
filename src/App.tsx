/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';
import { useMarkdownStore } from './store/useMarkdownStore';
import { Header } from './components/layout/Header';
import { TabsBar } from './components/layout/TabsBar';
import { EditorToolbar } from './components/editor/EditorToolbar';
import { CodeEditor } from './components/editor/CodeEditor';
import { MarkdownPreview } from './components/preview/MarkdownPreview';

const InfoModal = () => {
  const { showInfo, setShowInfo } = useMarkdownStore();
  if (!showInfo) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowInfo(false)}>
      <div className="bg-[var(--color-bg-deep)] border border-[var(--color-border)] rounded-lg shadow-xl w-full max-w-md overflow-hidden text-sm" onClick={e => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-[var(--color-border)] font-semibold flex items-center justify-between bg-[var(--color-bg-header)]">
          <span>About markdownditor</span>
          <button onClick={() => setShowInfo(false)} className="text-[var(--color-text-muted)] hover:text-white">&times;</button>
        </div>
        <div className="p-4 space-y-3 text-[var(--color-text-muted)]">
          <p><strong>Version:</strong> 1.0.0</p>
          <p>A sophisticated, feature-rich Markdown Viewer & Editor web application with a pixel-perfect dark flat UI.</p>
          <p>Built with React, Tailwind CSS, CodeMirror, and Zustand.</p>
        </div>
        <div className="px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-bg-header)] flex justify-end">
          <button onClick={() => setShowInfo(false)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
};

const HelpModal = () => {
  const { showHelp, setShowHelp } = useMarkdownStore();
  if (!showHelp) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowHelp(false)}>
      <div className="bg-[var(--color-bg-deep)] border border-[var(--color-border)] rounded-lg shadow-xl w-full max-w-lg overflow-hidden text-sm" onClick={e => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-[var(--color-border)] font-semibold flex items-center justify-between bg-[var(--color-bg-header)]">
          <span>Help & Shortcuts</span>
          <button onClick={() => setShowHelp(false)} className="text-[var(--color-text-muted)] hover:text-white">&times;</button>
        </div>
        <div className="p-4 space-y-4 text-[var(--color-text-muted)] max-h-[60vh] overflow-auto">
          <p>Keyboard shortcuts are supported natively by the editor:</p>
          <ul className="space-y-2">
            <li><kbd className="px-1.5 py-0.5 bg-[#1e1e1e] border border-[#30363d] rounded text-[#c9d1d9] text-xs">Ctrl/Cmd + B</kbd> Bold</li>
            <li><kbd className="px-1.5 py-0.5 bg-[#1e1e1e] border border-[#30363d] rounded text-[#c9d1d9] text-xs">Ctrl/Cmd + I</kbd> Italic</li>
            <li><kbd className="px-1.5 py-0.5 bg-[#1e1e1e] border border-[#30363d] rounded text-[#c9d1d9] text-xs">Ctrl/Cmd + F</kbd> Find</li>
            <li><kbd className="px-1.5 py-0.5 bg-[#1e1e1e] border border-[#30363d] rounded text-[#c9d1d9] text-xs">Esc</kbd> Close Search / Modals</li>
          </ul>
          <p className="border-t border-[#30363d] pt-3">
            <strong>Markdown Alerts</strong><br/>
            You can use GitHub-style alerts in your markdown:<br/>
            <code>{'> [!NOTE]'}</code><br/>
            <code>{'> [!TIP]'}</code><br/>
            <code>{'> [!IMPORTANT]'}</code><br/>
            <code>{'> [!WARNING]'}</code><br/>
            <code>{'> [!CAUTION]'}</code>
          </p>
        </div>
        <div className="px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-bg-header)] flex justify-end">
          <button onClick={() => setShowHelp(false)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const { viewMode } = useMarkdownStore();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--color-bg-main)] text-[var(--color-text-main)] font-sans">
      <Header />
      <TabsBar />
      
      {/* If editor is visible, show the toolbar */}
      {(viewMode === 'split' || viewMode === 'editor') && <EditorToolbar />}

      <main className="flex-1 flex overflow-hidden">
        <Group orientation="horizontal" className="w-full h-full">
          {(viewMode === 'split' || viewMode === 'editor') && (
            <Panel 
              defaultSize={viewMode === 'split' ? 50 : 100}
              minSize={20}
              className="h-full flex flex-col bg-[var(--color-bg-editor)] font-mono text-sm leading-relaxed overflow-hidden"
            >
              <CodeEditor />
            </Panel>
          )}

          {viewMode === 'split' && (
            <Separator className="w-[2px] bg-[var(--color-border)] hover:bg-[var(--color-accent)] transition-colors cursor-col-resize shrink-0 z-10" />
          )}

          {(viewMode === 'split' || viewMode === 'preview') && (
            <Panel 
              defaultSize={viewMode === 'split' ? 50 : 100} 
              minSize={20}
              className="h-full bg-[var(--color-bg-main)] overflow-hidden"
            >
              <MarkdownPreview />
            </Panel>
          )}
        </Group>
      </main>

      <footer className="h-6 border-t border-[var(--color-border)] bg-[var(--color-bg-editor)] flex items-center px-3 justify-between shrink-0">
        <div className="flex items-center gap-4 text-[10px] text-[#484f58]">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            Ready
          </div>
          <span>Line 1, Column 1</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-[#484f58] uppercase">
          <span>UTF-8</span>
          <span>Markdown</span>
        </div>
      </footer>
      <HelpModal />
      <InfoModal />
    </div>
  );
}
