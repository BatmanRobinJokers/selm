// Function to send a message to the server
export const sendMessage = (message) => {
    console.log(`Sending message: ${message}`);

    // Replace this with the actual fetch request to your server
    fetch('/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Message sent successfully:', data);
        // Handle response (e.g., update UI with server's reply)
    })
    .catch(error => {
        console.error('Error sending message:', error);
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

    // Send message on Enter key press
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

// Placeholder function to handle file upload to server
export const sendFileToServer = (file) => {
    console.log(`Sending file: ${file.name}`);

    // Replace this with the actual fetch request to handle file uploads
    const formData = new FormData();
    formData.append('file', file);

    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('File uploaded successfully:', data);
        // Handle server response if needed
    })
    .catch(error => {
        console.error('Error uploading file:', error);
    });
};
