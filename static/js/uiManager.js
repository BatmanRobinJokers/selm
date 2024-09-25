// Handle UI-related functionality

export function initUI() {
    const viewModeButton = document.getElementById('view-mode-button');
    const chatMessagesContainer = document.getElementById('chat-messages');
    const fileUploadButton = document.getElementById('file-upload-button');
    const fileUploadInput = document.getElementById('file-upload-input');
    const sendMessageButton = document.getElementById('send-message-button');

    // Toggle light and dark mode
    viewModeButton.addEventListener('click', toggleViewMode);

    // Handle file upload interaction
    fileUploadButton.addEventListener('click', () => fileUploadInput.click());
    fileUploadInput.addEventListener('change', handleFileUpload);

    // Handle send message button click
    sendMessageButton.addEventListener('click', handleSendMessage);

    // Scroll chat to bottom after each message
    function scrollToBottom() {
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    function toggleViewMode() {
        document.body.classList.toggle('dark-mode');
        viewModeButton.innerText = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
    }

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            alert(`File "${file.name}" selected!`);
        }
    }

    function handleSendMessage() {
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        if (message) {
            // Append the message to the chat window
            appendMessage('You', message);
            messageInput.value = ''; // Clear the input box
        }
    }

    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatMessagesContainer.appendChild(messageElement);
        scrollToBottom(); // Scroll to bottom after appending
    }
}
