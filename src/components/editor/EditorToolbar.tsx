import React from 'react';
import { useMarkdownStore } from '../../store/useMarkdownStore';
import {
  Undo2, Redo2, Eraser,
  Bold, Strikethrough, Italic, Quote, CaseLower, CaseUpper, Type,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Heading1, Heading2, Heading3, Heading4, Heading5, Heading6,
  List, ListOrdered, Minus,
  Link, Square, Image, Code, FileCode2, Terminal, Table,
  Clock, Smile, Copyright, MessageSquareWarning,
  Maximize, Search, HelpCircle, Info
} from 'lucide-react';

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="p-1.5 hover:bg-[var(--color-bg-hover)] rounded text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors tooltip tooltip-bottom before:text-xs z-20"
    data-tip={label}
    aria-label={label}
  >
    {icon}
  </button>
);

export const EditorToolbar: React.FC = () => {
  const { insertTextAtCursor, triggerSearch, setShowHelp, setShowInfo } = useMarkdownStore();

  const handleFormat = (prefix: string, suffix: string = '', block: boolean = false) => {
    insertTextAtCursor({ prefix, suffix, block });
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <nav className="h-10 border-b border-[var(--color-border)] bg-[var(--color-bg-main)] flex items-center px-1 gap-[1px] shrink-0 overflow-x-auto no-scrollbar">
      <ToolbarButton icon={<Undo2 className="w-4 h-4" />} label="Undo" onClick={() => {}} />
      <ToolbarButton icon={<Redo2 className="w-4 h-4" />} label="Redo" onClick={() => {}} />
      <ToolbarButton icon={<Eraser className="w-4 h-4" />} label="Clear Formatting" onClick={() => {}} />
      
      <div className="h-4 w-[1px] bg-[var(--color-border)] mx-1 shrink-0" />
      
      <ToolbarButton icon={<Bold className="w-4 h-4" />} label="Bold" onClick={() => handleFormat('**', '**')} />
      <ToolbarButton icon={<Strikethrough className="w-4 h-4" />} label="Strikethrough" onClick={() => handleFormat('~~', '~~')} />
      <ToolbarButton icon={<Italic className="w-4 h-4" />} label="Italic" onClick={() => handleFormat('_', '_')} />
      <ToolbarButton icon={<Quote className="w-4 h-4" />} label="Blockquote" onClick={() => handleFormat('> ', '', true)} />
      <ToolbarButton icon={<Type className="w-4 h-4" />} label="Capitalize" onClick={() => {}} />
      <ToolbarButton icon={<CaseUpper className="w-4 h-4" />} label="Uppercase" onClick={() => {}} />
      <ToolbarButton icon={<CaseLower className="w-4 h-4" />} label="Lowercase" onClick={() => {}} />
      
      <div className="h-4 w-[1px] bg-[var(--color-border)] mx-1 shrink-0" />
      
      <ToolbarButton icon={<AlignLeft className="w-4 h-4" />} label="Align Left" onClick={() => handleFormat('<div align="left">\n', '\n</div>', true)} />
      <ToolbarButton icon={<AlignCenter className="w-4 h-4" />} label="Align Center" onClick={() => handleFormat('<div align="center">\n', '\n</div>', true)} />
      <ToolbarButton icon={<AlignRight className="w-4 h-4" />} label="Align Right" onClick={() => handleFormat('<div align="right">\n', '\n</div>', true)} />
      <ToolbarButton icon={<AlignJustify className="w-4 h-4" />} label="Justify" onClick={() => handleFormat('<div align="justify">\n', '\n</div>', true)} />
      
      <div className="h-4 w-[1px] bg-[var(--color-border)] mx-1 shrink-0" />
      
      <ToolbarButton icon={<Heading1 className="w-4 h-4" />} label="Heading 1" onClick={() => handleFormat('# ', '', true)} />
      <ToolbarButton icon={<Heading2 className="w-4 h-4" />} label="Heading 2" onClick={() => handleFormat('## ', '', true)} />
      <ToolbarButton icon={<Heading3 className="w-4 h-4" />} label="Heading 3" onClick={() => handleFormat('### ', '', true)} />
      <ToolbarButton icon={<Heading4 className="w-4 h-4" />} label="Heading 4" onClick={() => handleFormat('#### ', '', true)} />
      <ToolbarButton icon={<Heading5 className="w-4 h-4" />} label="Heading 5" onClick={() => handleFormat('##### ', '', true)} />
      <ToolbarButton icon={<Heading6 className="w-4 h-4" />} label="Heading 6" onClick={() => handleFormat('###### ', '', true)} />
      
      <div className="h-4 w-[1px] bg-[var(--color-border)] mx-1 shrink-0" />
      
      <ToolbarButton icon={<List className="w-4 h-4" />} label="Unordered List" onClick={() => handleFormat('- ', '', true)} />
      <ToolbarButton icon={<ListOrdered className="w-4 h-4" />} label="Ordered List" onClick={() => handleFormat('1. ', '', true)} />
      <ToolbarButton icon={<Minus className="w-4 h-4" />} label="Horizontal Rule" onClick={() => handleFormat('\n---\n', '', true)} />
      
      <div className="h-4 w-[1px] bg-[var(--color-border)] mx-1 shrink-0" />
      
      <ToolbarButton icon={<Link className="w-4 h-4" />} label="Link" onClick={() => handleFormat('[', '](url)')} />
      <ToolbarButton icon={<Square className="w-4 h-4" />} label="Task List" onClick={() => handleFormat('- [ ] ', '', true)} />
      <ToolbarButton icon={<Image className="w-4 h-4" />} label="Image" onClick={() => handleFormat('![alt](', ')')} />
      <ToolbarButton icon={<Code className="w-4 h-4" />} label="Inline Code" onClick={() => handleFormat('`', '`')} />
      <ToolbarButton icon={<FileCode2 className="w-4 h-4" />} label="Code Block" onClick={() => handleFormat('```\n', '\n```', true)} />
      <ToolbarButton icon={<Terminal className="w-4 h-4" />} label="Terminal" onClick={() => handleFormat('```bash\n', '\n```', true)} />
      <ToolbarButton icon={<Table className="w-4 h-4" />} label="Table" onClick={() => handleFormat('\n| Head | Head |\n|---|---|\n| Data | Data |\n', '', true)} />
      
      <div className="h-4 w-[1px] bg-[var(--color-border)] mx-1 shrink-0" />
      
      <ToolbarButton icon={<Clock className="w-4 h-4" />} label="Insert Time" onClick={() => handleFormat(new Date().toLocaleString(), '')} />
      <ToolbarButton icon={<Smile className="w-4 h-4" />} label="Emoji" onClick={() => handleFormat('😊', '')} />
      <ToolbarButton icon={<Copyright className="w-4 h-4" />} label="Copyright" onClick={() => handleFormat('©', '')} />
      <ToolbarButton icon={<MessageSquareWarning className="w-4 h-4" />} label="Markdown Alert" onClick={() => handleFormat('> [!NOTE]\n> ', '', true)} />

      <div className="flex-1 min-w-[20px]" />
      <div className="h-4 w-[1px] bg-[var(--color-border)] mx-1 shrink-0" />
      
      <ToolbarButton icon={<Maximize className="w-4 h-4" />} label="Toggle Fullscreen" onClick={handleToggleFullscreen} />
      <ToolbarButton icon={<Search className="w-4 h-4" />} label="Search" onClick={() => triggerSearch()} />
      <ToolbarButton icon={<HelpCircle className="w-4 h-4" />} label="Help" onClick={() => setShowHelp(true)} />
      <ToolbarButton icon={<Info className="w-4 h-4" />} label="Info" onClick={() => setShowInfo(true)} />
    </nav>
  );
};
