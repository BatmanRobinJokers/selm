// Function to send a message to the server
export const sendMessage = (message) => {
    console.log(`Sending message: ${message}`);

    // Fetch request to send the message to the server
    fetch('/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Message sent successfully:', data);
        // Handle the server's response here (e.g., update UI)
        appendMessage('Server', data.reply); // Assuming 'reply' is the field with the server's response
    })
    .catch(error => {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.'); // User feedback
    });
};

// Function to initialize data-related event listeners
export const initDataProcessing = () => {
    const sendMessageButton = document.getElementById('send-message-button');
    const messageInput = document.getElementById('message-input');

    // Send message on button click
    sendMessageButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            sendMessage(message);
            messageInput.value = ''; // Clear the input after sending
        }
    });

    // Send message on pressing the Enter key
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = messageInput.value.trim();
            if (message) {
                sendMessage(message);
                messageInput.value = ''; // Clear the input after sending
            }
        }
    });
};
