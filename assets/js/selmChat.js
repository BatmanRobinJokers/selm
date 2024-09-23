document.addEventListener("DOMContentLoaded", function () {
    const openChatBtn = document.getElementById('openChatBtn');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatContainer = document.getElementById('chatContainer');
    const chatInput = document.getElementById('chatInput');
    const messages = document.getElementById('messages');

    // Initialize mode
    let mode = "selm";  // Default mode is 'selm'

    // Open chat on button click
    openChatBtn.addEventListener('click', () => {
        chatContainer.style.display = "block";
        fetchChatLog(); // Fetch initial chat log when opening the chat
    });

    // Toggle mode and clear chat on close button click
    closeChatBtn.addEventListener('click', () => {
        messages.innerHTML = ''; // Clear the chat screen
        mode = (mode === "selm") ? "public" : "selm"; // Toggle mode
        messages.innerHTML += `<div><strong>System:</strong> Chat mode switched to ${mode}.</div>`;
        fetchChatLog(); // Fetch chat log based on the new mode
        if (mode === "public") {
            pollForNewMessages(); // Start polling for new messages in public mode
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

        if (message.toLowerCase() === 'get conversation') {
            displayConversation();  // Display the entire conversation
            chatInput.value = '';   // Clear the input box
            return;  // Do not send anything to the server
        }

        if (message) {
            const sanitizedMessage = sanitizeMessage(message);
            chatInput.value = ''; // Clear the input

            // Decide server endpoint based on mode
            let url = mode === "selm"
                ? `https://selmai.pythonanywhere.com/?selm_chat=${encodeURIComponent(message)}`
                : `https://selmai.pythonanywhere.com/?public_chat=${encodeURIComponent(message)}`;

            // Send GET request with the message
            fetch(url)
                .then(response => response.text())  // Expect the response as text
                .then(data => {
                    messages.innerHTML += `<div>${sanitizeMessage(data)}</div>`;
                    scrollToBottom();
                })
                .catch(error => {
                    console.error('Error:', error);
                    messages.innerHTML += `<div><strong>Error:</strong> Unable to send message</div>`;
                    scrollToBottom();
                });
        }
    };

    // Function to fetch the chat log
    const fetchChatLog = () => {
        const logUrl = `https://selmai.pythonanywhere.com/?${mode}_poll`;

        fetch(logUrl)
            .then(response => response.json())
            .then(data => {
                messages.innerHTML = ''; // Clear the chatbox
                const lastMessages = data.slice(-10);
                lastMessages.forEach(entry => {
                    messages.innerHTML += `<div>${sanitizeMessage(entry.message)}</div>`;
                });
                scrollToBottom(); // Scroll to the bottom after displaying messages
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
                    data.forEach(entry => {
                        const sanitizedMessage = sanitizeMessage(entry.message);
                        messages.innerHTML += `<div>${sanitizedMessage}</div>`;
                    });
                    scrollToBottom();
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
