import React, { useState } from 'react';
import { useRecursion } from '../context/RecursionContext';

function InfoPanel() {
  const { state } = useRecursion();
  const { callStack, statistics, selectedAlgorithm, currentStep, executionSteps } = state;
  const [activeTab, setActiveTab] = useState('stack');

  // Get complexity info based on algorithm
  const getComplexityInfo = (algorithmName) => {
    const complexityMap = {
      fibonacci: { time: 'O(2^n)', space: 'O(n)' },
      factorial: { time: 'O(n)', space: 'O(n)' },
      'binary search': { time: 'O(log n)', space: 'O(log n)' },
      'power function': { time: 'O(log n)', space: 'O(log n)' },
      'gcd (euclidean)': { time: 'O(log n)', space: 'O(log n)' },
      'sum array': { time: 'O(n)', space: 'O(n)' }
    };

    const key = algorithmName.toLowerCase();
    return complexityMap[key] || { time: 'Unknown', space: 'Unknown' };
  };

  const complexity = getComplexityInfo(selectedAlgorithm);
  const currentStepInfo = executionSteps[currentStep];

  return (
    <div className="panel info-panel">
      <div className="panel-header">
        <h3>Execution Details</h3>
      </div>

      <div className="panel-body">
        <div className="info-tabs">
          <button
            className={`tab-btn ${activeTab === 'stack' ? 'active' : ''}`}
            onClick={() => setActiveTab('stack')}
          >
            Call Stack
          </button>
          <button
            className={`tab-btn ${activeTab === 'complexity' ? 'active' : ''}`}
            onClick={() => setActiveTab('complexity')}
          >
            Complexity
          </button>
          <button
            className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'stack' && (
            <div className="tab-pane active">
              <div className="call-stack">
                {currentStepInfo && (
                  <div className="step-description">
                    <p><strong>Current Step:</strong> {currentStepInfo.description}</p>
                  </div>
                )}

                {callStack.length > 0 ? (
                  callStack.map((call, index) => (
                    <div 
                      key={index} 
                      className={`call-stack-item ${index === 0 ? 'active' : ''}`}
                    >
                      {call}
                    </div>
                  ))
                ) : (
                  <p className="empty-state">No active function calls</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'complexity' && (
            <div className="tab-pane active">
              <div className="complexity-info">
                <div className="complexity-item">
                  <span className="complexity-label">Time Complexity:</span>
                  <span className="complexity-value">{complexity.time}</span>
                </div>

                <div className="complexity-item">
                  <span className="complexity-label">Space Complexity:</span>
                  <span className="complexity-value">{complexity.space}</span>
                </div>

                <div className="complexity-description">
                  <h4>Analysis:</h4>
                  <p>{getComplexityDescription(selectedAlgorithm, complexity)}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="tab-pane active">
              <div className="statistics-info">
                <div className="stat-item">
                  <span className="stat-label">Total Calls:</span>
                  <span className="stat-value">{statistics.totalCalls}</span>
                </div>

                <div className="stat-item">
                  <span className="stat-label">Base Case Calls:</span>
                  <span className="stat-value">{statistics.baseCaseCalls}</span>
                </div>

                <div className="stat-item">
                  <span className="stat-label">Execution Time:</span>
                  <span className="stat-value">{statistics.executionTime}ms</span>
                </div>

                <div className="stat-item">
                  <span className="stat-label">Efficiency:</span>
                  <span className="stat-value">
                    {statistics.totalCalls > 0 
                      ? `${((statistics.baseCaseCalls / statistics.totalCalls) * 100).toFixed(1)}%`
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getComplexityDescription(algorithmName, complexity) {
  const descriptions = {
    fibonacci: "The naive recursive Fibonacci has exponential time complexity because it recalculates the same subproblems multiple times. Each call branches into two more calls, creating a binary tree of exponential size.",
    factorial: "Factorial has linear time and space complexity because it makes exactly n recursive calls, one for each number from n down to 1.",
    'binary search': "Binary Search has logarithmic complexity because it eliminates half of the search space with each recursive call.",
    'power function': "The optimized power function uses divide-and-conquer to achieve logarithmic complexity by squaring intermediate results.",
    'gcd (euclidean)': "The Euclidean algorithm for GCD has logarithmic complexity based on the properties of the modulo operation.",
    'sum array': "Array summation has linear complexity as it visits each element exactly once."
  };

  return descriptions[algorithmName.toLowerCase()] || 
    `This algorithm has ${complexity.time} time complexity and ${complexity.space} space complexity.`;
}

export default InfoPanel;
