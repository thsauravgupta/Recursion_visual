// Advanced execution simulation utilities
export class ExecutionSimulator {
  constructor() {
    this.executionSteps = [];
    this.callStack = [];
    this.nodeId = 1;
  }

  // Simulate execution of a recursive function
  simulateExecution(code, params, algorithmName) {
    try {
      // Parse function name from code
      const functionMatch = code.match(/function\s+(\w+)/);
      const functionName = functionMatch ? functionMatch[1] : 'recursiveFunction';

      // Parse parameters
      const parsedParams = this.parseParameters(params);

      // Generate tree based on algorithm type
      const treeData = this.generateTreeForAlgorithm(algorithmName, functionName, parsedParams);

      // Generate execution steps
      const executionSteps = this.generateExecutionSteps(treeData);

      // Calculate statistics
      const statistics = this.calculateStatistics(treeData);

      return {
        treeData,
        executionSteps,
        maxDepth: this.calculateMaxDepth(treeData),
        statistics
      };
    } catch (error) {
      throw new Error(`Execution simulation failed: ${error.message}`);
    }
  }

  parseParameters(paramString) {
    try {
      // Handle different parameter formats
      if (paramString.includes('[')) {
        // Array parameter
        return eval(`[${paramString}]`);
      } else if (paramString.includes(',')) {
        // Multiple parameters
        return paramString.split(',').map(p => {
          const trimmed = p.trim();
          return isNaN(trimmed) ? trimmed : parseInt(trimmed);
        });
      } else {
        // Single parameter
        const num = parseInt(paramString.trim());
        return isNaN(num) ? [paramString.trim()] : [num];
      }
    } catch (error) {
      throw new Error('Invalid parameter format');
    }
  }

  generateTreeForAlgorithm(algorithmName, functionName, params) {
    switch (algorithmName.toLowerCase()) {
      case 'fibonacci':
        return this.generateFibonacciTree(functionName, params[0]);
      case 'factorial':
        return this.generateFactorialTree(functionName, params[0]);
      case 'binary search':
        return this.generateBinarySearchTree(functionName, params);
      case 'power function':
        return this.generatePowerTree(functionName, params[0], params[1]);
      case 'gcd (euclidean)':
        return this.generateGCDTree(functionName, params[0], params[1]);
      case 'sum array':
        return this.generateSumArrayTree(functionName, params[0]);
      default:
        return this.generateGenericTree(functionName, params);
    }
  }

  generateFibonacciTree(functionName, n, x = 400, y = 50) {
    if (n <= 1) {
      return {
        id: this.nodeId++,
        name: functionName,
        args: [n],
        result: n,
        x, y,
        state: 'baseCase',
        children: []
      };
    }

    const node = {
      id: this.nodeId++,
      name: functionName,
      args: [n],
      result: null,
      x, y,
      state: 'completed',
      children: []
    };

    // Generate children
    const leftChild = this.generateFibonacciTree(functionName, n - 1, x - 100, y + 100);
    const rightChild = this.generateFibonacciTree(functionName, n - 2, x + 100, y + 100);

    node.children = [leftChild, rightChild];
    node.result = leftChild.result + rightChild.result;

    return node;
  }

  generateFactorialTree(functionName, n, x = 400, y = 50) {
    if (n <= 1) {
      return {
        id: this.nodeId++,
        name: functionName,
        args: [n],
        result: 1,
        x, y,
        state: 'baseCase',
        children: []
      };
    }

    const child = this.generateFactorialTree(functionName, n - 1, x, y + 100);

    return {
      id: this.nodeId++,
      name: functionName,
      args: [n],
      result: n * child.result,
      x, y,
      state: 'completed',
      children: [child]
    };
  }

  generateBinarySearchTree(functionName, params) {
    const [arr, target] = params;
    return this.binarySearchRecursive(functionName, arr, target, 0, arr.length - 1, 400, 50);
  }

  binarySearchRecursive(functionName, arr, target, left, right, x, y) {
    if (left > right) {
      return {
        id: this.nodeId++,
        name: functionName,
        args: [arr, target, left, right],
        result: -1,
        x, y,
        state: 'baseCase',
        children: []
      };
    }

    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return {
        id: this.nodeId++,
        name: functionName,
        args: [arr, target, left, right],
        result: mid,
        x, y,
        state: 'baseCase',
        children: []
      };
    }

    let child;
    if (arr[mid] > target) {
      child = this.binarySearchRecursive(functionName, arr, target, left, mid - 1, x - 100, y + 100);
    } else {
      child = this.binarySearchRecursive(functionName, arr, target, mid + 1, right, x + 100, y + 100);
    }

