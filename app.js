document.addEventListener('DOMContentLoaded', () => {
    const socket = io('https://selmai.pythonanywhere.com');  // Use your PythonAnywhere URL

    // Handle connection event
    socket.on('connect', () => {
        console.log('Connected to server!');
    });

    // Function to send chat messages
    const sendMessage = () => {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value;
        
        if (message.trim()) {
            // Emit the chat message to the backend
            socket.emit('chat_message', { message: message });
            
            // Clear the input field after sending
            messageInput.value = '';
        }
    };

    // Listen for send button click
    const sendButton = document.getElementById('sendButton');
    sendButton.addEventListener('click', sendMessage);

    // Allow pressing Enter to send the message
    document.getElementById('messageInput').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // Handle chat response from the backend
    socket.on('chat_response', (data) => {
        const chatBox = document.getElementById('chat-box');
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.textContent = data.response;
        chatBox.appendChild(messageElement);

        // Auto-scroll to the bottom of the chat box
        chatBox.scrollTop = chatBox.scrollHeight;
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });
});
