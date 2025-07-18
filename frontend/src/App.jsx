import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { Chart } from 'chart.js/auto';

// --- Helper Icon Components ---
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
const HelpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const PrevIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 19 2 12 11 5 11 19"></polygon><polygon points="22 19 13 12 22 5 22 19"></polygon></svg>;
const NextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 19 22 12 13 5 13 19"></polygon><polygon points="2 19 11 12 2 5 2 19"></polygon></svg>;
const BrainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.44 2.5 2.5 0 0 1 2.5-4.02V6.5a2.5 2.5 0 0 1 5 0v2.5a2.5 2.5 0 0 1 2.5 4.02 2.5 2.5 0 0 1-2.96 3.44A2.5 2.5 0 0 1 12 19.5v-15A2.5 2.5 0 0 1 9.5 2z"></path></svg>;
const AlertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const LightbulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 3.04 1.63 5.5 4 6.58V20a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3.42A6.99 6.99 0 0 0 19 9a7 7 0 0 0-7-7z"></path></svg>;
const WandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 4V2m0 14v-2m-3.5-8.5L10 2m.5 8.5L9 9m-5 5l-2-2m2 6l-2 2m12-6l2 2m-2-4l2-2m-4-2l-2-2m.5 12.5L10 14m-2.5 5.5L6 18m-2-2l-1.5-1.5M22 12h-2m-2-3.5l-1-1M4 12H2m2-3.5l-1-1m14 0l1-1m-14 7l-1 1"></path></svg>;

// --- Default Code Examples ---
const EXAMPLES = {
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

const CUSTOM_ALGORITHM_TEMPLATE = `// Write your own recursive function
function customAlgorithm(n) {
  if (n <= 0) return 0;
  return n + customAlgorithm(n - 1);
}`;

// --- Centralized AI Analysis Function ---
const aiAnalyze = async (promptText) => {
    try {
        const chatHistory = [{ role: "user", parts: [{ text: promptText }] }];
        const payload = { contents: chatHistory };
        const apiKey = "";
        // This is the direct API endpoint. It will work in Gemini's preview.
        // For local development with Vite, change this to: /api/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}
        // ...and ensure you have the vite.config.js proxy setup.
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
        const result = await response.json();
        if (!result.candidates?.[0]?.content?.parts?.[0]?.text) return null;
        return result.candidates[0].content.parts[0].text.replace(/```(json|javascript)?|```/g, '').trim();
    } catch (e) {
        console.error("AI analysis error:", e);
        return null;
    }
};

// --- Sub-Components ---
const Visualization = ({ trace, currentStep, onNodeClick }) => {
    const svgRef = useRef();
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        if (!trace || trace.length === 0) return;
        const traceSubset = trace.slice(0, currentStep + 1);
        const callMap = new Map();
        let root = null;
        traceSubset.forEach(event => {
            if (event.type === 'call') {
                const node = { ...event, children: [], data: event };
                callMap.set(event.id, node);
                if (event.parentId === null) root = node;
                else {
                    const parent = callMap.get(event.parentId);
                    if (parent) parent.children.push(node);
                }
            } else if (event.type === 'return') {
                const node = callMap.get(event.id);
                if (node) node.returnValue = event.value;
            }
        });
        if (!root) return;
        const hierarchy = d3.hierarchy(root);
        const treeLayout = d3.tree().nodeSize([150, 120]);
        const treeData = treeLayout(hierarchy);
        const nodes = treeData.descendants();
        const links = treeData.links();
        const g = svg.append("g");
        const zoom = d3.zoom().scaleExtent([0.1, 4]).on("zoom", (event) => g.attr("transform", event.transform));
        svg.call(zoom);
        const svgWidth = svg.node().getBoundingClientRect().width;
        const svgHeight = svg.node().getBoundingClientRect().height;
        const initialTransform = d3.zoomIdentity.translate(svgWidth / 2, svgHeight / 4).scale(1);
        svg.call(zoom.transform, initialTransform);
        g.selectAll(".link").data(links).join("path").attr("d", d3.linkVertical().x(n => n.x).y(n => n.y)).attr("fill", "none").attr("stroke", "#555").attr("stroke-opacity", 0.7).attr("stroke-width", 1.5);
        const nodeEnter = g.selectAll(".node").data(nodes).join("g").attr("transform", d => `translate(${d.x},${d.y})`).on("click", (event, d) => onNodeClick(d.data)).style("cursor", "pointer");
        nodeEnter.append("circle").attr("r", 40).attr("fill", d => d.data.returnValue !== undefined ? "#a7f3d0" : "#bae6fd").attr("stroke", d => d.data.id === trace[currentStep]?.id ? "#ef4444" : "#075985").attr("stroke-width", d => d.data.id === trace[currentStep]?.id ? 4 : 2);
        nodeEnter.append("text").attr("dy", "-0.5em").attr("text-anchor", "middle").text(d => `${d.data.funcName}(${d.data.args.join(', ')})`).style("font-size", "12px").style("font-weight", "600");
        nodeEnter.append("text").attr("dy", "1em").attr("text-anchor", "middle").text(d => d.data.returnValue !== undefined ? `=> ${JSON.stringify(d.data.returnValue)}` : '...').style("font-size", "14px").style("font-weight", "bold").attr("fill", "#059669");
    }, [trace, currentStep, onNodeClick]);
    return <svg ref={svgRef} className="w-full h-full bg-gray-50 rounded-lg shadow-inner"></svg>;
};

