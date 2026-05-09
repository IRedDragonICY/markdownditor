import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

interface MermaidDiagramProps {
  chart: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const renderDiagram = async () => {
      try {
        if (!chart) return;
        
        // Generate a unique ID for the SVG
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        
        const { svg: svgCode } = await mermaid.render(id, chart);
        
        if (!isCancelled) {
          setSvg(svgCode);
          setError(null);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError(err.message || 'Failed to render Mermaid diagram');
        }
      }
    };

    renderDiagram();

    return () => {
      isCancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-md overflow-auto font-mono text-xs whitespace-pre-wrap">
        {error}
      </div>
    );
  }

  return (
    <div 
      ref={ref} 
      className="flex justify-center bg-[var(--color-bg-editor)] p-4 rounded-lg my-8 border border-[var(--color-border)] overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
};
