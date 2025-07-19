import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { Chart } from 'chart.js/auto';

// --- Centralized AI Analysis Function ---
const aiAnalyze = async (promptText) => {
    try {
        const chatHistory = [{ role: "user", parts: [{ text: promptText }] }];
        const payload = { contents: chatHistory };
        const apiKey = "";
        // This is the direct API endpoint. It will work in Gemini's preview.
        // For local development with Vite, change this to: /api/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}
        // ...and ensure you have the vite.config.js proxy setup.
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
        const result = await response.json();
        if (!result.candidates?.[0]?.content?.parts?.[0]?.text) return null;
        return result.candidates[0].content.parts[0].text.replace(/```(json|javascript)?|```/g, '').trim();
    } catch (e) {
        console.error("AI analysis error:", e);
        return null;
    }
};

export default aiAnalyze