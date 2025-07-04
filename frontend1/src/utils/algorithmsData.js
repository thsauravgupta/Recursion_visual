// Template algorithms for the visualizer
export const algorithmsData = [
  {
    name: "Fibonacci",
    code: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    params: "5",
    description: "Classic Fibonacci sequence with exponential time complexity"
  },
  {
    name: "Factorial",
    code: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`,
    params: "5",
    description: "Simple factorial calculation with linear time complexity"
  },
  {
    name: "Binary Search",
    code: `function binarySearch(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;
  const mid = Math.floor((left + right) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] > target) return binarySearch(arr, target, left, mid - 1);
  return binarySearch(arr, target, mid + 1, right);
}`,
    params: "[1,2,3,4,5,6,7,8,9,10], 7",
    description: "Efficient searching algorithm with logarithmic time complexity"
  },
  {
    name: "Power Function",
    code: `function power(base, exp) {
  if (exp === 0) return 1;
  if (exp === 1) return base;
  if (exp % 2 === 0) {
    const half = power(base, exp / 2);
    return half * half;
  }
  return base * power(base, exp - 1);
}`,
    params: "2, 10",
    description: "Optimized power calculation using divide and conquer"
  },
  {
    name: "GCD (Euclidean)",
    code: `function gcd(a, b) {
  if (b === 0) return a;
  return gcd(b, a % b);
}`,
    params: "48, 18",
    description: "Greatest Common Divisor using Euclidean algorithm"
  },
  {
    name: "Sum Array",
    code: `function sumArray(arr, index = 0) {
  if (index >= arr.length) return 0;
  return arr[index] + sumArray(arr, index + 1);
}`,
    params: "[1, 2, 3, 4, 5]",
    description: "Recursive array summation"
  }
];
