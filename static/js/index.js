export function initUI() {
    const viewModeButton = document.getElementById('view-mode-button');
    const switchChatButton = document.getElementById('switch-chat-button');

    // Toggle dark/light mode
    viewModeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        viewModeButton.innerText = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
    });

    // Switch between chat modes
    switchChatButton.addEventListener('click', () => {
        // Logic for switching chat modes
        // For now, just log the action to the console
        console.log('Switched chat modes');
    });
}

export function initChat() {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-message-button');
    const fileUploadButton = document.getElementById('file-upload-button');
    const fileInput = document.getElementById('file-input');
    const downloadButton = document.getElementById('download-chat-button');
    const copyButton = document.getElementById('copy-chat-button');

    // Function to send the message
    function sendMessage() {
        const message = messageInput.value.trim(); // Get trimmed message

        if (message) {
            // Append message to chat
            appendMessage('User', message);
            messageInput.value = ''; // Clear the input after sending
        }
    }

    // Function to append messages to the chat window
    function appendMessage(sender, message) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.innerText = `${sender}: ${message}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to bottom
    }

    // Event listener for sending message on button click
    sendButton.addEventListener('click', sendMessage);

    // Event listener for sending message on Enter key press
    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage(); // Call sendMessage when Enter is pressed
            event.preventDefault(); // Prevent default behavior of the Enter key
        }
    });

    // Handle file upload
    fileUploadButton.addEventListener('click', () => {
        fileInput.click(); // Trigger file input when button is clicked
    });

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            appendMessage('User', `Uploaded file: ${file.name}`);
            // Here you can implement further logic to handle the file, e.g., upload to server
        }
    });

    // Download chat conversation
    downloadButton.addEventListener('click', () => {
        const chatMessages = document.getElementById('chat-messages').innerText;
        const blob = new Blob([chatMessages], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chat_conversation.txt';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Copy chat to clipboard
    copyButton.addEventListener('click', () => {
        const chatMessages = document.getElementById('chat-messages').innerText;
        navigator.clipboard.writeText(chatMessages).then(() => {
            alert('Chat conversation copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });
}

// Initialize UI and Chat
initUI();
initChat();
