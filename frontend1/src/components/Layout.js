import React from 'react';
import Header from './Header';
import CodePanel from './CodePanel';
import ControlPanel from './ControlPanel';
import VisualizationPanel from './VisualizationPanel';
import InfoPanel from './InfoPanel';
import HelpModal from './HelpModal';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

function Layout() {
  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        <div className="container">
          <div className="layout-grid">
            <CodePanel />
            <ControlPanel />
            <VisualizationPanel />
            <InfoPanel />
          </div>
        </div>
      </main>

      <HelpModal />
    </div>
  );
}

export default Layout;
