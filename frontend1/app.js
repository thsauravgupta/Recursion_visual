class RecursionTreeVisualizer {
    constructor() {
        this.templates = [
            {
                name: "Fibonacci",
                code: "function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}",
                params: "5",
                description: "Classic Fibonacci sequence with exponential time complexity"
            },
            {
                name: "Factorial",
                code: "function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}",
                params: "5",
                description: "Simple factorial calculation with linear time complexity"
            },
            {
                name: "Binary Search",
                code: "function binarySearch(arr, target, left = 0, right = arr.length - 1) {\n  if (left > right) return -1;\n  const mid = Math.floor((left + right) / 2);\n  if (arr[mid] === target) return mid;\n  if (arr[mid] > target) return binarySearch(arr, target, left, mid - 1);\n  return binarySearch(arr, target, mid + 1, right);\n}",
                params: "[1,2,3,4,5,6,7,8,9,10], 7",
                description: "Efficient searching algorithm with logarithmic time complexity"
            },
            {
                name: "Power Function",
                code: "function power(base, exp) {\n  if (exp === 0) return 1;\n  if (exp === 1) return base;\n  if (exp % 2 === 0) {\n    const half = power(base, exp / 2);\n    return half * half;\n  }\n  return base * power(base, exp - 1);\n}",
                params: "2, 10",
                description: "Optimized power calculation using divide and conquer"
            },
            {
                name: "GCD (Euclidean)",
                code: "function gcd(a, b) {\n  if (b === 0) return a;\n  return gcd(b, a % b);\n}",
                params: "48, 18",
                description: "Greatest Common Divisor using Euclidean algorithm"
            },
            {
                name: "Sum Array",
                code: "function sumArray(arr, index = 0) {\n  if (index >= arr.length) return 0;\n  return arr[index] + sumArray(arr, index + 1);\n}",
                params: "[1, 2, 3, 4, 5]",
                description: "Recursive array summation"
            }
        ];

        this.animationSpeeds = [
            { label: "0.5x", value: 2000 },
            { label: "1x", value: 1000 },
            { label: "2x", value: 500 },
            { label: "3x", value: 333 },
            { label: "5x", value: 200 }
        ];

        this.nodeColors = {
            active: "#3B82F6",
            completed: "#10B981",
            memoized: "#F59E0B",
            baseCase: "#EF4444",
            pending: "#6B7280"
        };

        this.executionState = {
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
            }
        };

        this.svgElements = {
            svg: null,
            group: null,
            zoom: 1,
            pan: { x: 0, y: 0 }
        };

        this.animationTimer = null;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };

        this.init();
    }

    init() {
        this.setupDOM();
        this.setupEventListeners();
        this.populateTemplates();
        this.loadDefaultTemplate();
        this.setupTheme();
        this.setupSVG();
    }

    setupDOM() {
        // Get all DOM elements
        this.elements = {
            // Code editor elements
            templateSelect: document.getElementById('template-select'),
            codeEditor: document.getElementById('code-editor'),
            functionParams: document.getElementById('function-params'),
            globalVars: document.getElementById('global-vars'),
            runBtn: document.getElementById('run-btn'),
            resetBtn: document.getElementById('reset-btn'),
            statusText: document.getElementById('status-text'),

            // Control elements
            playPauseBtn: document.getElementById('play-pause-btn'),
            stepBackBtn: document.getElementById('step-back-btn'),
            stepForwardBtn: document.getElementById('step-forward-btn'),
            speedSlider: document.getElementById('speed-slider'),
            currentStep: document.getElementById('current-step'),
            totalSteps: document.getElementById('total-steps'),
            callDepth: document.getElementById('call-depth'),
            maxDepth: document.getElementById('max-depth'),

            // Visualization elements
            treeSvg: document.getElementById('tree-svg'),
            treeGroup: document.getElementById('tree-group'),
            zoomInBtn: document.getElementById('zoom-in-btn'),
            zoomOutBtn: document.getElementById('zoom-out-btn'),
            centerBtn: document.getElementById('center-btn'),

            // Info panel elements
            tabBtns: document.querySelectorAll('.tab-btn'),
            callStack: document.getElementById('call-stack'),
            timeComplexity: document.getElementById('time-complexity'),
            spaceComplexity: document.getElementById('space-complexity'),
            totalCalls: document.getElementById('total-calls'),
            baseCaseCalls: document.getElementById('base-case-calls'),
            executionTime: document.getElementById('execution-time'),

            // Modal elements
            helpBtn: document.getElementById('help-btn'),
            helpModal: document.getElementById('help-modal'),
            closeHelpBtn: document.getElementById('close-help-btn'),

            // Theme toggle
            themeToggleBtn: document.getElementById('theme-toggle-btn'),
            themeIcon: document.getElementById('theme-icon'),

            // Tooltip
            tooltip: document.getElementById('tooltip')
        };
    }

    setupEventListeners() {
        // Template selection
        this.elements.templateSelect.addEventListener('change', (e) => {
            this.loadTemplate(e.target.value);
        });

        // Code execution
        this.elements.runBtn.addEventListener('click', () => {
            this.runCode();
        });

        this.elements.resetBtn.addEventListener('click', () => {
            this.resetExecution();
        });

        // Animation controls
        this.elements.playPauseBtn.addEventListener('click', () => {
            this.togglePlayPause();
        });

        this.elements.stepBackBtn.addEventListener('click', () => {
            this.stepBack();
        });

        this.elements.stepForwardBtn.addEventListener('click', () => {
            this.stepForward();
        });

        this.elements.speedSlider.addEventListener('input', (e) => {
            this.updateAnimationSpeed(parseInt(e.target.value));
        });

        // Visualization controls
        this.elements.zoomInBtn.addEventListener('click', () => {
            this.zoomIn();
        });

        this.elements.zoomOutBtn.addEventListener('click', () => {
            this.zoomOut();
        });

        this.elements.centerBtn.addEventListener('click', () => {
            this.centerTree();
        });

        // Tab switching
        this.elements.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Tab press in code editor only moves caret 
        this.elements.codeEditor.executionTime.addEventListener('keydown', (e) => {
            switch(e.key){
                case "Tab": e.preventDefault(); // prevent focus switch
                            const start = e.target.selectionStart;
                            const end = e.target.selectionEnd;

                            // set textarea value to: text before caret + tab + text after caret
                            const value = e.target.value;
                            e.target.value = value.substring(0, start) + "\t" + value.substring(end);

                            // move the caret
                            e.target.selectionStart = e.target.selectionEnd = start + 1;
                            break;
            }
                
        });

        // Code editor brackets and quotes matching
        const editor = this.templates.codeEditor;

        editor.addEventListener('keydown', (e) => {
        const pairs = {
            "(": ")",
            "[": "]",
            "{": "}",
            "'": "'",
            "\"": "\"",
            "`": "`"
        };

        const open = e.key;
        const close = pairs[open];

        // If the key is a matchable opening character
        if (close) {
            e.preventDefault();

            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            const value = editor.value;

            // Insert the pair and move caret in between
            editor.value = value.substring(0, start) + open + close + value.substring(end);
            editor.selectionStart = editor.selectionEnd = start + 1;
        }
        });


        // Modal controls - Fixed event handling
        this.elements.helpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showModal();
        });

        this.elements.closeHelpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.hideModal();
        });

        // Theme toggle
        this.elements.themeToggleBtn.addEventListener('click', () => {
            this.toggleTheme();
        });

        // SVG interaction
        this.setupSVGEvents();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });

        // Close modal on backdrop click - Fixed
        this.elements.helpModal.addEventListener('click', (e) => {
            if (e.target === this.elements.helpModal || e.target.classList.contains('modal-backdrop')) {
                e.preventDefault();
                e.stopPropagation();
                this.hideModal();
            }
        });

        // Prevent modal content clicks from closing modal
        this.elements.helpModal.querySelector('.modal-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    setupSVGEvents() {
        let isDragging = false;
        let dragStart = { x: 0, y: 0 };
        let panStart = { x: 0, y: 0 };

        this.elements.treeSvg.addEventListener('mousedown', (e) => {
            if (e.target === this.elements.treeSvg || e.target === this.elements.treeGroup) {
                isDragging = true;
                dragStart = { x: e.clientX, y: e.clientY };
                panStart = { ...this.svgElements.pan };
                this.elements.treeSvg.style.cursor = 'grabbing';
            }
        });

        this.elements.treeSvg.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - dragStart.x;
                const deltaY = e.clientY - dragStart.y;
                this.svgElements.pan.x = panStart.x + deltaX;
                this.svgElements.pan.y = panStart.y + deltaY;
                this.updateSVGTransform();
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                this.elements.treeSvg.style.cursor = 'move';
            }
        });

        // Zoom with mouse wheel
        this.elements.treeSvg.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            this.svgElements.zoom *= delta;
            this.svgElements.zoom = Math.max(0.1, Math.min(3, this.svgElements.zoom));
            this.updateSVGTransform();
        });
    }

    populateTemplates() {
        this.templates.forEach(template => {
            const option = document.createElement('option');
            option.value = template.name;
            option.textContent = template.name;
            this.elements.templateSelect.appendChild(option);
        });
    }

    loadDefaultTemplate() {
        this.loadTemplate('Fibonacci');
        this.elements.templateSelect.value = 'Fibonacci';
    }

    loadTemplate(templateName) {
        const template = this.templates.find(t => t.name === templateName);
        if (template) {
            this.elements.codeEditor.value = template.code;
            this.elements.functionParams.value = template.params;
            this.updateStatus('Template loaded', 'info');
        }
    }

    setupTheme() {
        const isDark = document.documentElement.getAttribute('data-color-scheme') === 'dark' ||
                      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
        this.updateThemeIcon(isDark);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        this.updateThemeIcon(newTheme === 'dark');
    }

    updateThemeIcon(isDark) {
        this.elements.themeIcon.textContent = isDark ? '☀️' : '🌙';
    }

    setupSVG() {
        this.svgElements.svg = this.elements.treeSvg;
        this.svgElements.group = this.elements.treeGroup;
        this.updateSVGTransform();
    }

    updateSVGTransform() {
        const transform = `translate(${this.svgElements.pan.x}, ${this.svgElements.pan.y}) scale(${this.svgElements.zoom})`;
        this.svgElements.group.setAttribute('transform', transform);
    }

    zoomIn() {
        this.svgElements.zoom *= 1.2;
        this.svgElements.zoom = Math.min(3, this.svgElements.zoom);
        this.updateSVGTransform();
    }

    zoomOut() {
        this.svgElements.zoom *= 0.8;
        this.svgElements.zoom = Math.max(0.1, this.svgElements.zoom);
        this.updateSVGTransform();
    }

    centerTree() {
        this.svgElements.zoom = 1;
        this.svgElements.pan = { x: 0, y: 0 };
        this.updateSVGTransform();
    }

    runCode() {
        try {
            this.updateStatus('Analyzing code...', 'info');
            this.elements.runBtn.disabled = true;

            const code = this.elements.codeEditor.value.trim();
            const params = this.elements.functionParams.value.trim();
            const globalVars = this.elements.globalVars.value.trim();

            if (!code) {
                throw new Error('Please enter a function to execute');
            }

            if (!params) {
                throw new Error('Please enter function parameters');
            }

            // Simulate execution for demo purposes
            this.simulateExecution(code, params);

        } catch (error) {
            this.updateStatus(`Error: ${error.message}`, 'error');
            this.elements.runBtn.disabled = false;
        }
    }

    simulateExecution(code, params) {
        // Simplified simulation for demo
        setTimeout(() => {
            // Create a simple tree structure for demonstration
            this.executionState.treeData = {
                id: 1,
                name: 'fibonacci',
                args: [5],
                result: 5,
                x: 400,
                y: 50,
                children: [
                    {
                        id: 2,
                        name: 'fibonacci',
                        args: [4],
                        result: 3,
                        x: 300,
                        y: 150,
                        children: [
                            {
                                id: 3,
                                name: 'fibonacci',
                                args: [3],
                                result: 2,
                                x: 250,
                                y: 250,
                                children: []
                            },
                            {
                                id: 4,
                                name: 'fibonacci',
                                args: [2],
                                result: 1,
                                x: 350,
                                y: 250,
                                children: []
                            }
                        ]
                    },
                    {
                        id: 5,
                        name: 'fibonacci',
                        args: [3],
                        result: 2,
                        x: 500,
                        y: 150,
                        children: [
                            {
                                id: 6,
                                name: 'fibonacci',
                                args: [2],
                                result: 1,
                                x: 450,
                                y: 250,
                                children: []
                            },
                            {
                                id: 7,
                                name: 'fibonacci',
                                args: [1],
                                result: 1,
                                x: 550,
                                y: 250,
                                children: []
                            }
                        ]
                    }
                ]
            };

            this.executionState.totalSteps = 15;
            this.executionState.maxDepth = 3;
            this.executionState.statistics = {
                totalCalls: 7,
                baseCaseCalls: 4,
                executionTime: 45
            };

            this.visualizeTree();
            this.enableAnimationControls();
            this.updateComplexityInfo('fibonacci');
            this.updateStatus('Execution complete', 'success');
            this.elements.runBtn.disabled = false;
        }, 1000);
    }

    visualizeTree() {
        if (!this.executionState.treeData) return;

        // Clear existing tree
        this.elements.treeGroup.innerHTML = '';

        // Draw edges first
        this.drawEdges(this.executionState.treeData);
        
        // Draw nodes
        this.drawNodes(this.executionState.treeData);
        
        // Center the tree initially
        this.centerTree();
    }

    drawEdges(node) {
        node.children.forEach(child => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('class', 'tree-edge');
            line.setAttribute('x1', node.x);
            line.setAttribute('y1', node.y + 25);
            line.setAttribute('x2', child.x);
            line.setAttribute('y2', child.y - 25);
            
            this.elements.treeGroup.appendChild(line);
            
            // Recursively draw edges for children
            this.drawEdges(child);
        });
    }

    drawNodes(node) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'tree-node node-completed');
        group.setAttribute('transform', `translate(${node.x}, ${node.y})`);
        
        // Circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('class', 'tree-node-circle');
        circle.setAttribute('r', '25');
        circle.setAttribute('cx', '0');
        circle.setAttribute('cy', '0');
        
        // Function name text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('class', 'tree-node-text');
        text.setAttribute('x', '0');
        text.setAttribute('y', '-5');
        text.setAttribute('font-size', '10');
        text.textContent = `${node.name}(${node.args.join(',')})`;
        
        // Result text
        const resultText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        resultText.setAttribute('class', 'tree-node-text');
        resultText.setAttribute('x', '0');
        resultText.setAttribute('y', '8');
        resultText.setAttribute('font-size', '10');
        resultText.textContent = `= ${node.result}`;
        
        group.appendChild(circle);
        group.appendChild(text);
        group.appendChild(resultText);
        
        // Add hover events
        this.setupNodeEvents(group, node);
        
        this.elements.treeGroup.appendChild(group);
        
        // Recursively draw child nodes
        node.children.forEach(child => {
            this.drawNodes(child);
        });
    }

    setupNodeEvents(element, node) {
        element.addEventListener('mouseenter', (e) => {
            this.showTooltip(e, node);
        });
        
        element.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
    }

    showTooltip(event, node) {
        const tooltip = this.elements.tooltip;
        const rect = this.elements.treeSvg.getBoundingClientRect();
        
        tooltip.querySelector('.tooltip-content').innerHTML = `
            <strong>${node.name}(${node.args.join(', ')})</strong><br>
            State: completed<br>
            ${node.result !== undefined ? `Result: ${node.result}` : ''}
        `;
        
        tooltip.style.left = (event.clientX - rect.left + 10) + 'px';
        tooltip.style.top = (event.clientY - rect.top - 10) + 'px';
        tooltip.classList.remove('hidden');
    }

    hideTooltip() {
        this.elements.tooltip.classList.add('hidden');
    }

    enableAnimationControls() {
        this.elements.playPauseBtn.disabled = false;
        this.elements.stepBackBtn.disabled = false;
        this.elements.stepForwardBtn.disabled = false;
        this.updateExecutionInfo();
    }

    togglePlayPause() {
        if (this.executionState.isRunning) {
            this.pauseAnimation();
        } else {
            this.startAnimation();
        }
    }

    startAnimation() {
        this.executionState.isRunning = true;
        this.executionState.isPaused = false;
        this.elements.playPauseBtn.textContent = '⏸️ Pause';
        
        const speed = this.animationSpeeds[this.elements.speedSlider.value].value;
        
        this.animationTimer = setInterval(() => {
            if (this.executionState.currentStep < this.executionState.totalSteps - 1) {
                this.stepForward();
            } else {
                this.pauseAnimation();
            }
        }, speed);
    }

    pauseAnimation() {
        this.executionState.isRunning = false;
        this.executionState.isPaused = true;
        this.elements.playPauseBtn.textContent = '▶️ Play';
        
        if (this.animationTimer) {
            clearInterval(this.animationTimer);
            this.animationTimer = null;
        }
    }

    stepForward() {
        if (this.executionState.currentStep < this.executionState.totalSteps - 1) {
            this.executionState.currentStep++;
            this.updateExecutionInfo();
        }
    }

    stepBack() {
        if (this.executionState.currentStep > 0) {
            this.executionState.currentStep--;
            this.updateExecutionInfo();
        }
    }

    updateExecutionInfo() {
        this.elements.currentStep.textContent = this.executionState.currentStep;
        this.elements.totalSteps.textContent = this.executionState.totalSteps;
        this.elements.maxDepth.textContent = this.executionState.maxDepth;
        this.elements.callDepth.textContent = Math.max(0, this.executionState.maxDepth - this.executionState.currentStep);
        this.elements.totalCalls.textContent = this.executionState.statistics.totalCalls;
        this.elements.baseCaseCalls.textContent = this.executionState.statistics.baseCaseCalls;
        this.elements.executionTime.textContent = this.executionState.statistics.executionTime + 'ms';
    }

    updateComplexityInfo(functionName) {
        // Basic complexity analysis based on function name
        const complexityMap = {
            fibonacci: { time: 'O(2^n)', space: 'O(n)' },
            factorial: { time: 'O(n)', space: 'O(n)' },
            binarySearch: { time: 'O(log n)', space: 'O(log n)' },
            power: { time: 'O(log n)', space: 'O(log n)' },
            gcd: { time: 'O(log n)', space: 'O(log n)' },
            sumArray: { time: 'O(n)', space: 'O(n)' }
        };
        
        const complexity = complexityMap[functionName.toLowerCase()] || { time: 'Unknown', space: 'Unknown' };
        this.elements.timeComplexity.textContent = complexity.time;
        this.elements.spaceComplexity.textContent = complexity.space;
    }

    resetExecution() {
        this.pauseAnimation();
        
        this.executionState = {
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
            }
        };
        
        // Clear visualization
        this.elements.treeGroup.innerHTML = '';
        
        // Reset controls
        this.elements.playPauseBtn.disabled = true;
        this.elements.stepBackBtn.disabled = true;
        this.elements.stepForwardBtn.disabled = true;
        this.elements.playPauseBtn.textContent = '▶️ Play';
        
        // Clear displays
        this.elements.callStack.innerHTML = '';
        this.updateExecutionInfo();
        
        this.updateStatus('Execution reset', 'info');
    }

    updateAnimationSpeed(speedIndex) {
        if (this.executionState.isRunning) {
            this.pauseAnimation();
            setTimeout(() => this.startAnimation(), 100);
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        this.elements.tabBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });
        
        // Update tab panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        
        document.getElementById(tabName + '-tab').classList.add('active');
    }

    showModal() {
        this.elements.helpModal.classList.remove('hidden');
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    }

    hideModal() {
        this.elements.helpModal.classList.add('hidden');
        // Restore body scroll
        document.body.style.overflow = '';
    }

    updateStatus(message, type = 'info') {
        this.elements.statusText.textContent = message;
        this.elements.statusText.className = `status status--${type}`;
    }

    handleKeyboard(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch (event.key) {
            case ' ':
                event.preventDefault();
                if (!this.elements.playPauseBtn.disabled) {
                    this.togglePlayPause();
                }
                break;
            case 'ArrowRight':
                event.preventDefault();
                if (!this.elements.stepForwardBtn.disabled) {
                    this.stepForward();
                }
                break;
            case 'ArrowLeft':
                event.preventDefault();
                if (!this.elements.stepBackBtn.disabled) {
                    this.stepBack();
                }
                break;
            case 'r':
                event.preventDefault();
                this.resetExecution();
                break;
            case 'Escape':
                this.hideModal();
                break;
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new RecursionTreeVisualizer();
    window.recursionVisualizer = app; // For debugging
});