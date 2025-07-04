import { useEffect } from 'react';
import { useRecursion } from '../context/RecursionContext';

export function useKeyboardShortcuts() {
  const { state, dispatch, ActionTypes } = useRecursion();
  const { currentStep, totalSteps, isRunning } = state;

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Don't trigger shortcuts when typing in input fields
      if (event.target.tagName === 'INPUT' || 
          event.target.tagName === 'TEXTAREA' || 
          event.target.isContentEditable) {
        return;
      }

      switch (event.key) {
        case ' ':
        case 'Spacebar': // For older browsers
          event.preventDefault();
          if (totalSteps > 0) {
            if (isRunning) {
              dispatch({ type: ActionTypes.PAUSE_EXECUTION });
            } else {
              dispatch({ type: ActionTypes.START_EXECUTION });
            }
          }
          break;

        case 'ArrowRight':
          event.preventDefault();
          if (currentStep < totalSteps - 1) {
            dispatch({ type: ActionTypes.SET_EXECUTION_STEP, payload: currentStep + 1 });
          }
          break;

        case 'ArrowLeft':
          event.preventDefault();
          if (currentStep > 0) {
            dispatch({ type: ActionTypes.SET_EXECUTION_STEP, payload: currentStep - 1 });
          }
          break;

        case 'r':
        case 'R':
          event.preventDefault();
          dispatch({ type: ActionTypes.RESET_EXECUTION });
          break;

        case 'Escape':
          // Close any open modals (handled in HelpModal component)
          break;

        case '?':
          event.preventDefault();
          // This could trigger help modal
          break;

        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [state, dispatch, ActionTypes, currentStep, totalSteps, isRunning]);
}
