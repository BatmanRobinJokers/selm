document.addEventListener("DOMContentLoaded", function () {
    const chatModeBtn = document.getElementById('chatModeBtn');
    const chatContainer = document.getElementById('chatContainer');
    const chatInput = document.getElementById('chatInput');
    const messages = document.getElementById('messages');

    // Dictionary to store the conversation history
    const conversationHistory = {
        session: [],
        lastMessage: '',  // Track the last message in public chat to prevent duplication
    };

    // Initialize mode
    let mode = "selm";  // Default mode is 'selm'
    let firstMessageSent = true;  // Flag to indicate if the first message has been sent

    // Toggle mode and clear chat on chat mode button click
    chatModeBtn.addEventListener('click', () => {
        // Clear the chat screen
        messages.innerHTML = '';

        // Toggle mode between "selm" and "public"
        mode = (mode === "selm") ? "public" : "selm";

        // Notify the user of the mode change
        messages.innerHTML += `<div><strong>System:</strong> Chat mode switched to ${mode}.</div>`;
    });

    // Function to sanitize and format message
    const sanitizeMessage = (message) => {
        return message
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/\n/g, '<br>');
    };

    // Function to send message
    const sendMessage = () => {
        const message = chatInput.value.trim();

        // Check if the command "get conversation" was entered
        if (message.toLowerCase() === 'get conversation') {
            displayConversation();  // Display the entire conversation
            chatInput.value = '';   // Clear the input box
            return;  // Do not send anything to the server
        }

        if (message) {
            // Sanitize the user's message
            const sanitizedMessage = sanitizeMessage(message);

            // Append the user's message to the screen
            messages.innerHTML += `<div>${sanitizedMessage}</div>`;

            // Save the message to the conversation history
            conversationHistory.session.push({
                sender: 'You',
                message: message,
            });

            // Clear the input
            chatInput.value = '';

            // Decide server endpoint based on mode
            let url;
            if (mode === "selm") {
                url = `https://selmai.pythonanywhere.com/?selm_chat=${encodeURIComponent(message)}`;
            } else if (mode === "public") {
                url = `https://selmai.pythonanywhere.com/?public_chat=${encodeURIComponent(message)}`;
            }

            // Send GET request with the message
            fetch(url)
                .then(response => response.json())  // Expect the response as JSON
                .then(data => {
                    // Extract the response text
                    let responseText = data.generated_text || "";  // Adjust according to your JSON structure
                    let formattedText = responseText.split("\n").slice(1).join("\n").trim(); // Remove first line and join the rest

                    // Only append the server's response to the chat log if it's new
                    if (formattedText !== conversationHistory.lastMessage) {
                        conversationHistory.session.push({
                            sender: mode === 'selm' ? 'Selm' : 'Public',
                            message: formattedText,
                        });

                        // Append the server's response to the chat log
                        messages.innerHTML += `<div>${sanitizeMessage(formattedText)}</div>`;

                        // Update the last message for public mode
                        if (mode === 'public') {
                            conversationHistory.lastMessage = formattedText;
                        }
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    const errorMessage = 'Unable to send message';

                    messages.innerHTML += `<div><strong>Error:</strong> ${errorMessage}</div>`;

                    // Save the error to the conversation history
                    conversationHistory.session.push({
                        sender: 'System',
                        message: errorMessage,
                    });
                });
        }
    };

    // Add event listener to the send button
    document.getElementById('sendMessage').addEventListener('click', sendMessage);

    // Add 'Enter' key functionality for sending messages
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
