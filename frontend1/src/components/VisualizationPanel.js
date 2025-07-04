import React, { useRef, useEffect, useState } from 'react';
import { useRecursion } from '../context/RecursionContext';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

function VisualizationPanel() {
  const { state, dispatch, ActionTypes, nodeColors } = useRecursion();
  const { treeData, currentStep, executionSteps, svgTransform } = state;
  const svgRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Mouse event handlers for pan and zoom
  const handleMouseDown = (e) => {
    if (e.target === svgRef.current || e.target.closest('.tree-group')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      dispatch({
        type: ActionTypes.UPDATE_SVG_TRANSFORM,
        payload: {
          x: svgTransform.x + deltaX,
          y: svgTransform.y + deltaY
        }
      });

      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(3, svgTransform.scale * delta));

    dispatch({
      type: ActionTypes.UPDATE_SVG_TRANSFORM,
      payload: { scale: newScale }
    });
  };

  const handleZoomIn = () => {
    const newScale = Math.min(3, svgTransform.scale * 1.2);
    dispatch({
      type: ActionTypes.UPDATE_SVG_TRANSFORM,
      payload: { scale: newScale }
    });
  };

  const handleZoomOut = () => {
    const newScale = Math.max(0.1, svgTransform.scale * 0.8);
    dispatch({
      type: ActionTypes.UPDATE_SVG_TRANSFORM,
      payload: { scale: newScale }
    });
  };

  const handleCenter = () => {
    dispatch({ type: ActionTypes.RESET_SVG_TRANSFORM });
  };

  // Add event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const renderNode = (node, isActive = false) => {
    const nodeState = isActive ? 'active' : node.state;
    const fillColor = nodeColors[nodeState] || nodeColors.pending;

    return (
      <g key={node.id} transform={`translate(${node.x}, ${node.y})`} className="tree-node">
        <circle
          r="25"
          fill={fillColor}
          stroke="#fff"
          strokeWidth="2"
          className="tree-node-circle"
        />

        <text
          y="-5"
          textAnchor="middle"
          fill="white"
          fontSize="10"
          className="tree-node-text"
        >
          {`${node.name}(${node.args.join(',')})`}
        </text>

        <text
          y="8"
          textAnchor="middle"
          fill="white"
          fontSize="10"
          className="tree-node-result"
        >
          {node.result !== undefined ? `= ${node.result}` : ''}
        </text>
      </g>
    );
  };

  const renderEdge = (parent, child) => {
    return (
      <line
        key={`${parent.id}-${child.id}`}
        x1={parent.x}
        y1={parent.y + 25}
        x2={child.x}
        y2={child.y - 25}
        stroke="#666"
        strokeWidth="2"
        className="tree-edge"
      />
    );
  };

  const renderTree = (node, activeNodeId = null) => {
    const elements = [];

    // Render edges first
    if (node.children) {
      node.children.forEach(child => {
        elements.push(renderEdge(node, child));
        elements.push(...renderTree(child, activeNodeId));
      });
    }

    // Render node
    elements.push(renderNode(node, node.id === activeNodeId));

    return elements;
  };

  const activeNodeId = executionSteps[currentStep]?.activeNode;

  return (
    <div className="panel visualization-panel">
      <div className="panel-header">
        <h3>Tree Visualization</h3>
        <div className="visualization-controls">
          <button
            className="btn btn--sm btn--outline"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            className="btn btn--sm btn--outline"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            className="btn btn--sm btn--outline"
            onClick={handleCenter}
            title="Center & Reset Zoom"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      <div className="panel-body">
        <div className="tree-container">
          <svg
            ref={svgRef}
            className="tree-svg"
            viewBox="0 0 800 600"
            onMouseDown={handleMouseDown}
            onWheel={handleWheel}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#666"
                />
              </marker>
            </defs>

            <g
              className="tree-group"
              transform={`translate(${svgTransform.x}, ${svgTransform.y}) scale(${svgTransform.scale})`}
            >
              {treeData && renderTree(treeData, activeNodeId)}
            </g>
          </svg>

          {/* Legend */}
          <div className="tree-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: nodeColors.active }}></div>
              <span>Active</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: nodeColors.completed }}></div>
              <span>Completed</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: nodeColors.baseCase }}></div>
              <span>Base Case</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: nodeColors.pending }}></div>
              <span>Pending</span>
            </div>
          </div>

          {!treeData && (
            <div className="empty-state">
              <p>Run an algorithm to see the recursion tree visualization</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VisualizationPanel;
