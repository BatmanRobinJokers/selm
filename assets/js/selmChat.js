document.addEventListener("DOMContentLoaded", function () {
    const openChatBtn = document.getElementById('openChatBtn');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatContainer = document.getElementById('chatContainer');
    const chatInput = document.getElementById('chatInput');
    const messages = document.getElementById('messages');

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

        // Fetch and display the last 10 lines of the chat log
        fetchChatLog();

        // Start polling for new messages if in public mode
        if (mode === "public") {
            pollForNewMessages();
        }
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
                .then(response => response.text())  // Expect the response as text
                .then(data => {
                    // Append the server's response to the chat log
                    messages.innerHTML += `<div>${sanitizeMessage(data)}</div>`;
                    scrollToBottom();
                })
                .catch(error => {
                    console.error('Error:', error);
                    const errorMessage = 'Unable to send message';
                    messages.innerHTML += `<div><strong>Error:</strong> ${errorMessage}</div>`;
                    scrollToBottom();
                });
        }
    };

    // Function to fetch the chat log
    const fetchChatLog = () => {
        const logUrl = `https://selmai.pythonanywhere.com/?public_poll`;

        fetch(logUrl)
            .then(response => response.json())
            .then(data => {
                // Display the last 10 messages from the chat log
                const lastMessages = data.slice(-10);
                messages.innerHTML = '';  // Clear the chatbox
                lastMessages.forEach(entry => {
                    messages.innerHTML += `<div>${sanitizeMessage(entry.message)}</div>`;
                });
                scrollToBottom();  // Scroll to the bottom after displaying messages
            })
            .catch(error => {
                console.error('Error fetching chat log:', error);
            });
    };

    // Polling function to check for new messages (Only for public chat)
    const pollForNewMessages = () => {
        if (mode === "public") {
            const pollUrl = `https://selmai.pythonanywhere.com/?public_poll`;

            fetch(pollUrl)
                .then(response => response.json())
                .then(data => {
                    // Extract the new messages
                    data.forEach(entry => {
                        const sanitizedMessage = sanitizeMessage(entry.message);
                        messages.innerHTML += `<div>${sanitizedMessage}</div>`;
                    });
                    scrollToBottom();  // Scroll to the bottom after appending new messages
                })
                .catch(error => {
                    console.error('Polling error:', error);
                });
        }
    };

    // Set interval for polling every 5 seconds for public chat
    setInterval(pollForNewMessages, 5000);

    // Add event listener to the send button
    document.getElementById('sendMessage').addEventListener('click', sendMessage);

    // Add 'Enter' key functionality for sending messages
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
