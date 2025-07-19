import { useState, useRef, useCallback } from 'react';

// You might need to adjust the path if EXAMPLES and CUSTOM_ALGORITHM_TEMPLATE
// are defined in a separate constants file that doesn't contain the Hooks.
// For now, I'll assume they're defined here.


export const EXAMPLES = {
  fibonacci: `// Fibonacci: O(2^n)
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
  factorial: `// Factorial: O(n)
function factorial(n) {
  if (n === 0) return 1;
  return n * factorial(n - 1);
}`,
};

export const CUSTOM_ALGORITHM_TEMPLATE = `// Write your own recursive function
function customAlgorithm(n) {
  if (n <= 0) return 0;
  return n + customAlgorithm(n - 1);
}`;

// This is your custom Hook
export function useAppState() {
  // All your useState and useRef calls go INSIDE this function
  const [code, setCode] = useState(EXAMPLES.fibonacci);
  const [initialArgs, setInitialArgs] = useState('5');
  const [trace, setTrace] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [showHelp, setShowHelp] = useState(true);

  const [patternInfo, setPatternInfo] = useState({ pattern: '', justification: '', isLoading: false });
  const [cognitiveLoad, setCognitiveLoad] = useState(10);
  const [misconception, setMisconception] = useState({ alert: '', isLoading: false });
  const [optimization, setOptimization] = useState({ suggestion: '', code: '', isLoading: false });
  const [complexityData, setComplexityData] = useState([]);
  const [activeTab, setActiveTab] = useState('tutor');

  const sliderRef = useRef(null);
  const lastSliderInteraction = useRef({ time: 0, value: 0 });

  // It's good practice to return an object so you can destructure what you need
  return {
    code, setCode,
    initialArgs, setInitialArgs,
    trace, setTrace,
    currentStep, setCurrentStep,
    error, setError,
    selectedNode, setSelectedNode,
    showHelp, setShowHelp,
    patternInfo, setPatternInfo,
    cognitiveLoad, setCognitiveLoad,
    misconception, setMisconception,
    optimization, setOptimization,
    complexityData, setComplexityData,
    activeTab, setActiveTab,
    sliderRef,
    lastSliderInteraction,
    // Also export the non-hook related constants if you want them accessible
    EXAMPLES,
    CUSTOM_ALGORITHM_TEMPLATE,
  };
}