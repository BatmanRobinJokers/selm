// Connect to Socket.IO server hosted on PythonAnywhere
const socket = io('https://selmai.pythonanywhere.com');

// Function to send message to server
function sendMessage(message) {
    socket.emit('chat_message', { message: message });
}

// Listen for incoming chat responses from server
socket.on('chat_response', function(data) {
    displayMessage(data.response);
});

// Listen for connection event
socket.on('connection', function(data) {
    console.log("Connected:", data);
});

// Display message in chat box
function displayMessage(message) {
    const chatBox = document.getElementById('chat-box');
    const messageElem = document.createElement('div');
    messageElem.classList.add('message');
    messageElem.textContent = message;
    chatBox.appendChild(messageElem);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message on button click
document.getElementById('sendButton').addEventListener('click', function() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    if (message.trim() !== '') {
        sendMessage(message);
        messageInput.value = '';
    }
});
