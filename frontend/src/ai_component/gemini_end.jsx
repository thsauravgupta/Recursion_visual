import React from "react";

// Function to call the Gemini API
async function generateAIContent(prompt) {
  // Chat history for the API call
  let chatHistory = [];
  chatHistory.push({ role: "user", parts: [{ text: prompt }] });

  // Payload for the API request, using gemini-2.0-flash as specified
  const payload = { contents: chatHistory };

  // API key is left as an empty string; Canvas will automatically provide it at runtime.
  const apiKey = "AIzaSyDGYoZI6TNo6OsdQvHUksBRV1TlIoNP_TQ";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    // Make the fetch call to the Gemini API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${response.status} - ${errorData.error.message || 'Unknown error'}`);
    }

    const result = await response.json();

    // Extract the text from the response
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      return result.candidates[0].content.parts[0].text;
    } else {
      // Handle cases where the response structure is unexpected or content is missing
      throw new Error("Unexpected API response structure or no content found.");
    }
  } catch (error) {
    console.error("Error generating AI content:", error);
    // Re-throw the error so the calling component can handle it
    throw error;
  }
}

// Export the function itself, not its immediate invocation
export default generateAIContent;