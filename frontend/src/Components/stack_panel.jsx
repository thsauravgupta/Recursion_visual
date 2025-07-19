import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { Chart } from 'chart.js/auto';

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

export default CallStackPanel