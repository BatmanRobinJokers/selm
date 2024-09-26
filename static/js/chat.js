export function initChat() {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-message-button');
    const fileUploadButton = document.getElementById('file-upload-button'); // Reference to the upload button
    const fileInput = document.getElementById('fileUpload'); // Reference to the hidden file input
    const copyChatButton = document.getElementById('copy-chat-button'); // Reference to the copy button

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

    // Function to copy chat messages to clipboard
    function copyChatToClipboard() {
        const chatMessages = document.getElementById('chat-messages');
        const chatText = Array.from(chatMessages.children)
            .map(messageDiv => messageDiv.innerText)
            .join('\n'); // Join messages with new lines

        navigator.clipboard.writeText(chatText).then(() => {
            console.log('Chat copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
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

    // Add event listener for the file upload button
    fileUploadButton.addEventListener('click', function() {
        fileInput.click(); // Open the file dialog when the button is clicked
    });

    // Add event listener for the copy button
    copyChatButton.addEventListener('click', copyChatToClipboard);
}
