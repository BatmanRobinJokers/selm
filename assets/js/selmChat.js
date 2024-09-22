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

    // Function to scroll chatbox to the bottom
    const scrollToBottom = () => {
        messages.scrollTop = messages.scrollHeight;
    };

    // Function to get the current timestamp
    const getCurrentTimestamp = () => {
        return new Date().toLocaleString();
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

            // Save the message to the conversation history
            conversationHistory.session.push({
                sender: 'You',
                message: message,
                timestamp: getCurrentTimestamp(),
            });

            // Clear the input
            chatInput.value = '';

            // If in public mode, append the message to the conversation log and display last 20 messages
            if (mode === "public") {
                displayLast20Messages();  // Display the last 20 messages
            }

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
                    // Save the server's response to the conversation history
                    conversationHistory.session.push({
                        sender: mode === 'selm' ? 'Selm' : 'Public',
                        message: data,
                        timestamp: getCurrentTimestamp(),
                    });

                    if (mode === "public") {
                        // Clear chat and display the last 20 messages in public mode
                        displayLast20Messages();
                    } else {
                        // Display the server's response in selm mode
                        messages.innerHTML += `<div><strong>Selm:</strong> ${sanitizeMessage(data)}</div>`;
                    }

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

    // Function to display the entire conversation
    const displayConversation = () => {
        messages.innerHTML = '';  // Clear the chatbox
        conversationHistory.session.forEach((entry) => {
            const sanitizedMessage = sanitizeMessage(entry.message);
            messages.innerHTML += `<div><strong>${entry.sender}:</strong> ${sanitizedMessage} <em>(${entry.timestamp})</em></div>`;
        });
        scrollToBottom();  // Scroll to the bottom after displaying the conversation
    };

    // Function to display the last 20 messages from conversation history
    const displayLast20Messages = () => {
        // Clear the chat screen
        messages.innerHTML = '';

        // Get the last 20 messages from the session history
        const last20Messages = conversationHistory.session.slice(-20);

        // Display each message
        last20Messages.forEach((entry) => {
            const sanitizedMessage = sanitizeMessage(entry.message);
            // Do not display "You:", "Public: Message saved to chat log", or "Current Chat Log:"
            if (entry.sender !== "You" && !sanitizedMessage.includes("Message saved to chat log") && !sanitizedMessage.includes("Current Chat Log:")) {
                messages.innerHTML += `<div><strong>${entry.sender}:</strong> ${sanitizedMessage} <em>(${entry.timestamp})</em></div>`;
            }
        });

        scrollToBottom();  // Scroll to the bottom after displaying messages
    };

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
                if (data) {
                    // Save the new message to conversation history
                    conversationHistory.session.push({
                        sender: mode === 'selm' ? 'Selm' : 'Public',
                        message: data,
                        timestamp: getCurrentTimestamp(),
                    });

                    if (mode === "public") {
                        displayLast20Messages();
                    } else {
                        messages.innerHTML += `<div><strong>Selm:</strong> ${sanitizeMessage(data)}</div>`;
                    }

                    scrollToBottom();
                }
            })
            .catch(error => {
                console.error('Polling error:', error);
            });
    };

    // Set interval for polling every 5 seconds
    setInterval(pollForNewMessages, 5000);
});
