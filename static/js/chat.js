export function initUI() {
    const viewModeButton = document.getElementById('view-mode-button');
    const switchChatButton = document.getElementById('switch-chat-button');
    const sendMessageButton = document.getElementById('send-message-button'); // Assuming you have this button in your HTML
    const messageInput = document.getElementById('message-input');
    const chatMessagesContainer = document.getElementById('chatMessages'); // Update to match your HTML id

    // Toggle dark/light mode
    viewModeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        viewModeButton.innerText = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
    });

    // Switch between chat modes
    switchChatButton.addEventListener('click', () => {
        console.log('Switched chat modes');
        // Logic for switching chat modes can go here
        chatMessagesContainer.innerHTML = ''; // Clear messages for demonstration
    });

    // Send message functionality
    sendMessageButton.addEventListener('click', () => {
        const messageText = messageInput.value.trim();
        if (messageText) {
            addMessageToChat('User', messageText);
            messageInput.value = ''; // Clear input box after sending
            // Simulate AI response for demonstration
            setTimeout(() => addMessageToChat('AI', 'This is a simulated response!'), 500);
        }
    });

    // Function to add a message to the chat
    function addMessageToChat(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message');

        const copyButton = document.createElement('button');
        copyButton.classList.add('copy-link-button');
        copyButton.innerHTML = '📋'; // Copy icon
        copyButton.addEventListener('click', () => copyToClipboard(text));

        const messageText = document.createElement('span');
        messageText.innerText = `${sender}: ${text}`;

        messageDiv.appendChild(copyButton);
        messageDiv.appendChild(messageText);
        chatMessagesContainer.appendChild(messageDiv);

        // Scroll to the bottom of the chat
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard: ' + text);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }
}

// Initialize the UI when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initUI);
