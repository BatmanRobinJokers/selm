// dataProcessor.js

import { sendMessage } from './index.js';

export const initDataProcessing = () => {
    const sendMessageButton = document.getElementById('send-message-button');
    const messageInput = document.getElementById('message-input');

    // Send message on button click
    sendMessageButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            sendMessage(message);
            messageInput.value = '';
        }
    });

    // Send message on pressing the Enter key
    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const message = messageInput.value.trim();
            if (message) {
                sendMessage(message);
                messageInput.value = '';
            }
        }
    });
};

// Function to send a message to the server
export const sendMessage = async (message) => {
    try {
        const response = await fetch('/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Message sent successfully:', data);
        // Handle the server's response here (e.g., update UI)
        appendMessage('Server', data.reply); // Assuming 'reply' is the field with the server's response
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
    }
};

// Function to handle file upload to the server
export const sendFileToServer = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log('File uploaded successfully:', data);
        alert('File uploaded successfully!');
        // Handle the server response after successful upload
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload file. Please try again.');
    }
};
