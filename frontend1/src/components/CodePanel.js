import React from 'react';
import { useRecursion } from '../context/RecursionContext';
import { algorithmsData } from '../utils/algorithmsData';
import { executionSimulator } from '../utils/executionSimulator';
import { Play, RotateCcw } from 'lucide-react';

function CodePanel() {
  const { state, dispatch, ActionTypes } = useRecursion();
  const { code, params, globalVars, selectedAlgorithm, isRunning, error } = state;

  const handleAlgorithmChange = (e) => {
    dispatch({ type: ActionTypes.SELECT_ALGORITHM, payload: e.target.value });
  };

  const handleCodeChange = (e) => {
    dispatch({ type: ActionTypes.SET_CODE, payload: e.target.value });
  };

  const handleParamsChange = (e) => {
    dispatch({ type: ActionTypes.SET_PARAMS, payload: e.target.value });
  };

  const handleGlobalVarsChange = (e) => {
    dispatch({ type: ActionTypes.SET_GLOBAL_VARS, payload: e.target.value });
  };

  const handleRun = () => {
    if (!code.trim()) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Please enter a function to execute' });
      return;
    }
    if (!params.trim()) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Please enter function parameters' });
      return;
    }

    // Clear any previous errors
    dispatch({ type: ActionTypes.SET_ERROR, payload: null });

    // Start execution
    dispatch({ type: ActionTypes.START_EXECUTION });

    // Simulate execution with a delay for realism
    setTimeout(() => {
      try {
        const executionResult = executionSimulator.simulateExecution(
          code, 
          params, 
          selectedAlgorithm
        );

        dispatch({ 
          type: ActionTypes.SET_TREE_DATA, 
          payload: executionResult 
        });
      } catch (error) {
        dispatch({ 
          type: ActionTypes.SET_ERROR, 
          payload: error.message 
        });
      }
    }, 1000);
  };

  const handleReset = () => {
    dispatch({ type: ActionTypes.RESET_EXECUTION });
  };

  return (
    <div className="panel code-panel">
      <div className="panel-header">
        <h3>Code Editor</h3>
        <div className="template-selector">
          <label className="form-label">Template:</label>
          <select 
            className="form-control"
            value={selectedAlgorithm}
            onChange={handleAlgorithmChange}
          >
            {algorithmsData.map(algorithm => (
              <option key={algorithm.name} value={algorithm.name}>
                {algorithm.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="panel-body">
        <div className="code-editor-container">
          <textarea
            className="code-editor form-control"
            value={code}
            onChange={handleCodeChange}
            placeholder="Enter your recursive function here..."
            spellCheck={false}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Function Parameters:</label>
          <input
            type="text"
            className="form-control"
            value={params}
            onChange={handleParamsChange}
            placeholder="e.g., 5 or [1,2,3], 2"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Global Variables (optional):</label>
          <textarea
            className="form-control"
            value={globalVars}
            onChange={handleGlobalVarsChange}
            placeholder="e.g., const memo = {};"
            rows={2}
          />
        </div>

        <div className="editor-actions">
          <button
            className="btn btn--primary"
            onClick={handleRun}
            disabled={isRunning}
          >
            <Play size={18} />
            {isRunning ? 'Running...' : 'Run'}
          </button>

          <button
            className="btn btn--secondary"
            onClick={handleReset}
          >
            <RotateCcw size={18} />
            Reset
          </button>

          {error && (
            <div className="execution-status">
              <span className="status status--error">{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CodePanel;
