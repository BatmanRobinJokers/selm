document.addEventListener("DOMContentLoaded", function () {
    const chatModeBtn = document.getElementById('chatModeBtn');
    const chatContainer = document.getElementById('chatContainer');
    const chatInput = document.getElementById('chatInput');
    const messages = document.getElementById('messages');
    const spinner = document.getElementById('spinner');  // Spinner element

    // Dictionary to store the conversation history
    const conversationHistory = {
        selm: [],
        public: [],
        lastMessage: '',  // Track the last message in public chat to prevent duplication
    };

    // Initialize mode
    let mode = "selm";  // Default mode is 'selm'

    // Toggle mode and clear chat on chat mode button click
    chatModeBtn.addEventListener('click', () => {
        // Clear the chat screen
        messages.innerHTML = '';

        // Toggle mode between "selm" and "public"
        mode = (mode === "selm") ? "public" : "selm";

        // Notify the user of the mode change
        messages.innerHTML += <div><strong>System:</strong> Chat mode switched to ${mode}.</div>;

        // Display the conversation history for the current mode
        conversationHistory[mode].forEach(entry => {
            messages.innerHTML += <div>${sanitizeMessage(entry.message)}</div>;
        });

        scrollToBottom();  // Scroll to the bottom after mode switch
    });

    // Function to sanitize and format message
    const sanitizeMessage = (message) => {
        return message
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/\n/g, '<br>');
    };

    // Function to get geolocation
    const getGeolocation = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    resolve({ latitude, longitude });
                }, () => {
                    reject('Geolocation not enabled');
                });
            } else {
                reject('Geolocation not supported');
            }
        });
    };

    // Function to send message
    const sendMessage = () => {
        const message = chatInput.value.trim();
    
        // Check if the command "get conversation" was entered
        if (message.toLowerCase() === 'get conversation') {
            displayConversation();  // Display the entire conversation
            chatInput.value = '';   // Clear the input box
            return;  // Do not send anything to the server
        }
    
        if (message) {
            // Save the message to the conversation history for the current mode
            conversationHistory[mode].push({
                sender: 'You',
                message: message,
            });
    
            // Clear the input
            chatInput.value = '';
    
            // Show the spinner while waiting for the server response
            spinner.style.display = 'block';
    
            // Decide server endpoint based on mode
            let url;
            if (mode === "selm") {
                url = https://selmai.pythonanywhere.com/?selm_chat=${encodeURIComponent(message)};
            } else if (mode === "public") {
                url = https://selmai.pythonanywhere.com/?public_chat=${encodeURIComponent(message)};
            }
    
            // Check if the message is "weather" and get geolocation
            if (message.toLowerCase().startsWith('weather')) {
                getGeolocation()
                    .then(({ latitude, longitude }) => {
                        // Include latitude and longitude in the message
                        const geoMessage = weather ${latitude} ${longitude};
                        url = https://selmai.pythonanywhere.com/?selm_chat=${encodeURIComponent(geoMessage)};
                        return fetch(url);
                    })
                    .then(response => response.json())  // Expect the response as JSON
                    .then(data => {
                        // Hide the spinner after receiving the response
                        spinner.style.display = 'none';
    
                        // Extract the "responses" field from the JSON response
                        const responseMessages = data.responses || [];
    
                        responseMessages.forEach(responseMessage => {
                            // Only append the server's response to the chat log if it's new
                            if (responseMessage !== conversationHistory.lastMessage) {
                                conversationHistory[mode].push({
                                    sender: mode === 'selm' ? 'Selm' : 'Public',
                                    message: responseMessage,
                                });
    
                                // Append the server's response to the chat log
                                messages.innerHTML += <div>${sanitizeMessage(responseMessage)}</div>;
    
                                // Update the last message for public mode
                                if (mode === 'public') {
                                    conversationHistory.lastMessage = responseMessage;
                                }
                            }
                        });
    
                        scrollToBottom();  // Scroll to the bottom after new messages
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        spinner.style.display = 'none';  // Hide spinner on error
                        const errorMessage = 'Unable to send message';
    
                        messages.innerHTML += <div><strong>Error:</strong> ${errorMessage}</div>;
    
                        // Save the error to the conversation history
                        conversationHistory[mode].push({
                            sender: 'System',
                            message: errorMessage,
                        });
    
                        scrollToBottom();  // Scroll to the bottom after an error
                    });
            } else {
                // Send GET request without geolocation
                fetch(url)
                    .then(response => response.json())  // Expect the response as JSON
                    .then(data => {
                        // Hide the spinner after receiving the response
                        spinner.style.display = 'none';
    
                        // Extract the "responses" field from the JSON response
                        const responseMessages = data.responses || [];
    
                        responseMessages.forEach(responseMessage => {
                            // Only append the server's response to the chat log if it's new
                            if (responseMessage !== conversationHistory.lastMessage) {
                                conversationHistory[mode].push({
                                    sender: mode === 'selm' ? 'Selm' : 'Public',
                                    message: responseMessage,
                                });
    
                                // Append the server's response to the chat log
                                messages.innerHTML += <div>${sanitizeMessage(responseMessage)}</div>;
    
                                // Update the last message for public mode
                                if (mode === 'public') {
                                    conversationHistory.lastMessage = responseMessage;
                                }
                            }
                        });
    
                        scrollToBottom();  // Scroll to the bottom after new messages
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        spinner.style.display = 'none';  // Hide spinner on error
                        const errorMessage = 'Unable to send message';
    
                        messages.innerHTML += <div><strong>Error:</strong> ${errorMessage}</div>;
    
                        // Save the error to the conversation history
                        conversationHistory[mode].push({
                            sender: 'System',
                            message: errorMessage,
                        });
    
                        scrollToBottom();  // Scroll to the bottom after an error
                    });
            }
        }
    };
    
    // Function to poll recent chat from the server
    const pollRecentChat = () => {
        fetch("https://selmai.pythonanywhere.com/?public_poll")
            .then(response => response.json())  // Expect the response as JSON
            .then(data => {
                // data is now an array of messages
                const recentMessages = data || [];
    
                recentMessages.forEach(message => {
                    // Ensure the message is not already in conversation history
                    if (!conversationHistory.public.some(entry => entry.message === message)) {
                        conversationHistory.public.push({ sender: 'Public', message });
                        messages.innerHTML += <div>${sanitizeMessage(message)}</div>;
                    }
                });

                scrollToBottom();  // Scroll to the bottom after new polled messages
            })
            .catch(error => {
                console.error('Error during polling:', error);
            });
    };

    // Function to scroll to the bottom of the chat box
    const scrollToBottom = () => {
        messages.scrollTop = messages.scrollHeight;
    };

    // Set polling interval for fetching recent chat every 5 seconds
    setInterval(pollRecentChat, 5000);

    // Add event listener to the send button
    document.getElementById('sendMessage').addEventListener('click', sendMessage);

    // Add 'Enter' key functionality for sending messages
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
