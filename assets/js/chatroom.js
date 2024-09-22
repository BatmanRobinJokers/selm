document.addEventListener("DOMContentLoaded", function() {
    const openChatBtn = document.getElementById("openChatBtn");
    const chatContainer = document.getElementById("chatContainer");
    const closeChatBtn = document.getElementById("closeChatBtn");
    const sendMessageBtn = document.getElementById("sendMessage");
    const chatInput = document.getElementById("chatInput");
    const messagesDiv = document.getElementById("messages");

    // Open chat container
    openChatBtn.addEventListener("click", () => {
        chatContainer.style.display = "block";
        chatInput.focus();
    });

    // Close chat container
    closeChatBtn.addEventListener("click", () => {
        chatContainer.style.display = "none";
    });

    // Send message on button click
    sendMessageBtn.addEventListener("click", sendMessage);

    // Send message on Enter key press
    chatInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Display user's message
            appendMessage("You: " + message);
            chatInput.value = ""; // Clear input field

            // Simulate sending the message to a backend (replace with actual API call)
            setTimeout(() => {
                // Simulated response from server
                const response = "Bot: " + message; // Here, replace with actual API response
                appendMessage(response);
            }, 1000);
        }
    }

    function appendMessage(message) {
        const messageElement = document.createElement("div");
        messageElement.textContent = message;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to the bottom
    }
});
