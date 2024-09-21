document.addEventListener("DOMContentLoaded", function () {
    // Chatroom functionality
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

    document.getElementById('sendMessage').addEventListener('click', () => {
        const message = chatInput.value;
        if (message) {
            messages.innerHTML += `<div>${message}</div>`;
            chatInput.value = '';
        }
    });
});
