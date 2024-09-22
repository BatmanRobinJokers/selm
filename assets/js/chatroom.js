document.addEventListener("DOMContentLoaded", function () {
    const openChatBtn = document.getElementById('openChatBtn');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatContainer = document.getElementById('chatContainer');
    const chatInput = document.getElementById('chatInput');
    const messages = document.getElementById('messages');

    openChatBtn.addEventListener('click', () => {
        chatContainer.style.display = "block";
        chatInput.focus(); // Focus input when chat opens
    });

    closeChatBtn.addEventListener('click', () => {
        chatContainer.style.display = "none";
    });

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
        const message = chatInput.value.trim();
        if (message) {
            const sanitizedMessage = sanitizeMessage(message);
            messages.innerHTML += `<div><strong>You:</strong> ${sanitizedMessage}</div>`;
            chatInput.value = '';
            scrollToBottom();

            const url = `https://selmai.pythonanywhere.com/?chat=${encodeURIComponent(message)}`;
            fetch(url)
                .then(response => response.text())
                .then(data => {
                    let jsonResponse;
                    try {
                        jsonResponse = JSON.parse(data);
                    } catch (e) {
                        console.error('Invalid JSON:', e);
                    }

                    const serverMessage = jsonResponse?.[0]?.generated_text || 'No response';
                    const sanitizedResponse = sanitizeMessage(serverMessage);
                    messages.innerHTML += `<div><strong>Selm:</strong> ${sanitizedResponse}</div>`;
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
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
