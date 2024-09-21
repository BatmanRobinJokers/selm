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

    document.getElementById('sendMessage').addEventListener('click', () => {
        const message = chatInput.value;
        if (message) {
            // Display the user's message
            messages.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
            
            // Clear the input
            chatInput.value = '';

            // Send GET request with the message
            const url = `https://selmai.pythonanywhere.com/?type=chat&chat=${encodeURIComponent(message)}`;
            
            fetch(url)
                .then(response => response.text())
                .then(data => {
                    // Display the server's response
                    messages.innerHTML += `<div><strong>Selm:</strong> ${data}</div>`;
                })
                .catch(error => {
                    console.error('Error:', error);
                    messages.innerHTML += `<div><strong>Error:</strong> Unable to send message</div>`;
                });
        }
    });
});
