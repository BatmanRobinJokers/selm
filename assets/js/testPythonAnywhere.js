document.addEventListener("DOMContentLoaded", function () {
    const chatWindow = document.getElementById('messages');
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessage');

    // Function to send a GET request to the PythonAnywhere server
    const sendRequest = async (message) => {
        try {
            const response = await fetch(`https://selmai.pythonanywhere.com?message=${encodeURIComponent(message)}`, {
                method: 'GET',
            });
            const data = await response.text(); // assuming response is plain text
            displayMessage(data); // Display response in the chat window
        } catch (error) {
            console.error('Error:', error);
            displayMessage("Error: Could not contact the server.");
        }
    };

    // Function to display messages in the chat window
    const displayMessage = (message) => {
        chatWindow.innerHTML += `<div>${message}</div>`;
    };

    // Handle sending the message when the button is clicked
    sendMessageBtn.addEventListener('click', () => {
        const message = chatInput.value;
        if (message) {
            displayMessage(`You: ${message}`);
            sendRequest(message); // Send message as a GET request to the server
            chatInput.value = ''; // Clear input field
        }
    });
});
