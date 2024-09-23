document.addEventListener("DOMContentLoaded", function () {
    const closeChatBtn = document.getElementById('chatModeBtn');
    const chatContainer = document.getElementById('chatContainer');
    const chatInput = document.getElementById('chatInput');
    const messages = document.getElementById('messages');

    let mode = "selm"; // Default mode is 'selm'
    const conversationHistory = {
        session: [],
        lastMessage: '', // Track the last message in public chat
    };

    // Toggle mode and clear chat on close button click
    chatModeBtn.addEventListener('click', () => {
        messages.innerHTML = ''; // Clear the chat screen
        mode = (mode === "selm") ? "public" : "selm"; // Toggle mode
        messages.innerHTML += `<div><strong>System:</strong> Chat mode switched to ${mode}.</div>`;

        if (mode === "public") {
            pollForNewMessages();
        }
    });

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

    const displayLastMessages = (lastMessages) => {
        messages.innerHTML = ''; // Clear the chatbox
        lastMessages.forEach(entry => {
            messages.innerHTML += `<div>${sanitizeMessage(entry.message)}</div>`;
        });
        scrollToBottom();
    };

    const pollForNewMessages = () => {
        if (mode === "public") {
            const pollUrl = `https://selmai.pythonanywhere.com/?public_poll`;
            fetch(pollUrl)
                .then(response => response.json())
                .then(data => {
                    const lastMessages = data.slice(-20);
                    displayLastMessages(lastMessages);
                    if (lastMessages.length > 0) {
                        conversationHistory.lastMessage = lastMessages[lastMessages.length - 1].message;
                    }
                })
                .catch(error => console.error('Polling error:', error));
        }
    };

    setInterval(pollForNewMessages, 5000);
});
