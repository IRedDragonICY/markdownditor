import React from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Settings } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { 
    showSettings, setShowSettings, 
    vimMode, toggleVimMode,
    wordWrap, toggleWordWrap,
    lineNumbers, toggleLineNumbers,
    theme, setTheme 
  } = useSettingsStore();

  if (!showSettings) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowSettings(false)}>
      <div className="bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-lg shadow-xl w-full max-w-md overflow-hidden text-sm" onClick={e => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-[var(--color-border)] font-semibold flex items-center justify-between bg-[var(--color-bg-header)]">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[var(--color-text-muted)]" />
            <span>Settings</span>
          </div>
          <button onClick={() => setShowSettings(false)} className="text-[var(--color-text-muted)] hover:text-white transition-colors">&times;</button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-[var(--color-text-main)]">Vim Mode</div>
              <div className="text-xs text-[var(--color-text-muted)]">Enable Vim keybindings in the editor</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={vimMode} onChange={toggleVimMode} />
              <div className="w-9 h-5 bg-[var(--color-border)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--color-text-muted)] peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-[var(--color-text-main)]">Word Wrap</div>
              <div className="text-xs text-[var(--color-text-muted)]">Wrap long lines to fit the editor width</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={wordWrap} onChange={toggleWordWrap} />
              <div className="w-9 h-5 bg-[var(--color-border)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--color-text-muted)] peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-[var(--color-text-main)]">Line Numbers</div>
              <div className="text-xs text-[var(--color-text-muted)]">Show line numbers in the gutter</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={lineNumbers} onChange={toggleLineNumbers} />
              <div className="w-9 h-5 bg-[var(--color-border)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--color-text-muted)] peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="font-medium text-[var(--color-text-main)]">Theme</div>
              <div className="text-xs text-[var(--color-text-muted)]">Select your preferred color theme</div>
            </div>
            <select 
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'dark' | 'light' | 'system')}
              className="bg-[var(--color-bg-editor)] border border-[var(--color-border)] text-[var(--color-text-main)] text-sm rounded focus:ring-blue-500 focus:border-blue-500 block p-1.5"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System Default</option>
            </select>
          </div>
        </div>
        
        <div className="px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-bg-header)] flex justify-end">
          <button onClick={() => setShowSettings(false)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors">Done</button>
        </div>
      </div>
    </div>
  );
};
