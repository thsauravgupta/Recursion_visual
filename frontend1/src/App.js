import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { RecursionProvider } from './context/RecursionContext';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <RecursionProvider>
        <Layout />
      </RecursionProvider>
    </ThemeProvider>
  );
}

export default App;
