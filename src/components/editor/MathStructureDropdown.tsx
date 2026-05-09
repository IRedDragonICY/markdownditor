import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { InlineMath } from 'react-katex';
import { ChevronDown } from 'lucide-react';

export interface MathOption {
  label: string;
  prefix: string;
  suffix?: string;
  math: string;
  block?: boolean;
}

export interface MathGroup {
  title: string;
  columns?: number;
  options: MathOption[];
}

interface Props {
  icon: React.ReactNode;
  label: string;
  groups: MathGroup[];
  onFormat: (prefix: string, suffix?: string, block?: boolean) => void;
  openDropdown: string | null;
  setOpenDropdown: (id: string | null) => void;
  id: string;
}

export const MathStructureDropdown: React.FC<Props> = ({ icon, label, groups, onFormat, openDropdown, setOpenDropdown, id }) => {
  const isOpen = openDropdown === id;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Check if click was outside both the button and the dropdown
      const clickedOutsideButton = buttonRef.current && !buttonRef.current.contains(e.target as Node);
      const clickedOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(e.target as Node);
      
      if (clickedOutsideButton && clickedOutsideDropdown) {
        if (isOpen) setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setOpenDropdown]);

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setCoords({
          top: rect.bottom + 4,
          left: rect.left,
        });
      }
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [isOpen]);

  return (
    <>
      <button 
        ref={buttonRef}
        onClick={() => setOpenDropdown(isOpen ? null : id)}
        className={`flex flex-col items-center justify-center rounded px-2 h-[44px] transition-colors border ${isOpen ? 'bg-[var(--color-bg-hover)] border-[var(--color-border)]' : 'border-transparent hover:bg-[var(--color-bg-hover)]'}`}
      >
        <div className="flex items-center justify-center h-6 mb-0.5">
          {icon}
        </div>
        <div className="flex items-center text-[10px] text-[var(--color-text-muted)] font-medium gap-0.5">
          {label} <ChevronDown className="w-[10px] h-[10px]" />
        </div>
      </button>
      
      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-md shadow-xl z-50 p-2 min-w-[240px] max-w-[320px] max-h-[350px] overflow-y-auto custom-scrollbar"
          style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
        >
          {groups.map((group, idx) => (
            <div key={idx} className="mb-3 last:mb-0">
              <div className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)] mb-1.5 px-1">{group.title}</div>
              <div className={`grid gap-1`} style={{ gridTemplateColumns: `repeat(${group.columns || 3}, minmax(0, 1fr))`}}>
                {group.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onFormat(opt.prefix, opt.suffix, opt.block);
                      setOpenDropdown(null);
                    }}
                    className="flex flex-col flex-1 items-center justify-center p-2 rounded border border-[var(--color-border)] bg-[var(--color-bg-editor)] hover:border-blue-400 hover:bg-blue-50/10 transition-all text-[var(--color-text-main)] overflow-hidden"
                    title={opt.label}
                  >
                    <div className="text-sm pointer-events-none flex items-center justify-center min-h-[32px]">
                      <InlineMath math={opt.math} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
};
