import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, HelpCircle } from 'lucide-react';

function Header() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <div className="flex items-center justify-between">
          <h1 className="app-title">Recursion Tree Visualizer</h1>

          <div className="flex items-center gap-4">
            <button
              className="btn btn--outline"
              onClick={() => setShowHelp(true)}
              title="Help"
            >
              <HelpCircle size={18} />
              Help
            </button>

            <button
              className="btn btn--outline theme-toggle"
              onClick={toggleTheme}
              title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
