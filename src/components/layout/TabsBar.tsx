import React, { useState, useRef, useEffect } from 'react';
import { useMarkdownStore } from '../../store/useMarkdownStore';
import { X, Plus, FileText } from 'lucide-react';

export const TabsBar: React.FC = () => {
  const { tabs, activeTabId, setActiveTab, closeTab, addTab, updateTabTitle } = useMarkdownStore();
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTabId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingTabId]);

  const handleDoubleClick = (e: React.MouseEvent, tabId: string, currentTitle: string) => {
    e.stopPropagation();
    setEditingTabId(tabId);
    setEditTitle(currentTitle);
  };

  const handleTitleSubmit = (tabId: string) => {
    if (editTitle.trim()) {
      updateTabTitle(tabId, editTitle.trim());
    }
    setEditingTabId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    if (e.key === 'Enter') {
      handleTitleSubmit(tabId);
    } else if (e.key === 'Escape') {
      setEditingTabId(null);
    }
  };

  return (
    <div className="flex items-center h-10 bg-[var(--color-bg-header)] border-b border-[var(--color-border)] overflow-x-auto overflow-y-hidden no-scrollbar">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          onDoubleClick={(e) => handleDoubleClick(e, tab.id, tab.title)}
          className={`group flex items-center h-full px-4 min-w-[140px] max-w-[200px] border-r border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-bg-hover)] transition-colors ${
            activeTabId === tab.id
              ? 'bg-[var(--color-bg-editor)] text-blue-500 font-medium border-t-2 border-t-blue-500'
              : 'bg-[var(--color-bg-header)] text-[var(--color-text-muted)] border-t-2 border-t-transparent'
          }`}
        >
          <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
          {editingTabId === tab.id ? (
            <input
              ref={inputRef}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={() => handleTitleSubmit(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              className="flex-1 bg-transparent border-none outline-none text-sm w-full min-w-0 px-0"
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="truncate text-sm flex-1">
              {tab.isDirty && <span className="mr-1 text-yellow-500">•</span>}
              {tab.title}
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
            className={`p-1 rounded-sm ml-2 flex-shrink-0 transition-opacity ${
              activeTabId === tab.id ? 'opacity-100 hover:bg-[var(--color-bg-main)]' : 'opacity-0 group-hover:opacity-100 hover:bg-[var(--color-bg-main)]'
            }`}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      <button
        onClick={addTab}
        className="h-full px-3 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-hover)] transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};
