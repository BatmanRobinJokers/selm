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

    openChatBtn.addEventListener('click', () => {
        chatContainer.style.display = "block";
    });

    closeChatBtn.addEventListener('click', () => {
        chatContainer.style.display = "none";
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

    const sendMessage = () => {
        const message = chatInput.value;
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

            // Send GET request with the message
            const url = `https://selmai.pythonanywhere.com/?chat=${encodeURIComponent(message)}`;
            
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
                    messages.innerHTML += `<div><strong>Selm:</strong> ${sanitizedResponse}</div>`;

                    // Save the server's response to the conversation history
                    conversationHistory.session.push({
                        sender: 'Selm',
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

    // Access conversation history when needed
    window.getConversationHistory = () => conversationHistory;
});
