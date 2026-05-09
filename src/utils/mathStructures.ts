import { MathGroup } from './MathStructureDropdown';

export const fractionGroups: MathGroup[] = [
  {
    title: 'Fractions',
    columns: 2,
    options: [
      { label: 'Stacked Fraction', prefix: '\\frac{', suffix: '}{}', math: '\\frac{x}{y}' },
      { label: 'Skewed Fraction', prefix: '{', suffix: '}/{}', math: '{x}/{y}' },
      { label: 'Linear Fraction', prefix: '', suffix: ' / ', math: 'x / y' },
      { label: 'Small Fraction', prefix: '\\tfrac{', suffix: '}{}', math: '\\tfrac{x}{y}' }
    ]
  },
  {
    title: 'Common Fractions',
    columns: 3,
    options: [
      { label: 'dy/dx', prefix: '\\frac{dy}{dx}', math: '\\frac{dy}{dx}' },
      { label: 'Delta y / Delta x', prefix: '\\frac{\\Delta y}{\\Delta x}', math: '\\frac{\\Delta y}{\\Delta x}' },
      { label: 'Partial Derivative', prefix: '\\frac{\\partial y}{\\partial x}', math: '\\frac{\\partial y}{\\partial x}' },
      { label: 'Pi / 2', prefix: '\\frac{\\pi}{2}', math: '\\frac{\\pi}{2}' }
    ]
  }
];

export const scriptGroups: MathGroup[] = [
  {
    title: 'Subscripts and Superscripts',
    columns: 3,
    options: [
      { label: 'Superscript', prefix: '^{', suffix: '}', math: 'e^{x}' },
      { label: 'Subscript', prefix: '_{', suffix: '}', math: 'x_{2}' },
      { label: 'Subscript-Superscript', prefix: '_{', suffix: '}^{}', math: 'x_{2}^{2}' },
      { label: 'Left Subscript-Superscript', prefix: '{}_{', suffix: '}^{}', math: '{}_{2}^{4}He' },
    ]
  }
];

export const radicalGroups: MathGroup[] = [
  {
    title: 'Radicals',
    columns: 3,
    options: [
      { label: 'Square Root', prefix: '\\sqrt{', suffix: '}', math: '\\sqrt{x}' },
      { label: 'Root with Degree', prefix: '\\sqrt[', suffix: ']{}', math: '\\sqrt[n]{x}' },
      { label: 'Square Root Formula', prefix: '\\sqrt{', suffix: '^{2} + {}^{2}}', math: '\\sqrt{a^{2} + b^{2}}' },
      { label: 'Quadratic Formula', prefix: '\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', math: '\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' }
    ]
  }
];

export const integralGroups: MathGroup[] = [
  {
    title: 'Integrals',
    columns: 3,
    options: [
      { label: 'Integral', prefix: '\\int ', suffix: ' dx', math: '\\int x dx' },
      { label: 'Integral with limits', prefix: '\\int_{', suffix: '}^{}  dx', math: '\\int_{a}^{b} x dx' },
      { label: 'Double Integral', prefix: '\\iint ', suffix: ' dx dy', math: '\\iint' },
      { label: 'Double Integral Limits', prefix: '\\iint_{', suffix: '}^{}  dx dy', math: '\\iint_{S}' },
      { label: 'Triple Integral', prefix: '\\iiint ', suffix: ' dx dy dz', math: '\\iiint' },
      { label: 'Contour Integral', prefix: '\\oint ', suffix: ' ds', math: '\\oint' }
    ]
  }
];

export const operatorGroups: MathGroup[] = [
  {
    title: 'Operators',
    columns: 3,
    options: [
      { label: 'Summation', prefix: '\\sum_{', suffix: '}^{}', math: '\\sum' },
      { label: 'Summation with limits', prefix: '\\sum_{i=1}^{n}', math: '\\sum_{i=1}^{n}' },
      { label: 'Product', prefix: '\\prod_{', suffix: '}^{}', math: '\\prod' },
      { label: 'Union', prefix: '\\bigcup_{', suffix: '}^{}', math: '\\bigcup' },
      { label: 'Intersection', prefix: '\\bigcap_{', suffix: '}^{}', math: '\\bigcap' }
    ]
  }
];

export const bracketGroups: MathGroup[] = [
  {
    title: 'Brackets',
    columns: 3,
    options: [
      { label: 'Parentheses', prefix: '\\left( ', suffix: ' \\right)', math: '\\left( x \\right)' },
      { label: 'Square Brackets', prefix: '\\left[ ', suffix: ' \\right]', math: '\\left[ x \\right]' },
      { label: 'Curly Brackets', prefix: '\\left\\{ ', suffix: ' \\right\\}', math: '\\left\\{ x \\right\\}' },
      { label: 'Absolute Value', prefix: '\\left| ', suffix: ' \\right|', math: '\\left| x \\right|' },
      { label: 'Norm', prefix: '\\left\\| ', suffix: ' \\right\\|', math: '\\left\\| x \\right\\|' },
      { label: 'Angle Brackets', prefix: '\\langle ', suffix: ' \\rangle', math: '\\langle x \\rangle' }
    ]
  },
  {
    title: 'Cases',
    columns: 1,
    options: [
      { label: 'Cases (2 conditions)', prefix: '\\begin{cases}\n', suffix: ' & \\text{if } x > 0 \\\\\n & \\text{otherwise}\n\\end{cases}', math: '\\begin{cases} a & \\text{if } x \\\\ b & \\text{else} \\end{cases}' }
    ]
  }
];

