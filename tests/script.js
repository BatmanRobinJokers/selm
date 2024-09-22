document.getElementById('sendButton').addEventListener('click', function() {
    sendMessage();
});

document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('fileInput').addEventListener('change', function() {
    handleFileUpload();
});

function sendMessage() {
    const inputBox = document.getElementById('messageInput');
    const message = inputBox.value.trim();

    if (message !== '') {
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerText = message;

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // auto-scroll

        inputBox.value = ''; // clear the input box
    }
}

function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (file) {
        const chatMessages = document.getElementById('chatMessages');
        const fileElement = document.createElement('div');
        fileElement.classList.add('message');
        fileElement.innerText = `Uploaded file: ${file.name}`;

        chatMessages.appendChild(fileElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // auto-scroll
    }
}
