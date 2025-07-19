import React, { useState, useEffect } from 'react';
// Import the function itself, not its immediate invocation
import generateAIContent from './gemini_end';

function Ai_response() {
  // State to hold the AI response
  const [aiResponse, setAiResponse] = useState('');
  // State to manage loading status
  const [isLoading, setIsLoading] = useState(false);
  // State to manage potential errors
  const [error, setError] = useState(null);
  // State for the custom message box visibility
  const [showMessageBox, setShowMessageBox] = useState(false);

  // useEffect to call the async function when the component mounts
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true); // Set loading to true
      setError(null); // Clear any previous errors
      try {
        const response = await generateAIContent("what is 2+2");
        setAiResponse(response);
        setShowMessageBox(true); // Show the message box after content is fetched
      } catch (err) {
        setError(err); // Set the error state if something goes wrong
        setShowMessageBox(true); // Show message box even on error
      } finally {
        setIsLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchContent();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Custom Message Box Component
  const MessageBox = ({ message, onClose, isError }) => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
        <h2 className={`text-xl font-bold mb-4 ${isError ? 'text-red-600' : 'text-gray-800'}`}>
          {isError ? 'Error' : 'AI Response'}
        </h2>
        <p className="text-gray-700 mb-6 whitespace-pre-wrap">
          {message}
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans p-4">
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>
        {`
        body { font-family: 'Inter', sans-serif; }
        `}
      </style>

      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">AI Content Generator</h1>
        {isLoading && (
          <p className="text-blue-500">Loading AI response...</p>
        )}
        {!isLoading && !aiResponse && !error && (
          <p className="text-gray-600">No AI response yet. Please wait.</p>
        )}

        {/* Render the custom message box if showMessageBox is true */}
        {showMessageBox && (
          <MessageBox
            message={error ? error.message : aiResponse}
            onClose={() => setShowMessageBox(false)}
            isError={!!error}
          />
        )}
      </div>
    </div>
  );
}

export default Ai_response;