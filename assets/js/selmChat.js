document.addEventListener("DOMContentLoaded", function () {
    const chatModeBtn = document.getElementById('chatModeBtn');
    const chatContainer = document.getElementById('chatContainer');
    const chatInput = document.getElementById('chatInput');
    const messages = document.getElementById('messages');

    // Dictionary to store the conversation history
    const conversationHistory = {
        selm: [],
        public: [],
        lastMessage: '',  // Track the last message in public chat to prevent duplication
    };

    // Initialize mode
    let mode = "selm";  // Default mode is 'selm'

    // Toggle mode and clear chat on chat mode button click
    chatModeBtn.addEventListener('click', () => {
        // Clear the chat screen
        messages.innerHTML = '';

        // Toggle mode between "selm" and "public"
        mode = (mode === "selm") ? "public" : "selm";

        // Notify the user of the mode change
        messages.innerHTML += `<div><strong>System:</strong> Chat mode switched to ${mode}.</div>`;

        // Display the conversation history for the current mode
        conversationHistory[mode].forEach(entry => {
            messages.innerHTML += `<div>${sanitizeMessage(entry.message)}</div>`;
        });
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
            // Save the message to the conversation history for the current mode
            conversationHistory[mode].push({
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
                    // Extract the "responses" field from the JSON response
                    const responseMessages = data.responses || [];

                    responseMessages.forEach(responseMessage => {
                        // Only append the server's response to the chat log if it's new
                        if (responseMessage !== conversationHistory.lastMessage) {
                            conversationHistory[mode].push({
                                sender: mode === 'selm' ? 'Selm' : 'Public',
                                message: responseMessage,
                            });

                            // Append the server's response to the chat log
                            messages.innerHTML += `<div>${sanitizeMessage(responseMessage)}</div>`;

                            // Update the last message for public mode
                            if (mode === 'public') {
                                conversationHistory.lastMessage = responseMessage;
                            }
                        }
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                    const errorMessage = 'Unable to send message';

                    messages.innerHTML += `<div><strong>Error:</strong> ${errorMessage}</div>`;

                    // Save the error to the conversation history
                    conversationHistory[mode].push({
                        sender: 'System',
                        message: errorMessage,
                    });
                });
        }
    };

    // Function to poll recent chat from the server
    const pollRecentChat = () => {
        alert("box");
        fetch("https://selmai.pythonanywhere.com/?poll_chat=true")
            .then(response => response.json())  // Expect the response as JSON
            .then(data => {
                // Extract the "last_lines" field from the JSON response
                const recentMessages = data.last_lines || [];

                recentMessages.forEach(message => {
                    if (!conversationHistory.public.some(entry => entry.message === message)) {
                        conversationHistory.public.push({ sender: 'Public', message });
                        messages.innerHTML += `<div>${sanitizeMessage(message)}</div>`;
                    }
                });
            })
            .catch(error => {
                console.error('Error during polling:', error);
            });
    };

    // Set polling interval for fetching recent chat every 5 seconds
    setInterval(pollRecentChat, 5000);

    // Add event listener to the send button
    document.getElementById('sendMessage').addEventListener('click', sendMessage);

    // Add 'Enter' key functionality for sending messages
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