    return {
      id: this.nodeId++,
      name: functionName,
      args: [arr, target, left, right],
      result: child.result,
      x, y,
      state: 'completed',
      children: [child]
    };
  }

  generatePowerTree(functionName, base, exp, x = 400, y = 50) {
    if (exp === 0) {
      return {
        id: this.nodeId++,
        name: functionName,
        args: [base, exp],
        result: 1,
        x, y,
        state: 'baseCase',
        children: []
      };
    }

    if (exp === 1) {
      return {
        id: this.nodeId++,
        name: functionName,
        args: [base, exp],
        result: base,
        x, y,
        state: 'baseCase',
        children: []
      };
    }

    if (exp % 2 === 0) {
      const halfChild = this.generatePowerTree(functionName, base, exp / 2, x, y + 100);
      return {
        id: this.nodeId++,
        name: functionName,
        args: [base, exp],
        result: halfChild.result * halfChild.result,
        x, y,
        state: 'completed',
        children: [halfChild]
      };
    } else {
      const child = this.generatePowerTree(functionName, base, exp - 1, x, y + 100);
      return {
        id: this.nodeId++,
        name: functionName,
        args: [base, exp],
        result: base * child.result,
        x, y,
        state: 'completed',
        children: [child]
      };
    }
  }

  generateGCDTree(functionName, a, b, x = 400, y = 50) {
    if (b === 0) {
      return {
        id: this.nodeId++,
        name: functionName,
        args: [a, b],
        result: a,
        x, y,
        state: 'baseCase',
        children: []
      };
    }

    const child = this.generateGCDTree(functionName, b, a % b, x, y + 100);

    return {
      id: this.nodeId++,
      name: functionName,
      args: [a, b],
      result: child.result,
      x, y,
      state: 'completed',
      children: [child]
    };
  }

  generateSumArrayTree(functionName, arr, index = 0, x = 400, y = 50) {
    if (index >= arr.length) {
      return {
        id: this.nodeId++,
        name: functionName,
        args: [arr, index],
        result: 0,
        x, y,
        state: 'baseCase',
        children: []
      };
    }

    const child = this.generateSumArrayTree(functionName, arr, index + 1, x, y + 100);

    return {
      id: this.nodeId++,
      name: functionName,
      args: [arr, index],
      result: arr[index] + child.result,
      x, y,
      state: 'completed',
      children: [child]
    };
  }

  generateGenericTree(functionName, params) {
    // Simple tree for unknown algorithms
    return {
      id: this.nodeId++,
      name: functionName,
      args: params,
      result: 'result',
      x: 400,
      y: 50,
      state: 'completed',
      children: []
    };
  }

  generateExecutionSteps(treeData) {
    const steps = [];
    const nodes = this.getAllNodesInOrder(treeData);

    nodes.forEach((node, index) => {
      steps.push({
        step: index,
        activeNode: node.id,
        callStack: this.generateCallStackForStep(node, index),
        description: `Calling ${node.name}(${node.args.join(', ')})`
      });
    });

    return steps;
  }

  getAllNodesInOrder(node, result = []) {
    result.push(node);
    if (node.children) {
      node.children.forEach(child => this.getAllNodesInOrder(child, result));
    }
    return result;
  }

  generateCallStackForStep(node, depth) {
    const stack = [];
    for (let i = depth; i >= 0; i--) {
      stack.push(`${node.name}(${node.args.join(', ')})`);
    }
    return stack;
  }

  calculateMaxDepth(node, depth = 0) {
    if (!node.children || node.children.length === 0) {
      return depth;
    }
    return Math.max(...node.children.map(child => this.calculateMaxDepth(child, depth + 1)));
  }

  calculateStatistics(treeData) {
    const totalCalls = this.countNodes(treeData);
    const baseCaseCalls = this.countBaseCases(treeData);
    const executionTime = Math.floor(Math.random() * 100) + 10; // Simulated

    return {
      totalCalls,
      baseCaseCalls,
      executionTime
    };
  }

  countNodes(node) {
    if (!node.children || node.children.length === 0) {
      return 1;
    }
    return 1 + node.children.reduce((sum, child) => sum + this.countNodes(child), 0);
  }

  countBaseCases(node) {
    if (!node.children || node.children.length === 0) {
      return 1;
    }
    return node.children.reduce((sum, child) => sum + this.countBaseCases(child), 0);
  }
}

export const executionSimulator = new ExecutionSimulator();
