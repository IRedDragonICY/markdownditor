import React, { useState } from 'react';
import { useMarkdownStore } from '../../store/useMarkdownStore';
import { openFile, saveFile, saveFileAs } from '../../utils/fileSystem';
import {
  Undo2, Redo2, Eraser,
  Bold, Strikethrough, Italic, Quote, CaseLower, CaseUpper, Type,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Heading1, Heading2, Heading3, Heading4, Heading5, Heading6,
  List, ListOrdered, Minus,
  Link, Square, Image, Code, FileCode2, Terminal, Table,
  Clock, Smile, Copyright, MessageSquareWarning, Sigma,
  Maximize, Search, HelpCircle, Info, Archive, Save, FolderOpen,
  PieChart, LineChart, BarChart3, Activity, GitBranch, GitMerge, GitCommit, Settings,
  Calculator, Superscript, Subscript, FunctionSquare, LayoutTemplate, Share2,
  Keyboard, AtSign, Hash, ChevronDown, ListEnd
} from 'lucide-react';
import { MathStructureDropdown } from './MathStructureDropdown';
import {
  fractionGroups, scriptGroups, radicalGroups, integralGroups,
  operatorGroups, bracketGroups, functionGroups, accentGroups, limitLogGroups, matrixGroups, symbolGroups
} from '../../utils/mathStructures';

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon, label, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-1.5 rounded transition-colors shrink-0 ${disabled ? 'opacity-50 cursor-not-allowed text-[var(--color-text-muted)]' : 'hover:bg-[var(--color-bg-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)]'}`}
    title={label}
    aria-label={label}
  >
    {icon}
  </button>
);

export const EditorToolbar: React.FC = () => {
  const { insertTextAtCursor, triggerSearch, setShowHelp, setShowInfo, setShowCodeExtractor, addFileTab, tabs, activeTabId, updateTab, triggerUndo, triggerRedo } = useMarkdownStore();
  const activeTab = tabs.find(t => t.id === activeTabId);
  const [activeToolbarTab, setActiveToolbarTab] = useState<'home' | 'equation' | 'diagrams'>('home');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleFormat = (prefix: string, suffix: string = '', block: boolean = false, replace: boolean = false, isMath: boolean = false) => {
    insertTextAtCursor({ prefix, suffix, block, replace, isMath });
  };

  const handleMathFormat = (prefix: string, suffix: string = '', block: boolean = false) => {
    handleFormat(prefix, suffix, block, false, true);
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

  const handleOpen = async () => {
    try {
      const result = await openFile();
      if (result) {
        addFileTab(result.name, result.content, result.handle);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to open file');
    }
  };

  const handleSave = async (saveAs: boolean = false) => {
    if (!activeTab) return;
    try {
      if (saveAs || !activeTab.fileHandle) {
        if (!('showSaveFilePicker' in window)) {
          updateTab(activeTab.id, { isDirty: false });
          return;
        }
        const result = await saveFileAs(activeTab.content, activeTab.title);
        if (result) {
          updateTab(activeTab.id, { 
            title: result.name, 
            fileHandle: result.handle,
            isDirty: false 
          });
        }
      } else {
        await saveFile(activeTab.fileHandle, activeTab.content);
        updateTab(activeTab.id, { isDirty: false });
      }
    } catch (e: any) {
      if (e.message?.includes('not supported')) {
        updateTab(activeTab.id, { isDirty: false });
        // It failed because of no File System permissions, we just mark it clean since we have a download button in the header now
        return;
      }
      console.error(e);
      alert('Failed to save file');
    }
  };

  return (
    <div className="flex flex-col border-b border-[var(--color-border)] bg-[var(--color-bg-main)] shrink-0">
      <div className="flex items-center px-4 pt-1 gap-2 text-xs font-medium text-[var(--color-text-muted)]">
        <button 
          onClick={() => setActiveToolbarTab('home')}
          className={`px-3 py-1.5 rounded-t-lg transition-colors ${activeToolbarTab === 'home' ? 'bg-[var(--color-bg-editor)] text-[var(--color-accent)] border-t border-x border-[var(--color-border)]' : 'hover:bg-[var(--color-bg-hover)] border-t border-x border-transparent'}`}
        >
          Home
        </button>
        <button 
          onClick={() => setActiveToolbarTab('equation')}
          className={`px-3 py-1.5 rounded-t-lg transition-colors ${activeToolbarTab === 'equation' ? 'bg-[var(--color-bg-editor)] text-[var(--color-accent)] border-t border-x border-[var(--color-border)]' : 'hover:bg-[var(--color-bg-hover)] border-t border-x border-transparent'}`}
        >
          Equation
        </button>
        <button 
          onClick={() => setActiveToolbarTab('diagrams')}
          className={`px-3 py-1.5 rounded-t-lg transition-colors ${activeToolbarTab === 'diagrams' ? 'bg-[var(--color-bg-editor)] text-[var(--color-accent)] border-t border-x border-[var(--color-border)]' : 'hover:bg-[var(--color-bg-hover)] border-t border-x border-transparent'}`}
        >
          Diagrams
        </button>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-1 pb-1">
          <ToolbarButton icon={<Maximize className="w-4 h-4" />} label="Toggle Fullscreen" onClick={handleToggleFullscreen} />
          <ToolbarButton icon={<Search className="w-4 h-4" />} label="Search" onClick={() => triggerSearch()} />
          <ToolbarButton icon={<Archive className="w-4 h-4" />} label="Extract Codeblocks" onClick={() => setShowCodeExtractor(true)} />
          <ToolbarButton icon={<HelpCircle className="w-4 h-4" />} label="Help" onClick={() => setShowHelp(true)} />
          <ToolbarButton icon={<Info className="w-4 h-4" />} label="Info" onClick={() => setShowInfo(true)} />
        </div>
      </div>
      
      <div className="flex items-center p-2 gap-1 overflow-x-auto min-h-[44px] bg-[var(--color-bg-editor)] border-t border-[var(--color-border)]">
        
        {activeToolbarTab === 'home' && (
          <>
            <ToolbarButton icon={<FolderOpen className="w-4 h-4" />} label="Open File" onClick={handleOpen} />
            <ToolbarButton icon={<Save className="w-4 h-4" />} label="Save" onClick={() => handleSave(false)} disabled={!activeTab?.isDirty} />
            <ToolbarButton icon={<Save className="w-4 h-4 opacity-70" />} label="Save As" onClick={() => handleSave(true)} />
            
            <div className="h-4 w-[1px] bg-[var(--color-border)] mx-1 shrink-0" />
            
            <ToolbarButton icon={<Undo2 className="w-4 h-4" />} label="Undo" onClick={triggerUndo} />
            <ToolbarButton icon={<Redo2 className="w-4 h-4" />} label="Redo" onClick={triggerRedo} />
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
            
            <ToolbarButton icon={<Clock className="w-4 h-4" />} label="Insert Time" onClick={() => handleFormat(new Date().toLocaleString(), '', false, true)} />
            <ToolbarButton icon={<Smile className="w-4 h-4" />} label="Emoji" onClick={() => useMarkdownStore.getState().setShowEmojiPicker(true)} />
            <ToolbarButton icon={<Copyright className="w-4 h-4" />} label="Copyright" onClick={() => handleFormat('©', '', false, true)} />
            <ToolbarButton icon={<MessageSquareWarning className="w-4 h-4" />} label="Markdown Alert" onClick={() => useMarkdownStore.getState().setShowAlertPicker(true)} />
            
            <div className="h-4 w-[1px] bg-[var(--color-border)] mx-1 shrink-0" />
            
            <ToolbarButton icon={<Subscript className="w-4 h-4" />} label="Subscript" onClick={() => handleFormat('<sub>', '</sub>')} />
            <ToolbarButton icon={<Superscript className="w-4 h-4" />} label="Superscript" onClick={() => handleFormat('<sup>', '</sup>')} />
            <ToolbarButton icon={<Keyboard className="w-4 h-4" />} label="Keyboard Key" onClick={() => handleFormat('<kbd>', '</kbd>')} />
            <ToolbarButton icon={<ListEnd className="w-4 h-4" />} label="Footnote" onClick={() => handleFormat('[^1]\n\n[^1]: ', '')} />
            <ToolbarButton icon={<ChevronDown className="w-4 h-4" />} label="Collapsible Section" onClick={() => handleFormat('<details>\n<summary>Details</summary>\n\n', '\n</details>', true)} />
            <ToolbarButton icon={<AtSign className="w-4 h-4" />} label="Mention" onClick={() => handleFormat('@', '')} />
            <ToolbarButton icon={<Hash className="w-4 h-4" />} label="Issue/Pull Request" onClick={() => handleFormat('#', '')} />
          </>
        )}

        {activeToolbarTab === 'equation' && (
          <div className="flex items-center gap-1 overflow-x-auto w-full px-1 no-scrollbar">
            <MathStructureDropdown id="symbols" icon={<Sigma className="w-5 h-5 text-[var(--color-accent)]" />} label="Symbols" groups={symbolGroups} onFormat={handleMathFormat} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
            <div className="h-8 w-[1px] bg-[var(--color-border)] mx-1 shrink-0" />
            
            <MathStructureDropdown id="fraction" icon={<span className="font-serif text-base font-bold italic leading-none">x/y</span>} label="Fraction" groups={fractionGroups} onFormat={handleMathFormat} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
            <MathStructureDropdown id="script" icon={<span className="font-serif text-base font-bold italic leading-none">e<sup className="text-[10px]">x</sup></span>} label="Script" groups={scriptGroups} onFormat={handleMathFormat} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
            <MathStructureDropdown id="radical" icon={<span className="font-serif text-base font-bold leading-none">√x</span>} label="Radical" groups={radicalGroups} onFormat={handleMathFormat} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
            <MathStructureDropdown id="integral" icon={<span className="font-serif text-xl leading-none font-light">∫</span>} label="Integral" groups={integralGroups} onFormat={handleMathFormat} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
            <MathStructureDropdown id="operator" icon={<span className="font-serif text-xl leading-none">∑</span>} label="Operator" groups={operatorGroups} onFormat={handleMathFormat} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
            <MathStructureDropdown id="bracket" icon={<span className="font-serif text-base leading-none">{'{}'}</span>} label="Bracket" groups={bracketGroups} onFormat={handleMathFormat} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
            <MathStructureDropdown id="function" icon={<span className="font-serif text-sm leading-none font-medium">sin</span>} label="Function" groups={functionGroups} onFormat={handleMathFormat} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
            <MathStructureDropdown id="accent" icon={<span className="font-serif text-base leading-none">ä</span>} label="Accent" groups={accentGroups} onFormat={handleMathFormat} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
            <MathStructureDropdown id="limit" icon={<span className="font-serif text-[11px] leading-tight flex flex-col items-center"><span>lim</span><span className="text-[7px]">n→∞</span></span>} label="Limit/Log" groups={limitLogGroups} onFormat={handleMathFormat} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
            
            <MathStructureDropdown id="matrix" icon={
              <div className="flex grid-cols-2 grid-rows-2 text-[8px] border-l border-r border-current px-[1px] gap-x-[1px] leading-none items-center justify-center font-mono">
                [<div className="grid grid-cols-2 gap-[1px]"><span>1</span><span>0</span><span>0</span><span>1</span></div>]
              </div>
            } label="Matrix" groups={matrixGroups} onFormat={handleMathFormat} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />

            <div className="flex-1 min-w-[10px]" />
            <ToolbarButton icon={<span className="font-serif text-sm">{"$ $"}</span>} label="Inline Math Block" onClick={() => handleFormat('$', '$')} />
            <ToolbarButton icon={<span className="font-serif text-sm">{"$$ $$"}</span>} label="Display Math Block" onClick={() => handleFormat('$$\n', '\n$$', true)} />
          </div>
        )}

        {activeToolbarTab === 'diagrams' && (
          <>
            <span className="text-xs text-[var(--color-text-muted)] mx-2 font-semibold whitespace-nowrap">Mermaid Diagrams</span>
            <div className="h-4 w-[1px] bg-[var(--color-border)] mx-1 shrink-0" />
            
            <ToolbarButton icon={<Share2 className="w-4 h-4" />} label="Flowchart" onClick={() => handleFormat('\n```mermaid\nflowchart TD\n    A[Start] --> B{Is it?}\n    B -- Yes --> C[OK]\n    B -- No ----> D[Cancel]\n```\n', '', true)} />
            <ToolbarButton icon={<Activity className="w-4 h-4" />} label="Sequence" onClick={() => handleFormat('\n```mermaid\nsequenceDiagram\n    Alice->>+John: Hello John, how are you?\n    Alice->>+John: John, can you hear me?\n    John-->>-Alice: Hi Alice, I can hear you!\n    John-->>-Alice: I feel great!\n```\n', '', true)} />
            <ToolbarButton icon={<LayoutTemplate className="w-4 h-4" />} label="Class Diagram" onClick={() => handleFormat('\n```mermaid\nclassDiagram\n    Animal <|-- Duck\n    Animal <|-- Fish\n    Animal <|-- Zebra\n    Animal : +int age\n    Animal : +String gender\n    Animal: +isMammal()\n    Animal: +mate()\n    class Duck{\n      +String beakColor\n      +swim()\n      +quack()\n    }\n```\n', '', true)} />
            <ToolbarButton icon={<GitBranch className="w-4 h-4" />} label="State Diagram" onClick={() => handleFormat('\n```mermaid\nstateDiagram-v2\n    [*] --> Still\n    Still --> [*]\n    Still --> Moving\n    Moving --> Still\n    Moving --> Crash\n    Crash --> [*]\n```\n', '', true)} />
            <ToolbarButton icon={<PieChart className="w-4 h-4" />} label="Pie Chart" onClick={() => handleFormat('\n```mermaid\npie title Pets adopted by volunteers\n    "Dogs" : 386\n    "Cats" : 85\n    "Rats" : 15\n```\n', '', true)} />
            <ToolbarButton icon={<BarChart3 className="w-4 h-4" />} label="Gantt Chart" onClick={() => handleFormat('\n```mermaid\ngantt\n    title A Gantt Diagram\n    dateFormat  YYYY-MM-DD\n    section Section\n    A task           :a1, 2014-01-01, 30d\n    Another task     :after a1  , 20d\n```\n', '', true)} />
            <ToolbarButton icon={<GitMerge className="w-4 h-4" />} label="Git Graph" onClick={() => handleFormat('\n```mermaid\ngitGraph\n    commit\n    commit\n    branch develop\n    checkout develop\n    commit\n    commit\n    checkout main\n    merge develop\n    commit\n    commit\n```\n', '', true)} />
            
            <div className="flex-1 min-w-[20px]" />
          </>
        )}
      </div>
    </div>
  );
};
