# Recursion Tree Visualizer - Complete Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)
- Git (optional, for cloning)

### Installation Steps

1. **Create the project directory:**
   ```bash
   mkdir recursion-tree-visualizer
   cd recursion-tree-visualizer
   ```

2. **Copy all the provided files into your project directory** with the following structure:
   ```
   recursion-tree-visualizer/
   ├── public/
   │   └── index.html
   ├── src/
   │   ├── components/
   │   │   ├── Layout.js
   │   │   ├── Header.js
   │   │   ├── CodePanel.js
   │   │   ├── ControlPanel.js
   │   │   ├── VisualizationPanel.js
   │   │   ├── InfoPanel.js
   │   │   └── HelpModal.js
   │   ├── context/
   │   │   ├── ThemeContext.js
   │   │   └── RecursionContext.js
   │   ├── hooks/
   │   │   └── useKeyboardShortcuts.js
   │   ├── utils/
   │   │   ├── algorithmsData.js
   │   │   └── executionSimulator.js
   │   ├── App.js
   │   ├── App.css
   │   ├── index.js
   │   └── index.css
   ├── package.json
   ├── README.md
   └── .gitignore
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

## 🎯 Features Overview

### ✨ Complete Feature Set
- **Interactive Code Editor** with syntax highlighting
- **6 Pre-built Algorithm Templates** (Fibonacci, Factorial, Binary Search, etc.)
- **Step-by-Step Animation Controls** with speed adjustment
- **Beautiful SVG Tree Visualization** with zoom and pan
- **Real-time Execution Statistics** and complexity analysis
- **Dark/Light Theme Support** with system preference detection
- **Keyboard Shortcuts** for power users
- **Responsive Design** that works on all devices
- **Accessibility Features** including high contrast support

### 🎮 How to Use

1. **Select a Template:** Choose from pre-built algorithms or write your own
2. **Enter Parameters:** Provide input values for the function
3. **Run Analysis:** Click "Run" to generate the recursion tree
4. **Control Animation:** Use play/pause/step controls to understand execution
5. **Explore the Tree:** Zoom, pan, and interact with the visualization
6. **Analyze Performance:** Check complexity and execution statistics

### ⌨️ Keyboard Shortcuts
- **Space:** Play/Pause animation
- **Arrow Right:** Step forward
- **Arrow Left:** Step backward
- **R:** Reset execution
- **Escape:** Close help modal

## 🛠️ Development

### Adding New Algorithm Templates
Edit `src/utils/algorithmsData.js` to add new algorithm templates:

```javascript
{
  name: "Your Algorithm",
  code: `function yourAlgorithm(n) {
    // Your recursive function here
  }`,
  params: "5",
  description: "Description of your algorithm"
}
```

### Customizing the UI
- **Colors & Themes:** Modify CSS variables in `src/index.css`
- **Layout:** Adjust grid system in `src/App.css`
- **Components:** Customize individual components in `src/components/`

### Building for Production
```bash
npm run build
```

The optimized build will be created in the `build` folder.

## 📚 Architecture

### State Management
- **React Context** for global state management
- **useReducer** for complex state transitions
- **Custom hooks** for reusable logic

### Component Structure
- **Modular design** with clear separation of concerns
- **Responsive layout** using CSS Grid
- **Accessible components** with proper ARIA attributes

### Performance Optimizations
- **React.memo** for preventing unnecessary re-renders
- **Efficient SVG rendering** with minimal DOM updates
- **Optimized animation loops** using requestAnimationFrame

## 🐛 Troubleshooting

### Common Issues

1. **"Module not found" errors:**
   - Ensure all files are in the correct directory structure
   - Run `npm install` to install dependencies

2. **Application won't start:**
   - Check that Node.js version is 14 or higher: `node --version`
   - Clear npm cache: `npm cache clean --force`

3. **Visualization not displaying:**
   - Check browser console for JavaScript errors
   - Ensure SVG elements are rendering correctly

4. **Animation not working:**
   - Check if the execution completed successfully
   - Verify that tree data was generated

## 🤝 Contributing

Feel free to submit issues and pull requests! Areas for contribution:
- Additional algorithm templates
- Enhanced visualization features
- Performance improvements
- Bug fixes and documentation

## 📄 License

MIT License - feel free to use this project for learning and development!

---

**Need help?** Click the "Help" button in the application for detailed usage instructions.
