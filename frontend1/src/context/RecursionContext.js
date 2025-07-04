import React, { createContext, useContext, useReducer } from 'react';
import { algorithmsData } from '../utils/algorithmsData';

// Initial state
const initialState = {
  // Code editor state
  code: '',
  params: '',
  globalVars: '',
  selectedAlgorithm: 'fibonacci',

  // Execution state
  isRunning: false,
  isPaused: false,
  currentStep: 0,
  totalSteps: 0,
  callStack: [],
  executionSteps: [],

  // Tree data
  treeData: null,
  maxDepth: 0,

  // Stats
  statistics: {
    totalCalls: 0,
    baseCaseCalls: 0,
    executionTime: 0
  },

  // Error state
  error: null,

  // Visualization controls
  animationSpeed: 1, // Index in animationSpeeds array
  svgTransform: { scale: 1, x: 0, y: 0 }
};

// Action types
const ActionTypes = {
  SET_CODE: 'SET_CODE',
  SET_PARAMS: 'SET_PARAMS',
  SET_GLOBAL_VARS: 'SET_GLOBAL_VARS',
  SELECT_ALGORITHM: 'SELECT_ALGORITHM',
  START_EXECUTION: 'START_EXECUTION',
  PAUSE_EXECUTION: 'PAUSE_EXECUTION',
  RESET_EXECUTION: 'RESET_EXECUTION',
  SET_EXECUTION_STEP: 'SET_EXECUTION_STEP',
  SET_TREE_DATA: 'SET_TREE_DATA',
  SET_ERROR: 'SET_ERROR',
  SET_ANIMATION_SPEED: 'SET_ANIMATION_SPEED',
  UPDATE_SVG_TRANSFORM: 'UPDATE_SVG_TRANSFORM',
  RESET_SVG_TRANSFORM: 'RESET_SVG_TRANSFORM'
};

// Reducer function
function recursionReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_CODE:
      return { ...state, code: action.payload };

    case ActionTypes.SET_PARAMS:
      return { ...state, params: action.payload };

    case ActionTypes.SET_GLOBAL_VARS:
      return { ...state, globalVars: action.payload };

    case ActionTypes.SELECT_ALGORITHM: {
      const algorithm = algorithmsData.find(a => a.name.toLowerCase() === action.payload.toLowerCase());
      return { 
        ...state, 
        selectedAlgorithm: action.payload,
        code: algorithm.code,
        params: algorithm.params,
        globalVars: algorithm.globalVars || ''
      };
    }

    case ActionTypes.START_EXECUTION:
      return { 
        ...state, 
        isRunning: true, 
        isPaused: false,
        error: null 
      };

    case ActionTypes.PAUSE_EXECUTION:
      return { ...state, isRunning: false, isPaused: true };

    case ActionTypes.RESET_EXECUTION:
      return { 
        ...state, 
        isRunning: false, 
        isPaused: false,
        currentStep: 0,
        totalSteps: 0,
        callStack: [],
        executionSteps: [],
        treeData: null,
        maxDepth: 0,
        statistics: {
          totalCalls: 0,
          baseCaseCalls: 0,
          executionTime: 0
        },
        error: null
      };

    case ActionTypes.SET_EXECUTION_STEP:
      return { 
        ...state, 
        currentStep: action.payload,
        // Update callStack based on the current step
        callStack: state.executionSteps[action.payload]?.callStack || []
      };

    case ActionTypes.SET_TREE_DATA:
      return { 
        ...state, 
        treeData: action.payload.treeData,
        executionSteps: action.payload.executionSteps,
        totalSteps: action.payload.executionSteps.length,
        maxDepth: action.payload.maxDepth,
        statistics: action.payload.statistics,
        isRunning: false,
        isPaused: true,
        currentStep: 0
      };

    case ActionTypes.SET_ERROR:
      return { 
        ...state, 
        error: action.payload,
        isRunning: false,
        isPaused: false
      };

    case ActionTypes.SET_ANIMATION_SPEED:
      return { ...state, animationSpeed: action.payload };

    case ActionTypes.UPDATE_SVG_TRANSFORM:
      return { 
        ...state, 
        svgTransform: {
          ...state.svgTransform,
          ...action.payload
        }
      };

    case ActionTypes.RESET_SVG_TRANSFORM:
      return { 
        ...state, 
        svgTransform: { scale: 1, x: 0, y: 0 }
      };

    default:
      return state;
  }
}

// Create context
const RecursionContext = createContext();

// Provider component
export function RecursionProvider({ children }) {
  const [state, dispatch] = useReducer(recursionReducer, initialState);

  // Animation speeds
  const animationSpeeds = [
    { label: '0.5x', value: 2000 },
    { label: '1x', value: 1000 },
    { label: '2x', value: 500 },
    { label: '3x', value: 300 },
    { label: '5x', value: 100 }
  ];

  // Node colors
  const nodeColors = {
    active: '#3B82F6',  // Blue
    completed: '#10B981', // Green
    baseCase: '#EF4444',  // Red
    pending: '#6B7280'   // Gray
  };

  return (
    <RecursionContext.Provider 
      value={{ 
        state, 
        dispatch, 
        ActionTypes,
        animationSpeeds,
        nodeColors
      }}
    >
      {children}
    </RecursionContext.Provider>
  );
}

// Custom hook for using the context
export function useRecursion() {
  const context = useContext(RecursionContext);
  if (context === undefined) {
    throw new Error('useRecursion must be used within a RecursionProvider');
  }
  return context;
}
