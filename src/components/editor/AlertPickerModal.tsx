import React, { useState } from 'react';
import { useMarkdownStore } from '../../store/useMarkdownStore';
import { Info, Lightbulb, AlertTriangle, MessageSquareWarning, Flame } from 'lucide-react';

interface GitHubAlert {
  name: string;
  type: string;
  icon: React.ReactNode;
  markdown: string;
  color: string;
}

const ALERTS: GitHubAlert[] = [
  {
    name: 'Note',
    type: 'NOTE',
    icon: <Info className="w-5 h-5" />,
    markdown: '> [!NOTE]\n> ',
    color: 'text-blue-500 border-blue-500 bg-blue-500/10'
  },
  {
    name: 'Tip',
    type: 'TIP',
    icon: <Lightbulb className="w-5 h-5" />,
    markdown: '> [!TIP]\n> ',
    color: 'text-green-500 border-green-500 bg-green-500/10'
  },
  {
    name: 'Important',
    type: 'IMPORTANT',
    icon: <MessageSquareWarning className="w-5 h-5" />,
    markdown: '> [!IMPORTANT]\n> ',
    color: 'text-purple-500 border-purple-500 bg-purple-500/10'
  },
  {
    name: 'Warning',
    type: 'WARNING',
    icon: <AlertTriangle className="w-5 h-5" />,
    markdown: '> [!WARNING]\n> ',
    color: 'text-yellow-500 border-yellow-500 bg-yellow-500/10'
  },
  {
    name: 'Caution',
    type: 'CAUTION',
    icon: <Flame className="w-5 h-5" />,
    markdown: '> [!CAUTION]\n> ',
    color: 'text-red-500 border-red-500 bg-red-500/10'
  }
];

export const AlertPickerModal: React.FC = () => {
  const { showAlertPicker, setShowAlertPicker, insertTextAtCursor } = useMarkdownStore();
  const [selectedAlert, setSelectedAlert] = useState<GitHubAlert | null>(null);

  const handleInsert = (alert: GitHubAlert) => {
    insertTextAtCursor({ prefix: alert.markdown, suffix: '' });
    setShowAlertPicker(false);
  };

  if (!showAlertPicker) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 p-4" onClick={() => setShowAlertPicker(false)}>
      <div 
        className="bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-lg shadow-xl w-full max-w-2xl flex flex-col overflow-hidden text-sm" 
        onClick={e => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-[var(--color-border)] font-semibold flex items-center justify-between text-center bg-[var(--color-bg-header)]">
          <div className="flex bg-[var(--color-bg-header)] text-center text-md justify-center flex-1">
             GitHub Markdown Alerts
          </div>
        </div>

        <div className="p-4 flex flex-col overflow-hidden h-full">
          <div className="mb-4 text-[var(--color-text-muted)]">Select an alert type to insert:</div>

          <div className="grid grid-cols-1 gap-3 p-1">
            {ALERTS.map(alert => (
              <div 
                key={alert.name}
                onClick={() => setSelectedAlert(alert)}
                onDoubleClick={() => handleInsert(alert)}
                className={`flex items-start gap-3 p-3 border-l-4 rounded cursor-pointer transition-colors ${selectedAlert?.name === alert.name ? 'bg-[var(--color-bg-hover)] ' + alert.color : 'border-transparent bg-transparent hover:bg-[var(--color-bg-hover)]' }`}
              >
                 <div className={`mt-0.5 ${alert.color.split(' ')[0]}`}>
                   {alert.icon}
                 </div>
                 <div className="flex flex-col gap-1 w-full">
                    <div className={`font-semibold capitalize ${alert.color.split(' ')[0]}`}>{alert.name}</div>
                    <div className="text-[var(--color-text-muted)] text-xs font-mono">{alert.markdown}content...</div>
                 </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-bg-header)] flex items-center justify-end gap-2 shrink-0">
            <button 
              onClick={() => setShowAlertPicker(false)} 
              className="px-4 py-1.5 border border-[var(--color-border)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-main)] rounded transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => selectedAlert && handleInsert(selectedAlert)} 
              disabled={!selectedAlert}
              className={`px-4 py-1.5 rounded transition-colors ${selectedAlert ? 'bg-[var(--color-border)] hover:bg-gray-600 text-white' : 'bg-transparent border border-[var(--color-border)] opacity-50 cursor-not-allowed'}`}
            >
              Insert
            </button>
        </div>
      </div>
    </div>
  );
};
