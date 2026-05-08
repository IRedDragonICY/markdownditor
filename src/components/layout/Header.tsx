import React from 'react';
import { useMarkdownStore } from '../../store/useMarkdownStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Maximize2, Settings, ArrowDownUp } from 'lucide-react';

export const Header: React.FC = () => {
  const { tabs, activeTabId, viewMode, setViewMode, syncScroll, setSyncScroll } = useMarkdownStore();
  const setShowSettings = useSettingsStore(s => s.setShowSettings);
  
  const activeTab = tabs.find(t => t.id === activeTabId);
  const content = activeTab ? activeTab.content : '';

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const chars = content.length;
  const readTime = Math.max(1, Math.ceil(words / 200));

  return (
    <header className="h-12 border-b border-[var(--color-border)] bg-[var(--color-bg-header)] flex items-center px-4 justify-between shrink-0">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-sm tracking-tight text-[var(--color-text-main)]">markdownditor</span>
        <div className="h-4 w-[1px] bg-[var(--color-border)] mx-2"></div>
        <span className="text-xs text-[var(--color-text-muted)]">{activeTab?.title || ''}</span>
      </div>
      
      {/* Live Stats */}
      <div className="hidden md:flex items-center gap-6 text-[11px] text-[var(--color-text-muted)] uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <span className="font-medium text-[var(--color-text-main)]">{words}</span> words
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-[var(--color-text-main)]">{chars}</span> chars
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-[var(--color-text-main)]">{readTime} min</span> read
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {viewMode === 'split' && (
          <button
            onClick={() => setSyncScroll(!syncScroll)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium transition-colors ${
              syncScroll 
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-500 hover:bg-blue-500/20' 
                : 'bg-transparent border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-hover)]'
            }`}
            title="Toggle Sync Scroll"
          >
            <ArrowDownUp className="w-3.5 h-3.5" />
            Sync Scroll
          </button>
        )}
        <div className="flex bg-[var(--color-bg-editor)] rounded p-1 border border-[var(--color-border)]">
          <button 
            className={`px-3 py-1 rounded text-xs transition-colors ${viewMode === 'split' ? 'bg-[var(--color-bg-hover)] shadow-sm text-[var(--color-text-main)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'}`}
            onClick={() => setViewMode('split')}
          >
            Split
          </button>
          <button 
            className={`px-3 py-1 rounded text-xs transition-colors ${viewMode === 'editor' ? 'bg-[var(--color-bg-hover)] shadow-sm text-[var(--color-text-main)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'}`}
            onClick={() => setViewMode('editor')}
          >
            Edit
          </button>
          <button 
            className={`px-3 py-1 rounded text-xs transition-colors ${viewMode === 'preview' ? 'bg-[var(--color-bg-hover)] shadow-sm text-[var(--color-text-main)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'}`}
            onClick={() => setViewMode('preview')}
          >
            Preview
          </button>
        </div>
        <button className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-hover)] rounded-md transition-colors" title="Toggle Fullscreen">
          <Maximize2 className="w-4 h-4" />
        </button>
        <button className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-hover)] rounded-md transition-colors" title="Settings" onClick={() => setShowSettings(true)}>
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
