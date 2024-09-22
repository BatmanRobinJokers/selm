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
        const escapedMessage = message
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        return escapedMessage.replace(/\n/g, '<br>');
    };

    const scrollToBottom = () => {
        messages.scrollTop = messages.scrollHeight;
    };

    const sendMessage = () => {
        const message = chatInput.value;
        if (message) {
            const sanitizedMessage = sanitizeMessage(message);
            messages.innerHTML += `<div><strong>You:</strong> ${sanitizedMessage}</div>`;
            chatInput.value = '';
            scrollToBottom();

            const url = `https://selmai.pythonanywhere.com/?chat=${encodeURIComponent(message)}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const botResponse = sanitizeMessage(data.response);
                    messages.innerHTML += `<div><strong>Bot:</strong> ${botResponse}</div>`;
                    scrollToBottom();
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    };

    document.getElementById('sendMessage').addEventListener('click', sendMessage);

    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
