// Function to toggle light/dark mode
const toggleMode = () => {
    document.body.classList.toggle('dark-mode');
    const viewModeButton = document.getElementById('view-mode-button');
    viewModeButton.innerText = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
};

// Function to scroll chat messages to the bottom
const scrollToBottom = () => {
    const chatMessages = document.getElementById("chat-messages");
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
};

// Function to add a message to the chat
const addMessage = (message) => {
    const chatMessages = document.getElementById("chat-messages");
    const newMessage = document.createElement("div");
    newMessage.classList.add("chat-message"); // Add a class for styling
    newMessage.textContent = message; // Set message text
    chatMessages.appendChild(newMessage); // Add message to chat
    scrollToBottom(); // Scroll to bottom after adding a new message
};

// Function to initialize UI-related event listeners
export const initUI = () => {
    const viewModeButton = document.getElementById('view-mode-button');

    // Event listener for light/dark mode toggle
    viewModeButton.addEventListener('click', toggleMode);
    
    // Initialize message sending
    const sendMessageButton = document.getElementById('send-message-button');
    const messageInput = document.getElementById('message-input');

    // Send message on button click
    sendMessageButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            addMessage(message); // Add the message to chat
            messageInput.value = ''; // Clear input after sending
        }
    });

    // Send message on Enter key press
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = messageInput.value.trim();
            if (message) {
                addMessage(message); // Add the message to chat
                messageInput.value = ''; // Clear input after sending
            }
        }
    });
};
