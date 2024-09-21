document.addEventListener("DOMContentLoaded", function () {
    const openChatBtn = document.getElementById('openChatBtn');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatContainer = document.getElementById('chatContainer');
    const chatInput = document.getElementById('chatInput');
    const messages = document.getElementById('messages');

    openChatBtn.addEventListener('click', () => {
        chatContainer.style.display = "block";
    });

    closeChatBtn.addEventListener('click', () => {
        chatContainer.style.display = "none";
    });

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

    const sendMessage = () => {
        const message = chatInput.value;
        if (message) {
            // Sanitize the user's message
            const sanitizedMessage = sanitizeMessage(message);

            // Display the user's message
            messages.innerHTML += `<div><strong>You:</strong> ${sanitizedMessage}</div>`;
            
            // Clear the input
            chatInput.value = '';

            // Send GET request with the sanitized message
            const url = `https://selmai.pythonanywhere.com/?chat=${encodeURIComponent(message)}`;
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    // Extract the 'generated_text' field from the JSON response
                    const serverMessage = data.generated_text || 'No response';

                    // Sanitize the server's response
                    const sanitizedResponse = sanitizeMessage(serverMessage);

                    // Display the server's response
                    messages.innerHTML += `<div><strong>Selm:</strong> ${sanitizedResponse}</div>`;
                })
                .catch(error => {
                    console.error('Error:', error);
                    messages.innerHTML += `<div><strong>Error:</strong> Unable to send message</div>`;
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
