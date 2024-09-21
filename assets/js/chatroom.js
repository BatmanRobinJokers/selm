document.addEventListener("DOMContentLoaded", function () {
    const openChatBtn = document.getElementById('openChatBtn');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatContainer = document.getElementById('chatContainer');
    const chatInput = document.getElementById('chatInput');
    const messages = document.getElementById('messages');

    const openChat = () => {
        chatContainer.style.display = "block"; // Show the chat container
        setTimeout(() => { // Use a timeout to allow display to take effect
            chatContainer.style.opacity = "1"; // Fade in
            chatContainer.style.height = "auto"; // Allow natural height
        }, 10);
    };

    const closeChat = () => {
        chatContainer.style.opacity = "0"; // Fade out
        setTimeout(() => {
            chatContainer.style.display = "none"; // Hide after fade out
        }, 500); // Match the timeout with CSS transition duration
    };

    openChatBtn.addEventListener('click', openChat);
    closeChatBtn.addEventListener('click', closeChat);

    // Function to sanitize and format message
    const sanitizeMessage = (message) => {
        // Escape HTML special characters
        const escapedMessage = message
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        
        // Replace newlines with <br> tags for HTML display
        return escapedMessage.replace(/\n/g, '<br>');
    };

    // Function to scroll chatbox to the bottom
    const scrollToBottom = () => {
        messages.scrollTop = messages.scrollHeight;
    };

    const sendMessage = () => {
        const message = chatInput.value;
        if (message) {
            // Sanitize the user's message
            const sanitizedMessage = sanitizeMessage(message);

            // Display the user's message
            messages.innerHTML += `<div><strong>You:</strong> ${sanitizedMessage}</div>`;
            
            // Clear the input
            chatInput.value = '';

            // Scroll to the bottom
            scrollToBottom();

            // Send GET request with the message
            const url = `https://selmai.pythonanywhere.com/?chat=${encodeURIComponent(message)}`;
            
            fetch(url)
                .then(response => response.text())  // Expect the response as text
                .then(data => {
                    // Parse the data to extract 'generated_text' from JSON
                    let jsonResponse;
                    try {
                        jsonResponse = JSON.parse(data);
                    } catch (e) {
                        console.error('Invalid JSON:', e);
                    }

                    // Extract 'generated_text' if it's available
                    const serverMessage = jsonResponse?.[0]?.generated_text || 'No response';

                    // Sanitize the server's response
                    const sanitizedResponse = sanitizeMessage(serverMessage);

                    // Display the server's response
                    messages.innerHTML += `<div><strong>Selm:</strong> ${sanitizedResponse}</div>`;
                    
                    // Scroll to the bottom
                    scrollToBottom();
                })
                .catch(error => {
                    console.error('Error:', error);
                    messages.innerHTML += `<div><strong>Error:</strong> Unable to send message</div>`;
                    scrollToBottom();
                });
        }
    };

    document.getElementById('sendMessage').addEventListener('click', sendMessage);

    // Add 'Enter' key functionality
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
