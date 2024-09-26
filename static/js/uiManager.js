// Function to handle file upload to the server
export const sendFileToServer = (file) => {
    console.log(`Uploading file: ${file.name}`);

    // Create FormData to send the file
    const formData = new FormData();
    formData.append('file', file);

    // Fetch request to handle file uploads
    fetch('/upload', {
        method: 'POST',
        body: formData, // Send the form data
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('File uploaded successfully:', data);
        // Handle the server response after successful upload
    })
    .catch(error => {
        console.error('Error uploading file:', error);
    });
};

// Function to initialize UI-related functionality
export function initUI() {
    const viewModeButton = document.getElementById('view-mode-button');
    const chatMessagesContainer = document.getElementById('chat-messages');
    const fileUploadButton = document.getElementById('file-upload-button');
    const fileUploadInput = document.getElementById('file-upload-input');
    const sendMessageButton = document.getElementById('send-message-button');

    // Toggle between light and dark mode
    viewModeButton.addEventListener('click', toggleViewMode);

    // Trigger file input click when the upload button is pressed
    fileUploadButton.addEventListener('click', () => fileUploadInput.click());

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
        viewModeButton.innerText = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
    }

    // Append a message to the chat window
    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatMessagesContainer.appendChild(messageElement);
        scrollToBottom(); // Scroll to the bottom after appending
    }

    // Handle sending the message
    function handleSendMessage() {
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        if (message) {
            appendMessage('You', message); // Add message to the chat window
            messageInput.value = ''; // Clear the input box after sending
        }
    }
}