const AIPanel = ({ selectedNode, code, cognitiveLoad, onWhatIf }) => {
    const [explanation, setExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const generateExplanation = useCallback(async (node, currentCode, load) => {
        if (!node) return;
        setIsLoading(true);
        setExplanation('');
        setError(null);
        const { funcName, args, returnValue } = node;
        const state = returnValue !== undefined ? `has just returned with the value ${JSON.stringify(returnValue)}` : `is being called with arguments [${args.join(', ')}]`;
        let prompt = `You are an expert CS tutor. Explain this specific function call step. Identify if it's a base case or recursive step, its purpose, and how the return value (if any) was calculated.\nCode:\n\`\`\`javascript\n${currentCode}\n\`\`\`\nFunction Call State:\n- Name: ${funcName}\n- State: This call ${state}.`;
        if (load > 65) {
            prompt += "\n\nIMPORTANT: The user seems to be struggling. Make your explanation extra simple. Use a real-world analogy (like Russian dolls) to explain the call stack for this step. Be encouraging."
        }
        const explanationText = await aiAnalyze(prompt);
        if (explanationText) setExplanation(explanationText);
        else setError("Sorry, I couldn't fetch an explanation.");
        setIsLoading(false);
    }, []);
    useEffect(() => {
        if (selectedNode) generateExplanation(selectedNode, code, cognitiveLoad);
    }, [selectedNode, code, cognitiveLoad, generateExplanation]);
    return (
        <div className="flex-grow flex flex-col p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">🤖 AI Tutor</h3>
            {!selectedNode ? (
                <div className="text-center text-gray-500 mt-8"><div className="text-4xl mb-2">🤔</div><p>Click a node for an explanation.</p></div>
            ) : isLoading ? (
                <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>
            ) : error ? (
                 <div className="text-red-500 bg-red-100 p-3 rounded-md">{error}</div>
            ) : (
                <>
                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap mb-4 flex-grow overflow-y-auto">{explanation}</div>
                    <button onClick={onWhatIf} className="mt-auto w-full bg-indigo-100 text-indigo-700 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-200 flex items-center justify-center gap-2">
                        <WandIcon /> Analyze 'What-If' Scenario
                    </button>
                </>
            )}
        </div>
    );
};

const CallStackPanel = ({ trace, currentStep }) => {
    const [stack, setStack] = useState([]);
    useEffect(() => {
        const currentStack = [];
        const traceSubset = trace.slice(0, currentStep + 1);
        for (const event of traceSubset) {
            if (event.type === 'call') {
                currentStack.push({ id: event.id, funcName: event.funcName, args: event.args });
            } else if (event.type === 'return') {
                if (currentStack.length > 0 && currentStack[currentStack.length - 1].id === event.id) {
                    currentStack.pop();
                }
            }
        }
        setStack(currentStack);
    }, [trace, currentStep]);
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Call Stack</h3>
            <div className="bg-gray-100 p-2 rounded-lg min-h-[100px] flex flex-col-reverse justify-start">
                {stack.length === 0 ? <p className="text-center text-gray-500 text-sm">Stack is empty.</p> :
                 stack.map((call, index) => (
                    <div key={`${call.id}-${index}`} className={`p-2 mt-1 rounded-md text-center font-mono text-sm ${index === stack.length - 1 ? 'bg-blue-200 border-2 border-blue-400' : 'bg-gray-200'}`}>
                        {call.funcName}({call.args.join(', ')})
                    </div>
                ))}
            </div>
        </div>
    );
};

