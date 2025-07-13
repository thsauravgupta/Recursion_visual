import React, { useState } from 'react';
import { X } from 'lucide-react';

function HelpModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Add global event listener for help button (if needed)
  React.useEffect(() => {
    const handleHelpButton = (e) => {
      if (e.target.textContent === 'Help' || e.target.closest('button')?.textContent?.includes('Help')) {
        openModal();
      }
    };

    document.addEventListener('click', handleHelpButton);
    return () => document.removeEventListener('click', handleHelpButton);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="modal" onClick={closeModal}>
      <div className="modal-backdrop"></div>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>How to Use the Recursion Tree Visualizer</h2>
          <button className="btn btn--outline" onClick={closeModal}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <h3>Getting Started</h3>
          <ol>
            <li>Choose a template algorithm from the dropdown or write your own recursive function</li>
            <li>Enter the function parameters (e.g., "5" for fibonacci(5))</li>
            <li>Click "Run" to analyze and visualize the recursion</li>
            <li>Use the animation controls to step through execution</li>
          </ol>

          <h3>Animation Controls</h3>
          <ul>
            <li><strong>Play/Pause:</strong> Start or stop the animation</li>
            <li><strong>Step Back/Forward:</strong> Move one step at a time</li>
            <li><strong>Speed Control:</strong> Adjust animation speed from 0.5x to 5x</li>
          </ul>

          <h3>Tree Visualization</h3>
          <ul>
            <li><strong>Pan:</strong> Click and drag to move around the tree</li>
            <li><strong>Zoom:</strong> Use mouse wheel or zoom buttons</li>
            <li><strong>Node Colors:</strong>
              <ul>
                <li>Blue: Currently executing function</li>
                <li>Green: Completed function calls</li>
                <li>Red: Base case calls</li>
                <li>Gray: Pending function calls</li>
              </ul>
            </li>
          </ul>

          <h3>Information Panels</h3>
          <ul>
            <li><strong>Call Stack:</strong> Shows the current function call stack</li>
            <li><strong>Complexity:</strong> Displays time and space complexity analysis</li>
            <li><strong>Statistics:</strong> Shows execution metrics and efficiency</li>
          </ul>

          <h3>Writing Custom Functions</h3>
          <p>You can write your own recursive functions using JavaScript syntax:</p>
          <pre><code>{`function myFunction(n) {
  if (n <= 1) return 1; // base case
  return n + myFunction(n - 1); // recursive case
}`}</code></pre>

          <h3>Tips for Better Visualization</h3>
          <ul>
            <li>Use small input values (n ≤ 10) for better visualization</li>
            <li>Functions with many recursive calls may be hard to visualize</li>
            <li>The tree layout automatically adjusts based on the recursion structure</li>
            <li>Use the step controls to understand the execution flow</li>
          </ul>

          <h3>Keyboard Shortcuts</h3>
          <ul>
            <li><strong>Space:</strong> Play/Pause animation</li>
            <li><strong>Arrow Right:</strong> Step forward</li>
            <li><strong>Arrow Left:</strong> Step backward</li>
            <li><strong>R:</strong> Reset execution</li>
            <li><strong>Escape:</strong> Close this help modal</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HelpModal;
