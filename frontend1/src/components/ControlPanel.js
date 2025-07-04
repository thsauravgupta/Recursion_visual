import React, { useEffect, useRef } from 'react';
import { useRecursion } from '../context/RecursionContext';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

function ControlPanel() {
  const { state, dispatch, ActionTypes, animationSpeeds } = useRecursion();
  const { 
    isRunning, 
    isPaused, 
    currentStep, 
    totalSteps, 
    maxDepth, 
    animationSpeed 
  } = state;

  const intervalRef = useRef(null);

  // Auto-play animation
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: ActionTypes.SET_EXECUTION_STEP, payload: currentStep + 1 });

        if (currentStep >= totalSteps - 1) {
          dispatch({ type: ActionTypes.PAUSE_EXECUTION });
        }
      }, animationSpeeds[animationSpeed].value);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused, currentStep, totalSteps, animationSpeed, dispatch, ActionTypes, animationSpeeds]);

  const handlePlayPause = () => {
    if (totalSteps === 0) return;

    if (isRunning) {
      dispatch({ type: ActionTypes.PAUSE_EXECUTION });
    } else {
      dispatch({ type: ActionTypes.START_EXECUTION });
    }
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      dispatch({ type: ActionTypes.SET_EXECUTION_STEP, payload: currentStep - 1 });
    }
  };

  const handleStepForward = () => {
    if (currentStep < totalSteps - 1) {
      dispatch({ type: ActionTypes.SET_EXECUTION_STEP, payload: currentStep + 1 });
    }
  };

  const handleSpeedChange = (e) => {
    dispatch({ type: ActionTypes.SET_ANIMATION_SPEED, payload: parseInt(e.target.value) });
  };

  const currentCallDepth = Math.max(0, maxDepth - Math.floor(currentStep / 2));

  return (
    <div className="panel control-panel">
      <div className="panel-header">
        <h3>Execution Controls</h3>
      </div>

      <div className="panel-body">
        <div className="controls-row">
          <button
            className="btn btn--secondary"
            onClick={handleStepBack}
            disabled={currentStep === 0 || totalSteps === 0}
            title="Step Back"
          >
            <SkipBack size={16} />
          </button>

          <button
            className="btn btn--primary"
            onClick={handlePlayPause}
            disabled={totalSteps === 0}
            title={isRunning ? 'Pause' : 'Play'}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <button
            className="btn btn--secondary"
            onClick={handleStepForward}
            disabled={currentStep >= totalSteps - 1 || totalSteps === 0}
            title="Step Forward"
          >
            <SkipForward size={16} />
          </button>
        </div>

        <div className="speed-control">
          <label className="form-label">Animation Speed:</label>
          <div className="speed-slider-container">
            <input
              type="range"
              min="0"
              max={animationSpeeds.length - 1}
              value={animationSpeed}
              onChange={handleSpeedChange}
              className="speed-slider"
            />
            <div className="speed-labels">
              {animationSpeeds.map((speed, index) => (
                <span key={index} className="speed-label">{speed.label}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="execution-info">
          <div className="info-item">
            <span className="info-label">Step:</span>
            <span>{currentStep} / {totalSteps}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Call Depth:</span>
            <span>{currentCallDepth}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Max Depth:</span>
            <span>{maxDepth}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
