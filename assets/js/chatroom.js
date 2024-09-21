document.addEventListener("DOMContentLoaded", function () {
    const openChatBtn = document.getElementById('openChatBtn');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatContainer = document.getElementById('chatContainer');
    const chatInput = document.getElementById('chatInput');
    const messages = document.getElementById('messages');

    openChatBtn.addEventListener('click', () => {
        chatContainer.style.display = "block";
        pollMessages();  // Start polling when chat is opened
    });

    closeChatBtn.addEventListener('click', () => {
        chatContainer.style.display = "none";
    });

    document.getElementById('sendMessage').addEventListener('click', () => {
        const message = chatInput.value;
        if (message) {
            fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            }).then(response => response.json())
              .then(data => {
                  messages.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
                  chatInput.value = '';
              });
        }
    });

    // Function to poll for new messages
    function pollMessages() {
        fetch('/poll')
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('No new messages');
                }
            })
            .then(data => {
                data.messages.forEach(message => {
                    messages.innerHTML += `<div><strong>Server:</strong> ${message}</div>`;
                });
            })
            .catch(error => {
                console.error('Polling error:', error);
            })
            .finally(() => {
                setTimeout(pollMessages, 1000);  // Poll again after 1 second
            });
    }
});
