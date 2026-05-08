import { create } from 'zustand';

export type ViewMode = 'split' | 'editor' | 'preview';

export type FormatActionPayload = {
  prefix: string;
  suffix?: string;
  block?: boolean;
};

export interface TabData {
  id: string;
  title: string;
  content: string;
}

interface MarkdownState {
  tabs: TabData[];
  activeTabId: string;
  viewMode: ViewMode;
  syncScroll: boolean;
  formatTrigger: { timestamp: number; payload: FormatActionPayload } | null;
  searchTrigger: number | null;
  showHelp: boolean;
  showInfo: boolean;
  setContent: (content: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setSyncScroll: (sync: boolean) => void;
  insertTextAtCursor: (payload: FormatActionPayload) => void;
  triggerSearch: () => void;
  setShowHelp: (show: boolean) => void;
  setShowInfo: (show: boolean) => void;
  addTab: () => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTabTitle: (id: string, title: string) => void;
}

export const DUMMY_CONTENT = `# Welcome to the Elite Markdown Editor

This is a **sophisticated** markdown editor and viewer, built with *React*, *TypeScript*, and *Tailwind CSS*.

## Features

1. **Live Preview**: See your markdown rendered instantly on the right.
2. **Formatting Toolbar**: Use the top toolbar to insert markdown syntax quickly.
3. **Split Pane**: Resize the editor and preview panes to your liking.

### Code Example

Here is a quick TypeScript snippet:

\`\`\`typescript:src/App.tsx
interface User {
  id: string;
  name: string;
}

const greet = (user: User) => {
  console.log(\`Hello, \${user.name}!\`);
};
\`\`\`

And a Rust snippet:

\`\`\`rust:src/config.rs
use std::fs::File;
use std::io::{Read, Write};
use std::path::PathBuf;

pub struct AppConfig {
    pub magic: u32,
    pub path: PathBuf,
}
\`\`\`

### Task List
- [x] Basic layout
- [x] CodeEditor integration
- [x] Markdown parsing
- [ ] Sync scrolling

> "Code is like humor. When you have to explain it, it’s bad." – Cory House

### Alerts (GitHub Flavored)

> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

### Tables

| Feature | Support |
|---------|---------|
| Markdown | Excellent |
| Code Highlighting | Perfect |
| Resizable Panels | Yes |

Enjoy writing your markdown!`;

export const useMarkdownStore = create<MarkdownState>((set) => ({
  tabs: [{ id: '1', title: 'welcome.md', content: DUMMY_CONTENT }],
  activeTabId: '1',
  viewMode: 'split',
  syncScroll: true,
  formatTrigger: null,
  searchTrigger: null,
  showHelp: false,
  showInfo: false,
  setContent: (content) => set((state) => ({
    tabs: state.tabs.map(tab => tab.id === state.activeTabId ? { ...tab, content } : tab)
  })),
  setViewMode: (viewMode) => set({ viewMode }),
  setSyncScroll: (syncScroll) => set({ syncScroll }),
  insertTextAtCursor: (payload) => set({ formatTrigger: { timestamp: Date.now(), payload } }),
  triggerSearch: () => set({ searchTrigger: Date.now() }),
  setShowHelp: (showHelp) => set({ showHelp }),
  setShowInfo: (showInfo) => set({ showInfo }),
  addTab: () => set((state) => {
    const newId = Math.random().toString(36).substr(2, 9);
    return {
      tabs: [...state.tabs, { id: newId, title: `Untitled-${state.tabs.length + 1}.md`, content: '' }],
      activeTabId: newId,
    };
  }),
  closeTab: (id) => set((state) => {
    const newTabs = state.tabs.filter(t => t.id !== id);
    if (newTabs.length === 0) {
      const newId = Math.random().toString(36).substr(2, 9);
      newTabs.push({ id: newId, title: 'Untitled-1.md', content: '' });
    }
    return {
      tabs: newTabs,
      activeTabId: state.activeTabId === id ? newTabs[newTabs.length - 1].id : state.activeTabId,
    };
  }),
  setActiveTab: (id) => set({ activeTabId: id }),
  updateTabTitle: (id, title) => set((state) => ({
    tabs: state.tabs.map(tab => tab.id === id ? { ...tab, title } : tab)
  })),
}));