const BigOVisualizer = ({ complexityData, bigO }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    useEffect(() => {
        if (!complexityData || complexityData.length === 0 || !chartRef.current) return;
        const getBigOData = (n) => {
            const pattern = bigO?.toLowerCase() || '';
            if (pattern.includes('2^n')) return Math.pow(2, n);
            if (pattern.includes('n^2')) return n * n;
            if (pattern.includes('n log n')) return n * Math.log2(n);
            if (pattern.includes('linear') || pattern.includes('n')) return n;
            if (pattern.includes('log n')) return Math.log2(n);
            return 1;
        };
        const labels = complexityData.map(d => d.n);
        const theoreticalData = labels.map(n => getBigOData(n));
        const maxTheoretical = Math.max(...theoreticalData);
        const maxActual = Math.max(...complexityData.map(d => d.ops));
        const scaleFactor = maxTheoretical > 0 ? maxActual / maxTheoretical : 1;
        if (chartInstance.current) chartInstance.current.destroy();
        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{ label: 'Actual Operations', data: complexityData.map(d => d.ops), borderColor: 'rgb(59, 130, 246)', tension: 0.1 },
                           { label: `Theoretical ${bigO || ''}`, data: theoreticalData.map(d => d * scaleFactor), borderColor: 'rgb(239, 68, 68)', borderDash: [5, 5], tension: 0.1 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'Complexity Analysis' } }, scales: { x: { title: { display: true, text: 'Input Size (n)' } }, y: { title: { display: true, text: 'Operations' } } } }
        });
    }, [complexityData, bigO]);
    return (
        <div className="space-y-4 p-4">
            <h3 className="text-lg font-bold text-gray-800">Big O Visualizer</h3>
            <div className="relative h-64">
                {complexityData.length > 0 ? <canvas ref={chartRef}></canvas> : <p className="text-center text-gray-500">Run an algorithm to see its complexity plot.</p>}
            </div>
        </div>
    );
};

