import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { Chart } from 'chart.js/auto';

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

export default AIPanel