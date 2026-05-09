import React, { useState } from 'react';
import { useMarkdownStore } from '../../store/useMarkdownStore';
import { Sigma } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathExample {
  category: string;
  name: string;
  markdown: string;
  formula: string;
  type: 'inline' | 'block';
}

const MATH_EXAMPLES: MathExample[] = [
  // Basic Math
  { category: 'Basic', name: 'Inline Equation', markdown: '$E = mc^2$', formula: 'E = mc^2', type: 'inline' },
  { category: 'Basic', name: 'Block Equation', markdown: '$$\na^2 + b^2 = c^2\n$$', formula: 'a^2 + b^2 = c^2', type: 'block' },
  { category: 'Basic', name: 'Quadratic Formula', markdown: '$$ x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} $$', formula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', type: 'block' },

  // Fractions
  { category: 'Fractions', name: 'Stacked Fraction', markdown: '$\\frac{x}{y}$', formula: '\\frac{x}{y}', type: 'inline' },
  { category: 'Fractions', name: 'Linear Fraction', markdown: '$x / y$', formula: 'x / y', type: 'inline' },
  { category: 'Fractions', name: 'Complex Fraction', markdown: '$$\n\\frac{\\frac{x}{y}}{\\frac{a}{b}}\n$$', formula: '\\frac{\\frac{x}{y}}{\\frac{a}{b}}', type: 'block' },

  // Radicals
  { category: 'Radicals', name: 'Square Root', markdown: '$\\sqrt{x}$', formula: '\\sqrt{x}', type: 'inline' },
  { category: 'Radicals', name: 'Square Root with Degree', markdown: '$\\sqrt[n]{x}$', formula: '\\sqrt[n]{x}', type: 'inline' },
  { category: 'Radicals', name: 'Square Root (Complex)', markdown: '$\\sqrt{x^2+y^2}$', formula: '\\sqrt{x^2+y^2}', type: 'inline' },

  // Integrals
  { category: 'Integrals', name: 'Indefinite Integral', markdown: '$$\n\\int f(x) dx\n$$', formula: '\\int f(x) dx', type: 'block' },
  { category: 'Integrals', name: 'Definite Integral', markdown: '$$\n\\int_{a}^{b} f(x) dx\n$$', formula: '\\int_{a}^{b} f(x) dx', type: 'block' },
  { category: 'Integrals', name: 'Double Integral', markdown: '$$\n\\iint_{S} f(x,y) dA\n$$', formula: '\\iint_{S} f(x,y) dA', type: 'block' },
  { category: 'Integrals', name: 'Closed Contour Integral', markdown: '$$\n\\oint_{C} \\vec{F} \\cdot d\\vec{r}\n$$', formula: '\\oint_{C} \\vec{F} \\cdot d\\vec{r}', type: 'block' },

  // Large Operators
  { category: 'Large Operators', name: 'Summation', markdown: '$$\n\\sum_{i=1}^{n} i^2\n$$', formula: '\\sum_{i=1}^{n} i^2', type: 'block' },
  { category: 'Large Operators', name: 'Product', markdown: '$$\n\\prod_{i=1}^{n} x_i\n$$', formula: '\\prod_{i=1}^{n} x_i', type: 'block' },
  { category: 'Large Operators', name: 'Union', markdown: '$$\n\\bigcup_{i=1}^{n} A_i\n$$', formula: '\\bigcup_{i=1}^{n} A_i', type: 'block' },
  { category: 'Large Operators', name: 'Intersection', markdown: '$$\n\\bigcap_{i=1}^{n} A_i\n$$', formula: '\\bigcap_{i=1}^{n} A_i', type: 'block' },

  // Brackets
  { category: 'Brackets', name: 'Parentheses (Auto-scaling)', markdown: '$\\left( \\frac{x}{y} \\right)$', formula: '\\left( \\frac{x}{y} \\right)', type: 'inline' },
  { category: 'Brackets', name: 'Square Brackets', markdown: '$\\left[ \\frac{x}{y} \\right]$', formula: '\\left[ \\frac{x}{y} \\right]', type: 'inline' },
  { category: 'Brackets', name: 'Curly Brackets / Braces', markdown: '$\\left\\{ \\frac{x}{y} \\right\\}$', formula: '\\left\\{ \\frac{x}{y} \\right\\}', type: 'inline' },
  { category: 'Brackets', name: 'Absolute Value', markdown: '$\\left| x \\right|$', formula: '\\left| x \\right|', type: 'inline' },
  { category: 'Brackets', name: 'Norm', markdown: '$\\left\\| \\vec{v} \\right\\|$', formula: '\\left\\| \\vec{v} \\right\\|', type: 'inline' },
  { category: 'Brackets', name: 'Cases', markdown: '$$\nf(x) = \\begin{cases} \nx & \\text{if } x > 0 \\\\\n0 & \\text{otherwise}\n\\end{cases}\n$$', formula: 'f(x) = \\begin{cases} x & \\text{if } x > 0 \\\\ 0 & \\text{otherwise} \\end{cases}', type: 'block' },

  // Functions & Trigonometry
  { category: 'Functions', name: 'Sine', markdown: '$\\sin(\\theta)$', formula: '\\sin(\\theta)', type: 'inline' },
  { category: 'Functions', name: 'Cosine', markdown: '$\\cos(\\theta)$', formula: '\\cos(\\theta)', type: 'inline' },
  { category: 'Functions', name: 'Tangent', markdown: '$\\tan(\\theta)$', formula: '\\tan(\\theta)', type: 'inline' },
  { category: 'Functions', name: 'Secant', markdown: '$\\sec(\\theta)$', formula: '\\sec(\\theta)', type: 'inline' },
  { category: 'Functions', name: 'Cosecant', markdown: '$\\csc(\\theta)$', formula: '\\csc(\\theta)', type: 'inline' },
  { category: 'Functions', name: 'Cotangent', markdown: '$\\cot(\\theta)$', formula: '\\cot(\\theta)', type: 'inline' },
  
  // Scripts (Superscripts & Subscripts)
  { category: 'Scripts', name: 'Superscript', markdown: '$x^2$', formula: 'x^2', type: 'inline' },
  { category: 'Scripts', name: 'Subscript', markdown: '$x_i$', formula: 'x_i', type: 'inline' },
  { category: 'Scripts', name: 'Subscript & Superscript', markdown: '$x_i^2$', formula: 'x_i^2', type: 'inline' },

  // Limits & Log
  { category: 'Limits & Log', name: 'Limit', markdown: '$$\n\\lim_{x \\to 0} f(x)\n$$', formula: '\\lim_{x \\to 0} f(x)', type: 'block' },
  { category: 'Limits & Log', name: 'Limit to Infinity', markdown: '$$\n\\lim_{x \\to \\infty} \\frac{1}{x} = 0\n$$', formula: '\\lim_{x \\to \\infty} \\frac{1}{x} = 0', type: 'block' },
  { category: 'Limits & Log', name: 'Natural Logarithm', markdown: '$\\ln(x)$', formula: '\\ln(x)', type: 'inline' },
  { category: 'Limits & Log', name: 'Common Logarithm', markdown: '$\\log_{10}(x)$', formula: '\\log_{10}(x)', type: 'inline' },
  { category: 'Limits & Log', name: 'Maximum', markdown: '$\\max(a, b)$', formula: '\\max(a, b)', type: 'inline' },
  { category: 'Limits & Log', name: 'Minimum', markdown: '$\\min(a, b)$', formula: '\\min(a, b)', type: 'inline' },

  // Matrices
  { category: 'Matrices', name: 'Matrix (Parentheses)', markdown: '$$\n\\begin{pmatrix}\n1 & 2 \\\\\n3 & 4\n\\end{pmatrix}\n$$', formula: '\\begin{pmatrix}\n1 & 2 \\\\\n3 & 4\n\\end{pmatrix}', type: 'block' },
  { category: 'Matrices', name: 'Matrix (Brackets)', markdown: '$$\n\\begin{bmatrix}\n1 & 2 \\\\\n3 & 4\n\\end{bmatrix}\n$$', formula: '\\begin{bmatrix}\n1 & 2 \\\\\n3 & 4\n\\end{bmatrix}', type: 'block' },
  { category: 'Matrices', name: 'Determinant', markdown: '$$\n\\begin{vmatrix}\na & b \\\\\nc & d\n\\end{vmatrix}\n$$', formula: '\\begin{vmatrix}\na & b \\\\\nc & d\n\\end{vmatrix}', type: 'block' },
  { category: 'Matrices', name: '1x3 Vector', markdown: '$$\n\\begin{bmatrix} a & b & c \\end{bmatrix}\n$$', formula: '\\begin{bmatrix} a & b & c \\end{bmatrix}', type: 'block' },
  { category: 'Matrices', name: '3x1 Vector', markdown: '$$\n\\begin{bmatrix} a \\\\ b \\\\ c \\end{bmatrix}\n$$', formula: '\\begin{bmatrix} a \\\\ b \\\\ c \\end{bmatrix}', type: 'block' },

  // Greek Letters
  { category: 'Greek Letters', name: 'Alpha, Beta, Gamma', markdown: '$\\alpha, \\beta, \\gamma$', formula: '\\alpha, \\beta, \\gamma', type: 'inline' },
  { category: 'Greek Letters', name: 'Delta, Epsilon, Zeta', markdown: '$\\delta, \\epsilon, \\zeta$', formula: '\\delta, \\epsilon, \\zeta', type: 'inline' },
  { category: 'Greek Letters', name: 'Eta, Theta, Iota', markdown: '$\\eta, \\theta, \\iota$', formula: '\\eta, \\theta, \\iota', type: 'inline' },
  { category: 'Greek Letters', name: 'Kappa, Lambda, Mu', markdown: '$\\kappa, \\lambda, \\mu$', formula: '\\kappa, \\lambda, \\mu', type: 'inline' },
  { category: 'Greek Letters', name: 'Pi, Rho, Sigma', markdown: '$\\pi, \\rho, \\sigma$', formula: '\\pi, \\rho, \\sigma', type: 'inline' },
  { category: 'Greek Letters', name: 'Tau, Phi, Omega', markdown: '$\\tau, \\phi, \\omega$', formula: '\\tau, \\phi, \\omega', type: 'inline' },
  { category: 'Greek Letters', name: 'Capital Delta, Gamma, Lambda', markdown: '$\\Delta, \\Gamma, \\Lambda$', formula: '\\Delta, \\Gamma, \\Lambda', type: 'inline' },
  { category: 'Greek Letters', name: 'Capital Pi, Sigma, Omega', markdown: '$\\Pi, \\Sigma, \\Omega$', formula: '\\Pi, \\Sigma, \\Omega', type: 'inline' },

  // Arrows & Symbols
  { category: 'Arrows & Symbols', name: 'Right Arrow', markdown: '$\\rightarrow$', formula: '\\rightarrow', type: 'inline' },
  { category: 'Arrows & Symbols', name: 'Left Arrow', markdown: '$\\leftarrow$', formula: '\\leftarrow', type: 'inline' },
  { category: 'Arrows & Symbols', name: 'Equivalence', markdown: '$\\equiv$', formula: '\\equiv', type: 'inline' },
  { category: 'Arrows & Symbols', name: 'Approximate', markdown: '$\\approx$', formula: '\\approx', type: 'inline' },
  { category: 'Arrows & Symbols', name: 'Proportional To', markdown: '$\\propto$', formula: '\\propto', type: 'inline' },
  { category: 'Arrows & Symbols', name: 'Infinity', markdown: '$\\infty$', formula: '\\infty', type: 'inline' },
  { category: 'Arrows & Symbols', name: 'Plus-Minus', markdown: '$\\pm$', formula: '\\pm', type: 'inline' },
  { category: 'Arrows & Symbols', name: 'Not Equal', markdown: '$\\neq$', formula: '\\neq', type: 'inline' },
  { category: 'Arrows & Symbols', name: 'Less or Equal', markdown: '$\\leq$', formula: '\\leq', type: 'inline' },
  { category: 'Arrows & Symbols', name: 'Greater or Equal', markdown: '$\\geq$', formula: '\\geq', type: 'inline' },
  { category: 'Arrows & Symbols', name: 'Therefore/Because', markdown: '$\\therefore, \\because$', formula: '\\therefore, \\because', type: 'inline' }
];

export const MathPickerModal: React.FC = () => {
  const { showMathPicker, setShowMathPicker, insertTextAtCursor } = useMarkdownStore();
  const [selectedMath, setSelectedMath] = useState<MathExample | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleInsert = (math: MathExample) => {
    insertTextAtCursor({ prefix: math.markdown, suffix: '', block: math.type === 'block', replace: true });
    setShowMathPicker(false);
  };

  if (!showMathPicker) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 p-4" onClick={() => setShowMathPicker(false)}>
      <div 
        className="bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-lg shadow-xl w-full max-w-4xl flex flex-col overflow-hidden text-sm max-h-[85vh]" 
        onClick={e => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-[var(--color-border)] font-semibold flex items-center justify-between text-center bg-[var(--color-bg-header)]">
          <div className="flex bg-[var(--color-bg-header)] text-center text-md justify-center flex-1">
             Math (LaTeX) Forms
          </div>
        </div>

        <div className="p-4 flex flex-col overflow-hidden h-full">
          <div className="mb-4 flex flex-wrap gap-2 shrink-0">
            {Array.from(new Set(MATH_EXAMPLES.map(m => m.category))).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${selectedCategory === category ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]' : 'bg-transparent border-[var(--color-border)] text-[var(--color-text-main)] hover:bg-[var(--color-bg-hover)]'}`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-1 overflow-y-auto">
            {MATH_EXAMPLES.filter(m => !selectedCategory || m.category === selectedCategory).map((math, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedMath(math)}
                onDoubleClick={() => handleInsert(math)}
                className={`flex flex-col gap-2 p-3 border rounded cursor-pointer transition-colors ${selectedMath?.name === math.name ? 'border-gray-400 bg-[var(--color-bg-hover)]' : 'border-[var(--color-border)] hover:bg-[var(--color-bg-hover)]' }`}
              >
                 <div className="flex justify-between items-center w-full">
                    <div className="font-semibold text-[var(--color-text-main)] flex items-center gap-2">
                      <Sigma className="w-4 h-4 text-[var(--color-accent)]" />
                      {math.name}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg-editor)] border border-[var(--color-border)] text-[var(--color-text-muted)] font-normal">{math.category}</span>
                    </div>
                    <div className="text-[var(--color-text-muted)] text-xs font-mono">{math.type === 'inline' ? 'Inline' : 'Block'}</div>
                 </div>
                 
                 <div className="flex flex-col gap-2 bg-[var(--color-bg-editor)] p-3 rounded-md border border-[var(--color-border)]">
                    <div className="text-[var(--color-text-main)] overflow-x-auto text-lg pb-1">
                      {math.type === 'inline' ? <InlineMath math={math.formula} /> : <div className="text-center"><BlockMath math={math.formula} /></div>}
                    </div>
                 </div>
                 
                 <div className="text-[var(--color-text-muted)] text-xs font-mono whitespace-pre">{math.markdown}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-bg-header)] flex items-center justify-end gap-2 shrink-0">
            <button 
              onClick={() => setShowMathPicker(false)} 
              className="px-4 py-1.5 border border-[var(--color-border)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-main)] rounded transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => selectedMath && handleInsert(selectedMath)} 
              disabled={!selectedMath}
              className={`px-4 py-1.5 rounded transition-colors ${selectedMath ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-transparent border border-[var(--color-border)] opacity-50 cursor-not-allowed'}`}
            >
              Insert
            </button>
        </div>
      </div>
    </div>
  );
};