// --- Main App Component ---
export default function App() {
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

  useEffect(() => {
    const hasVisited = localStorage.getItem('recursivis-visited');
    if (hasVisited) setShowHelp(false);
    else localStorage.setItem('recursivis-visited', 'true');
  }, []);

  const preAnalyzeCode = async (codeToAnalyze) => {
    setPatternInfo({ pattern: '', justification: '', isLoading: true });
    setMisconception({ alert: '', isLoading: true });
    const patternPrompt = `Analyze the following JS function and classify its recursion pattern. Categories: "Linear", "Binary", "Tail", "Multi-branch". Provide a one-sentence justification. Return ONLY a valid JSON object with keys "pattern" and "justification". Code: \`\`\`javascript\n${codeToAnalyze}\n\`\`\``;
    const misconceptionPrompt = `Analyze the following recursive JS function for common student misconceptions. Provide a single, short, predictive warning about a potential pitfall. If none, return null. Code: \`\`\`javascript\n${codeToAnalyze}\n\`\`\``;
    const [patternResult, misconceptionResult] = await Promise.all([aiAnalyze(patternPrompt, true), aiAnalyze(misconceptionPrompt, false)]);
    if (patternResult) try { setPatternInfo({ ...JSON.parse(patternResult), isLoading: false }); } catch { setPatternInfo({ pattern: 'Analysis failed', justification: '', isLoading: false }); }
    setMisconception({ alert: misconceptionResult, isLoading: false });
  };
  
  const handleOptimizationRefactor = async () => {
    setOptimization(prev => ({ ...prev, isLoading: true }));
    const prompt = `Refactor the following inefficient recursive function to use memoization. Return only the complete, refactored JavaScript code.\n\n\`\`\`javascript\n${code}\n\`\`\``;
    const refactoredCode = await aiAnalyze(prompt);
    if (refactoredCode) setOptimization({ suggestion: 'Here is an optimized version of your code:', code: refactoredCode, isLoading: false });
    else setOptimization({ suggestion: 'Could not generate an optimization.', code: '', isLoading: false });
  };

  const handleWhatIf = async () => {
    const question = prompt("What change would you like to analyze? (e.g., 'What if n <= 1 was n < 0?')");
    if (!question || !selectedNode) return;
    const { funcName, args } = selectedNode;
    const promptText = `A student is analyzing \`${funcName}\` called with \`[${args.join(', ')}]\`. They asked: "${question}". Based on the code below, explain the likely consequence.\n\nCode:\n\`\`\`javascript\n${code}\n\`\`\``;
    const explanation = await aiAnalyze(promptText);
    alert(explanation || "Could not analyze the scenario.");
  };

  const runAndTrace = (func, args) => {
        const executionTrace = [];
        let callIdCounter = 0;
        const context = [];
        const funcName = func.name;
        const tracer = (...tracerArgs) => {
            const callId = callIdCounter++;
            const parentId = context.length > 0 ? context[context.length - 1] : null;
            executionTrace.push({ type: 'call', id: callId, parentId, funcName, args: tracerArgs });
            context.push(callId);
            try {
                const result = func(...tracerArgs);
                executionTrace.push({ type: 'return', id: callId, value: result });
                context.pop();
                return result;
            } catch (e) { context.pop(); throw e; }
        };
        const tempGlobal = window[funcName];
        window[funcName] = tracer;
        try { tracer(...args); } finally { window[funcName] = tempGlobal; }
        return executionTrace;
  };

  const handleRun = () => {
    setError(''); setTrace([]); setSelectedNode(null); setCurrentStep(0);
    setCognitiveLoad(10); setOptimization({ suggestion: '', code: '', isLoading: false });
    setComplexityData([]);
    let funcName;
    try {
        const funcNameMatch = code.match(/function\s+([a-zA-Z0-9_]+)\s*\(/);
        if (!funcNameMatch?.[1]) throw new Error("Could not find a named function.");
        funcName = funcNameMatch[1];
        preAnalyzeCode(code);
    } catch (e) { setError(`Parsing Error: ${e.message}`); setCognitiveLoad(prev => Math.min(100, prev + 40)); return; }
    const scriptId = `user-script-${Date.now()}`;
    const script = document.createElement('script');
    script.id = scriptId;
    script.innerHTML = code;
    document.body.appendChild(script);
    if (typeof window[funcName] !== 'function') {
        setError(`Function '${funcName}' not defined.`);
        setCognitiveLoad(prev => Math.min(100, prev + 40));
        document.body.removeChild(script);
        return;
    }
    const originalFunc = window[funcName];
    try {
        const argsArray = JSON.parse(`[${initialArgs}]`);
        const mainTrace = runAndTrace(originalFunc, argsArray);
        setTrace(mainTrace);
        setCurrentStep(mainTrace.length - 1);
        const calls = new Map();
        let hasDuplicates = false;
        for(const event of mainTrace) {
            if(event.type === 'call') {
                const key = `${event.funcName}(${JSON.stringify(event.args)})`;
                if (calls.has(key)) { hasDuplicates = true; break; }
                calls.set(key, true);
            }
        }
        if(hasDuplicates) setOptimization({ suggestion: 'Redundant computations detected! This algorithm could be optimized.', code: '', isLoading: false });
        const complexityPoints = [];
        const n_arg_index = 0; 
        if (typeof argsArray[n_arg_index] === 'number') {
            for (let i = 1; i <= Math.min(argsArray[n_arg_index], 8); i++) {
                const tempArgs = [...argsArray];
                tempArgs[n_arg_index] = i;
                const traceForN = runAndTrace(originalFunc, tempArgs);
                complexityPoints.push({ n: i, ops: traceForN.filter(e => e.type === 'call').length });
            }
            setComplexityData(complexityPoints);
        }
    } catch (e) {
         if(!error) setError(`Execution Error: ${e.message}`);
         setTrace([]);
    } finally {
        const scriptToRemove = document.getElementById(scriptId);
        if (scriptToRemove) document.body.removeChild(scriptToRemove);
    }
  };
  
  const handleNodeClick = useCallback((nodeData) => {
    const stepIndex = trace.findIndex(step => step.type === 'call' && step.id === nodeData.id);
    if (stepIndex !== -1) setCurrentStep(stepIndex);
    setSelectedNode(nodeData);
  }, [trace]);

  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    const now = Date.now();
    const timeDiff = now - lastSliderInteraction.current.time;
    if (timeDiff < 200 && Math.abs(newValue - lastSliderInteraction.current.value) > 0) {
        setCognitiveLoad(prev => Math.min(100, prev + 2));
    }
    lastSliderInteraction.current = { time: now, value: newValue };
    setCurrentStep(newValue);
  };
  
  const handlePrevStep = () => {
      setCognitiveLoad(prev => Math.min(100, prev + 5));
      setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleNextStep = () => setCurrentStep(prev => Math.min(trace.length - 1, prev + 1));

  const handleLoadExample = (exampleKey) => {
    setError(''); setTrace([]); setSelectedNode(null);
    setPatternInfo({ pattern: '', justification: '', isLoading: false });
    setMisconception({ alert: '', isLoading: false });
    setOptimization({ suggestion: '', code: '', isLoading: false });
    setComplexityData([]);
    if (exampleKey === 'custom') { setCode(CUSTOM_ALGORITHM_TEMPLATE); setInitialArgs('5'); return; }
    setCode(EXAMPLES[exampleKey]);
    if (exampleKey === 'fibonacci') setInitialArgs('5');
    if (exampleKey === 'factorial') setInitialArgs('5');
  }

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-800 flex flex-col">
       {showHelp && <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 relative"><button onClick={()=>setShowHelp(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl leading-none">&times;</button><h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome!</h2><p className="text-gray-600 mb-6">This tool helps you understand recursion by visualizing it.</p><button onClick={()=>setShowHelp(false)} className="mt-8 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Let's Go!</button></div></div>}
        <header className="bg-white shadow-md p-3 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">RecursiVis 🌲</h1>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600"><BrainIcon /><span>Cognitive Load:</span><div className="w-24 bg-gray-200 rounded-full h-2.5"><div className={`h-2.5 rounded-full transition-all duration-500 ${cognitiveLoad > 80 ? 'bg-red-500' : cognitiveLoad > 60 ? 'bg-yellow-400' : 'bg-green-500'}`} style={{width: `${cognitiveLoad}%`}}></div></div></div>
                <button onClick={() => setShowHelp(true)} className="p-2 rounded-full hover:bg-gray-200 transition"><HelpIcon /></button>
            </div>
        </header>
        <main className="flex-grow p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                    <h2 className="font-bold text-lg mb-2">Controls</h2>
                    <div className="mb-4"><label htmlFor="examples" className="block text-sm font-medium text-gray-600 mb-1">Load Example</label><select id="examples" onChange={(e) => handleLoadExample(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" defaultValue="fibonacci"><option value="fibonacci">Fibonacci</option><option value="factorial">Factorial</option><option value="custom">Custom</option></select></div>
                    <div className="mb-4"><label htmlFor="initial-args" className="block text-sm font-medium text-gray-600 mb-1">Initial Arguments</label><input type="text" id="initial-args" value={initialArgs} onChange={(e) => setInitialArgs(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md font-mono text-sm" placeholder="e.g., 5"/></div>
                    <button onClick={handleRun} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-transform duration-150 active:scale-95"><PlayIcon /> Run</button>
                    {error && <p className="text-red-500 text-sm mt-2 bg-red-100 p-2 rounded-md">{error}</p>}
                </div>
                <div className="bg-white p-4 rounded-lg shadow-lg flex-grow flex flex-col">
                    <div className="border-b border-gray-200 mb-4"><div className="flex -mb-px"><button onClick={()=>setActiveTab('tutor')} className={`py-2 px-4 text-sm font-medium border-b-2 ${activeTab === 'tutor' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Tutor</button><button onClick={()=>setActiveTab('analysis')} className={`py-2 px-4 text-sm font-medium border-b-2 ${activeTab === 'analysis' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Analysis</button><button onClick={()=>setActiveTab('complexity')} className={`py-2 px-4 text-sm font-medium border-b-2 ${activeTab === 'complexity' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Complexity</button><button onClick={()=>setActiveTab('optimize')} className={`py-2 px-4 text-sm font-medium border-b-2 ${activeTab === 'optimize' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Optimize</button></div></div>
                    <div className="flex-grow">
                        {activeTab === 'tutor' && <AIPanel selectedNode={selectedNode} code={code} cognitiveLoad={cognitiveLoad} onWhatIf={handleWhatIf} />}
                        {activeTab === 'analysis' && <div className="space-y-4 p-4"><h3 className="text-lg font-bold text-gray-800">Analysis</h3>{patternInfo.isLoading ? <p>Analyzing...</p> : patternInfo.pattern ? (<div><p><strong>Pattern:</strong> <span className="font-mono bg-gray-200 px-2 py-1 rounded-md">{patternInfo.pattern}</span></p><p className="mt-2 text-sm text-gray-600">{patternInfo.justification}</p></div>) : <p>Run code to see analysis.</p>}<div className="mt-4"><h4 className="font-bold flex items-center gap-2"><AlertIcon className="text-yellow-500"/>Misconception Alert</h4>{misconception.isLoading ? <p>Checking...</p> : misconception.alert && misconception.alert !== 'null' ? <p className="text-sm text-yellow-800 bg-yellow-100 p-2 rounded-md">{misconception.alert}</p> : <p className="text-sm text-gray-500">No obvious pitfalls detected.</p>}</div></div>}
                        {activeTab === 'complexity' && <BigOVisualizer complexityData={complexityData} bigO={patternInfo.pattern} />}
                        {activeTab === 'optimize' && <div className="space-y-4 p-4"><h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><LightbulbIcon/>Optimization</h3>{optimization.suggestion ? (<div><p className="text-sm text-green-800 bg-green-100 p-2 rounded-md">{optimization.suggestion}</p>{optimization.code ? <pre className="bg-gray-800 text-white text-xs p-2 rounded-md mt-2 overflow-x-auto"><code>{optimization.code}</code></pre> : <button onClick={handleOptimizationRefactor} disabled={optimization.isLoading} className="mt-2 w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400">{optimization.isLoading ? 'Refactoring...' : 'Refactor with AI'}</button>}</div>) : <p>No obvious optimizations detected.</p>}</div>}
                    </div>
                </div>
            </div>
            <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-lg shadow-lg flex-grow flex flex-col">
                    <h2 className="font-bold text-lg mb-2">Code Editor</h2>
                    <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full flex-grow border border-gray-300 rounded-md p-2 font-mono text-sm resize-none bg-gray-50" spellCheck="false"></textarea>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-lg flex-grow flex flex-col h-[60vh]">
                    <div className="grid grid-cols-3 gap-4 h-full">
                        <div className="col-span-2 h-full">
                            <h2 className="font-bold text-lg mb-2">Visualization</h2>
                            {trace.length > 0 && (
                                <div className="flex items-center gap-4 mb-2">
                                    <button onClick={handlePrevStep} className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50" disabled={currentStep === 0}><PrevIcon/></button>
                                    <input ref={sliderRef} type="range" min="0" max={trace.length - 1} value={currentStep} onChange={handleSliderChange} className="w-full"/>
                                    <button onClick={handleNextStep} className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50" disabled={currentStep === trace.length - 1}><NextIcon/></button>
                                    <span className="text-sm text-gray-600 whitespace-nowrap">{currentStep + 1} / {trace.length}</span>
                                </div>
                            )}
                            <div className="flex-grow w-full h-full relative">
                                <Visualization trace={trace} currentStep={currentStep} onNodeClick={handleNodeClick} />
                                {trace.length === 0 && !error && (<div className="absolute inset-0 flex items-center justify-center text-gray-400"><p>Click "Run" to visualize your code</p></div>)}
                            </div>
                        </div>
                        <div className="col-span-1 h-full">
                             <CallStackPanel trace={trace} currentStep={currentStep} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
}
