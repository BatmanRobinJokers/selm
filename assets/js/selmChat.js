document.addEventListener("DOMContentLoaded", function () {
    const openChatBtn = document.getElementById('openChatBtn');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatContainer = document.getElementById('chatContainer');
    const chatInput = document.getElementById('chatInput');
    const messages = document.getElementById('messages');

    // Dictionary to store the conversation history
    const conversationHistory = {
        session: [],
    };

    // Initialize mode
    let mode = "selm";  // Default mode is 'selm'

    openChatBtn.addEventListener('click', () => {
        chatContainer.style.display = "block";
    });

    // Toggle mode and clear chat on close button click
    closeChatBtn.addEventListener('click', () => {
        // Clear the chat screen
        messages.innerHTML = '';

        // Toggle mode between "selm" and "public"
        if (mode === "selm") {
            mode = "public";
        } else {
            mode = "selm";
        }

        // Notify the user of the mode change
        messages.innerHTML += `<div><strong>System:</strong> Chat mode switched to ${mode}.</div>`;
    });

    // Function to sanitize and format message
    const sanitizeMessage = (message) => {
        const escapedMessage = message
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        
        return escapedMessage.replace(/\n/g, '<br>');
    };

    // Function to scroll chatbox to the bottom
    const scrollToBottom = () => {
        messages.scrollTop = messages.scrollHeight;
    };

    // Function to get the current timestamp
    const getCurrentTimestamp = () => {
        return new Date().toLocaleString();
    };

    // Function to display the entire conversation
    const displayConversation = () => {
        messages.innerHTML = '';  // Clear the chatbox
        conversationHistory.session.forEach((entry) => {
            const sanitizedMessage = sanitizeMessage(entry.message);
            messages.innerHTML += `<div><strong>${entry.sender}:</strong> ${sanitizedMessage} <em>(${entry.timestamp})</em></div>`;
        });
        scrollToBottom();  // Scroll to the bottom after displaying the conversation
    };

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

            // Display the user's message
            messages.innerHTML += `<div><strong>You:</strong> ${sanitizedMessage}</div>`;

            // Save the message to the conversation history
            conversationHistory.session.push({
                sender: 'You',
                message: message,
                timestamp: getCurrentTimestamp(),
            });

            // Clear the input
            chatInput.value = '';

            // Scroll to the bottom
            scrollToBottom();

            // Decide server endpoint based on mode
            let url;
            if (mode === "selm") {
                url = `https://selmai.pythonanywhere.com/?selm_chat=${encodeURIComponent(message)}`;
            } else if (mode === "public") {
                url = `https://selmai.pythonanywhere.com/?public_chat=${encodeURIComponent(message)}`;
            }

            // Send GET request with the message
            fetch(url)
                .then(response => response.text())  // Expect the response as text
                .then(data => {
                    // Parse the data to extract 'generated_text' from JSON
                    let jsonResponse;
                    try {
                        jsonResponse = JSON.parse(data);
                    } catch (e) {
                        console.error('Invalid JSON:', e);
                    }

                    // Extract 'generated_text' if it's available
                    const serverMessage = jsonResponse?.[0]?.generated_text || 'No response';

                    // Sanitize the server's response
                    const sanitizedResponse = sanitizeMessage(serverMessage);

                    // Display the server's response
                    messages.innerHTML += `<div><strong>${mode === 'selm' ? 'Selm' : 'Public'}:</strong> ${sanitizedResponse}</div>`;

                    // Save the server's response to the conversation history
                    conversationHistory.session.push({
                        sender: mode === 'selm' ? 'Selm' : 'Public',
                        message: serverMessage,
                        timestamp: getCurrentTimestamp(),
                    });

                    // Scroll to the bottom
                    scrollToBottom();
                })
                .catch(error => {
                    console.error('Error:', error);
                    const errorMessage = 'Unable to send message';

                    messages.innerHTML += `<div><strong>Error:</strong> ${errorMessage}</div>`;

                    // Save the error to the conversation history
                    conversationHistory.session.push({
                        sender: 'System',
                        message: errorMessage,
                        timestamp: getCurrentTimestamp(),
                    });

                    scrollToBottom();
                });
        }
    };

    document.getElementById('sendMessage').addEventListener('click', sendMessage);

    // Add 'Enter' key functionality
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // Polling Function to check for new messages
    const pollForNewMessages = () => {
        let pollUrl;
        if (mode === "selm") {
            pollUrl = `https://selmai.pythonanywhere.com/?selm_poll`;
        } else if (mode === "public") {
            pollUrl = `https://selmai.pythonanywhere.com/?public_poll`;
        }

        fetch(pollUrl)
            .then(response => response.text())
            .then(data => {
                // Process the polled data
                let jsonResponse;
                try {
                    jsonResponse = JSON.parse(data);
                } catch (e) {
                    console.error('Invalid JSON:', e);
                }

                // Extract any new messages
                const newMessage = jsonResponse?.[0]?.generated_text || null;

                if (newMessage) {
                    const sanitizedMessage = sanitizeMessage(newMessage);
                    messages.innerHTML += `<div><strong>${mode === 'selm' ? 'Selm' : 'Public'}:</strong> ${sanitizedMessage}</div>`;

                    // Save the new message to conversation history
                    conversationHistory.session.push({
                        sender: mode === 'selm' ? 'Selm' : 'Public',
                        message: newMessage,
                        timestamp: getCurrentTimestamp(),
                    });

                    scrollToBottom();
                }
            })
            .catch(error => {
                console.error('Polling error:', error);
            });
    };

    // Set interval for polling every 5 seconds
    setInterval(pollForNewMessages, 5000);

    // Access conversation history when needed
    window.getConversationHistory = () => conversationHistory;
});
