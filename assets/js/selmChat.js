document.addEventListener("DOMContentLoaded", function () {
    const chatInput = document.getElementById('chatInput');
    const messages = document.getElementById('messages');

    let mode = "selm"; // Default mode is 'selm'
    const conversationHistory = {
        session: [],
        lastMessage: '', // Track the last message in public chat
    };

    const sendMessage = () => {
        const message = chatInput.value.trim();

        if (message.toLowerCase() === 'get conversation') {
            displayConversation();
            chatInput.value = ''; // Clear input
            return;
        }

        if (message) {
            const sanitizedMessage = sanitizeMessage(message);
            messages.innerHTML += `<div>${sanitizedMessage}</div>`;
            conversationHistory.session.push({ sender: 'You', message });
            chatInput.value = ''; // Clear input
            scrollToBottom();

            const url = `https://selmai.pythonanywhere.com/?selm_chat=${encodeURIComponent(message)}`;
            fetch(url)
                .then(response => response.text())
                .then(data => {
                    if (data !== conversationHistory.lastMessage) {
                        conversationHistory.session.push({ sender: 'Selm', message: data });
                        messages.innerHTML += `<div>${sanitizeMessage(data)}</div>`;
                        conversationHistory.lastMessage = data;
                    }
                    scrollToBottom();
                })
                .catch(error => handleError(error));
        }
    };

    const handleError = (error) => {
        console.error('Error:', error);
        const errorMessage = 'Unable to send message';
        messages.innerHTML += `<div><strong>Error:</strong> ${errorMessage}</div>`;
        conversationHistory.session.push({ sender: 'System', message: errorMessage });
        scrollToBottom();
    };

    const sanitizeMessage = (message) => {
        return message
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/\n/g, '<br>');
    };

    const scrollToBottom = () => {
        messages.scrollTop = messages.scrollHeight;
    };

    // Add event listener to the send button
    document.getElementById('sendMessage').addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
