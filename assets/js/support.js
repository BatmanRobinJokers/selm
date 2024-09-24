// Function to print the message to the chatbox
function printToChatbox(message) {
    const messagesDiv = document.getElementById('messages');
    const newMessage = document.createElement('div');
    newMessage.textContent = message;
    messagesDiv.appendChild(newMessage);
    // Auto-scroll to the bottom of chat messages
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add event listener to the Support link
document.getElementById('supportLink').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default anchor behavior
    document.getElementById('chatContainer').style.display = 'block'; // Show chat container
    printToChatbox("I am the support system."); // Print support message
});
