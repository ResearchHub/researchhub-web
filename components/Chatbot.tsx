"use client";  // Ensures this runs only on the client side

import { useEffect } from "react";

export default function Chatbot() {
  useEffect(() => {
    // Ensure the script is loaded only once
    if (document.querySelector('script[src="https://dashboard.letmeexplain.ai/embed/lme_chatbot_widget.js"]')) {
      console.log("Chatbot script already loaded");
      return; // Exit if already loaded
    }

    // Create the script element
    const script = document.createElement('script');
    script.src = 'https://dashboard.letmeexplain.ai/embed/lme_chatbot_widget.js';
    script.async = true;
    script.onload = () => {
      let attempts = 0;

      // Function to load the chatbot widget
      function loadChatbot() {
        if (window.loadCustomWidget) {
          window.loadCustomWidget({
            orgId: '6b0e3ffe-838b-4d'  // Correct orgId here
          });
        } else if (attempts < 10) {
          attempts++;
          console.warn('Chatbot not ready. Retrying in 500ms...');
          setTimeout(loadChatbot, 500);
        } else {
          console.error('Failed to load chatbot after multiple attempts.');
        }
      }
      loadChatbot();
    };

    // Append the script to the document body
    document.body.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);  // Empty dependency array to run only once on mount

  return null; // This component does not render any UI
}