export const functionGroups: MathGroup[] = [
  {
    title: 'Trigonometric',
    columns: 3,
    options: [
      { label: 'sin', prefix: '\\sin(', suffix: ')', math: '\\sin' },
      { label: 'cos', prefix: '\\cos(', suffix: ')', math: '\\cos' },
      { label: 'tan', prefix: '\\tan(', suffix: ')', math: '\\tan' },
      { label: 'csc', prefix: '\\csc(', suffix: ')', math: '\\csc' },
      { label: 'sec', prefix: '\\sec(', suffix: ')', math: '\\sec' },
      { label: 'cot', prefix: '\\cot(', suffix: ')', math: '\\cot' }
    ]
  },
  {
    title: 'Inverse',
    columns: 3,
    options: [
      { label: 'arcsin', prefix: '\\arcsin(', suffix: ')', math: '\\arcsin' },
      { label: 'arccos', prefix: '\\arccos(', suffix: ')', math: '\\arccos' },
      { label: 'arctan', prefix: '\\arctan(', suffix: ')', math: '\\arctan' }
    ]
  }
];

export const accentGroups: MathGroup[] = [
  {
    title: 'Accents',
    columns: 4,
    options: [
      { label: 'Dot', prefix: '\\dot{', suffix: '}', math: '\\dot{a}' },
      { label: 'Double Dot', prefix: '\\ddot{', suffix: '}', math: '\\ddot{a}' },
      { label: 'Hat', prefix: '\\hat{', suffix: '}', math: '\\hat{a}' },
      { label: 'Tilde', prefix: '\\tilde{', suffix: '}', math: '\\tilde{a}' },
      { label: 'Bar', prefix: '\\bar{', suffix: '}', math: '\\bar{a}' },
      { label: 'Vector', prefix: '\\vec{', suffix: '}', math: '\\vec{a}' },
      { label: 'Overline', prefix: '\\overline{', suffix: '}', math: '\\overline{x}' },
      { label: 'Underline', prefix: '\\underline{', suffix: '}', math: '\\underline{x}' }
    ]
  }
];

export const limitLogGroups: MathGroup[] = [
  {
    title: 'Limits and Logs',
    columns: 3,
    options: [
      { label: 'Limit', prefix: '\\lim_{', suffix: ' \\to }', math: '\\lim_{n \\to \\infty}' },
      { label: 'Natural Log', prefix: '\\ln(', suffix: ')', math: '\\ln' },
      { label: 'Log base 10', prefix: '\\log_{10}(', suffix: ')', math: '\\log_{10}' },
      { label: 'Max', prefix: '\\max(', suffix: ')', math: '\\max' },
      { label: 'Min', prefix: '\\min(', suffix: ')', math: '\\min' }
    ]
  }
];

export const matrixGroups: MathGroup[] = [
  {
    title: 'Matrices',
    columns: 2,
    options: [
      { label: 'Matrix (No Brackets)', prefix: '\\begin{matrix}\n& \\\\\n& \n\\end{matrix}', math: '\\begin{matrix} 1 & 2 \\\\ 3 & 4 \\end{matrix}' },
      { label: 'Matrix (Parentheses)', prefix: '\\begin{pmatrix}\n& \\\\\n& \n\\end{pmatrix}', math: '\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}' },
      { label: 'Matrix (Square)', prefix: '\\begin{bmatrix}\n& \\\\\n& \n\\end{bmatrix}', math: '\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}' },
      { label: 'Matrix (Determinant)', prefix: '\\begin{vmatrix}\n& \\\\\n& \n\\end{vmatrix}', math: '\\begin{vmatrix} 1 & 2 \\\\ 3 & 4 \\end{vmatrix}' }
    ]
  }
];

export const symbolGroups: MathGroup[] = [
  {
    title: 'Basic Math',
    columns: 5,
    options: [
      { label: 'Plus-Minus', prefix: '\\pm', math: '\\pm' },
      { label: 'Infinity', prefix: '\\infty', math: '\\infty' },
      { label: 'Equal', prefix: '=', math: '=' },
      { label: 'Not Equal', prefix: '\\neq', math: '\\neq' },
      { label: 'Approx', prefix: '\\approx', math: '\\approx' },
      { label: 'Times', prefix: '\\times', math: '\\times' },
      { label: 'Divide', prefix: '\\div', math: '\\div' },
      { label: 'Factorial', prefix: '!', math: '!' },
      { label: 'Proportional', prefix: '\\propto', math: '\\propto' },
      { label: 'Less Than', prefix: '<', math: '<' },
      { label: 'Much Less Than', prefix: '\\ll', math: '\\ll' },
      { label: 'Greater Than', prefix: '>', math: '>' },
      { label: 'Much Greater Than', prefix: '\\gg', math: '\\gg' },
      { label: 'Less/Equal', prefix: '\\leq', math: '\\leq' },
      { label: 'Greater/Equal', prefix: '\\geq', math: '\\geq' }
    ]
  },
  {
    title: 'Sets and Logic',
    columns: 5,
    options: [
      { label: 'For All', prefix: '\\forall', math: '\\forall' },
      { label: 'Exists', prefix: '\\exists', math: '\\exists' },
      { label: 'In', prefix: '\\in', math: '\\in' },
      { label: 'Not In', prefix: '\\notin', math: '\\notin' },
      { label: 'Subset', prefix: '\\subset', math: '\\subset' },
      { label: 'Union', prefix: '\\cup', math: '\\cup' },
      { label: 'Intersection', prefix: '\\cap', math: '\\cap' },
      { label: 'Empty Set', prefix: '\\emptyset', math: '\\emptyset' },
      { label: 'Therefore', prefix: '\\therefore', math: '\\therefore' },
      { label: 'Because', prefix: '\\because', math: '\\because' }
    ]
  }
];
