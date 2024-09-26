// uiManager.js

export const initUI = () => {
    const viewModeButton = document.getElementById('view-mode-button');
    const chatMessagesContainer = document.getElementById('chat-messages');
    const fileUploadButton = document.getElementById('file-upload-button');
    const fileUploadInput = document.getElementById('file-upload-input');
    const sendMessageButton = document.getElementById('send-message-button');

    // Toggle between light and dark mode
    viewModeButton.addEventListener('click', toggleViewMode);

    // Trigger file input click when the upload button is pressed
    fileUploadButton.addEventListener('click', (event) => {
        event.preventDefault();
        fileUploadInput.click();
    });

    // Handle file upload when a file is selected
    fileUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            sendFileToServer(file); // Call the function to upload the file
        }
    });

    // Handle message sending functionality
    sendMessageButton.addEventListener('click', handleSendMessage);

    // Scroll to the bottom after each message is added to the chat
    function scrollToBottom() {
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    // Toggle light and dark mode
    function toggleViewMode() {
        document.body.classList.toggle('dark-mode');
        viewModeButton.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
    }

    // Append a message to the chat window
    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        messageElement.textContent = `${sender}: ${message}`;
        chatMessagesContainer.appendChild(messageElement);
        scrollToBottom();
    }

    // Handle sending the message
    function handleSendMessage() {
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        if (message) {
            appendMessage('You', message);
            sendMessage(message); // Call the sendMessage function
            messageInput.value = '';
        }
    }
};
