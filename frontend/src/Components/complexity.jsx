import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { Chart } from 'chart.js/auto';

const BigOVisualizer = ({ complexityData, bigO }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    useEffect(() => {
        if (!complexityData || complexityData.length === 0 || !chartRef.current) return;
        const getBigOData = (n) => {
            const pattern = bigO?.toLowerCase() || '';
            if (pattern.includes('2^n')) return Math.pow(2, n);
            if (pattern.includes('n^2')) return n * n;
            if (pattern.includes('n log n')) return n * Math.log2(n);
            if (pattern.includes('linear') || pattern.includes('n')) return n;
            if (pattern.includes('log n')) return Math.log2(n);
            return 1;
        };
        const labels = complexityData.map(d => d.n);
        const theoreticalData = labels.map(n => getBigOData(n));
        const maxTheoretical = Math.max(...theoreticalData);
        const maxActual = Math.max(...complexityData.map(d => d.ops));
        const scaleFactor = maxTheoretical > 0 ? maxActual / maxTheoretical : 1;
        if (chartInstance.current) chartInstance.current.destroy();
        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{ label: 'Actual Operations', data: complexityData.map(d => d.ops), borderColor: 'rgb(59, 130, 246)', tension: 0.1 },
                           { label: `Theoretical ${bigO || ''}`, data: theoreticalData.map(d => d * scaleFactor), borderColor: 'rgb(239, 68, 68)', borderDash: [5, 5], tension: 0.1 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'Complexity Analysis' } }, scales: { x: { title: { display: true, text: 'Input Size (n)' } }, y: { title: { display: true, text: 'Operations' } } } }
        });
    }, [complexityData, bigO]);
    return (
        <div className="space-y-4 p-4">
            <h3 className="text-lg font-bold text-gray-800">Big O Visualizer</h3>
            <div className="relative h-64">
                {complexityData.length > 0 ? <canvas ref={chartRef}></canvas> : <p className="text-center text-gray-500">Run an algorithm to see its complexity plot.</p>}
            </div>
        </div>
    );
};

export default BigOVisualizer