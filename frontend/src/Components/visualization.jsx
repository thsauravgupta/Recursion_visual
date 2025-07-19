import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { Chart } from 'chart.js/auto';

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

export default Visualization