document.addEventListener("DOMContentLoaded", function () {
    const chatModeBtn = document.getElementById('chatModeBtn');
    const chatContainer = document.getElementById('chatContainer');
    const chatInput = document.getElementById('chatInput');
    const messages = document.getElementById('messages');
    const spinner = document.getElementById('spinner');  // Spinner element
    const uploadFileBtn = document.getElementById('uploadFile'); // File upload button

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
        messages.innerHTML = '';  // Clear the chat screen
        mode = (mode === "selm") ? "public" : "selm";  // Toggle between modes
        messages.innerHTML += `<div><strong>System:</strong> Chat mode switched to ${mode}.</div>`;
        conversationHistory[mode].forEach(entry => {
            messages.innerHTML += `<div>${sanitizeMessage(entry.message)}</div>`;
        });
        scrollToBottom();  // Scroll after mode switch
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

    // File upload functionality
    uploadFileBtn.addEventListener('click', () => {
        // Create a hidden file input to trigger the file picker
        const fileInput = document.createElement('input');
        fileInput.type = 'file';

        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];  // Get the selected file

            if (file) {
                const formData = new FormData();
                formData.append('upload', file);  // Append the file to the form data

                // Send the file via POST to the server
                fetch('https://selmai.pythonanywhere.com/', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    console.log('File uploaded successfully:', data);
                    messages.innerHTML += `<div><strong>System:</strong> File uploaded successfully.</div>`;
                    scrollToBottom();  // Scroll after file upload
                })
                .catch(error => {
                    console.error('Error uploading file:', error);
                    messages.innerHTML += `<div><strong>Error:</strong> Failed to upload file.</div>`;
                    scrollToBottom();
                });
            }
        });

        // Trigger the file input click to open the file dialog
        fileInput.click();
    });

    // Function to send message
    const sendMessage = () => {
        const message = chatInput.value.trim();
    
        if (message.toLowerCase() === 'get conversation') {
            displayConversation();  // Display conversation
            chatInput.value = '';   // Clear input
            return;  // Do not send to server
        }
    
        if (message) {
            conversationHistory[mode].push({ sender: 'You', message });  // Save message
            chatInput.value = '';  // Clear input
            spinner.style.display = 'block';  // Show spinner

            let url;
            if (mode === "selm") {
                url = `https://selmai.pythonanywhere.com/?selm_chat=${encodeURIComponent(message)}`;
            } else if (mode === "public") {
                url = `https://selmai.pythonanywhere.com/?public_chat=${encodeURIComponent(message)}`;
            }

            if (message.toLowerCase().startsWith('weather')) {
                getGeolocation()
                    .then(({ latitude, longitude }) => {
                        const geoMessage = `weather ${latitude} ${longitude}`;
                        url = `https://selmai.pythonanywhere.com/?selm_chat=${encodeURIComponent(geoMessage)}`;
                        return fetch(url);
                    })
                    .then(response => response.json())
                    .then(data => {
                        spinner.style.display = 'none';  // Hide spinner
                        const responseMessages = data.responses || [];
                        responseMessages.forEach(responseMessage => {
                            if (responseMessage !== conversationHistory.lastMessage) {
                                conversationHistory[mode].push({
                                    sender: mode === 'selm' ? 'Selm' : 'Public',
                                    message: responseMessage,
                                });
                                messages.innerHTML += `<div>${sanitizeMessage(responseMessage)}</div>`;
                                if (mode === 'public') {
                                    conversationHistory.lastMessage = responseMessage;
                                }
                            }
                        });
                        scrollToBottom();
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        spinner.style.display = 'none';  // Hide spinner on error
                        messages.innerHTML += `<div><strong>Error:</strong> Unable to send message.</div>`;
                        conversationHistory[mode].push({ sender: 'System', message: 'Unable to send message' });
                        scrollToBottom();
                    });
            } else {
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        spinner.style.display = 'none';  // Hide spinner
                        const responseMessages = data.responses || [];
                        responseMessages.forEach(responseMessage => {
                            if (responseMessage !== conversationHistory.lastMessage) {
                                conversationHistory[mode].push({
                                    sender: mode === 'selm' ? 'Selm' : 'Public',
                                    message: responseMessage,
                                });
                                messages.innerHTML += `<div>${sanitizeMessage(responseMessage)}</div>`;
                                if (mode === 'public') {
                                    conversationHistory.lastMessage = responseMessage;
                                }
                            }
                        });
                        scrollToBottom();
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        spinner.style.display = 'none';  // Hide spinner on error
                        messages.innerHTML += `<div><strong>Error:</strong> Unable to send message.</div>`;
                        conversationHistory[mode].push({ sender: 'System', message: 'Unable to send message' });
                        scrollToBottom();
                    });
            }
        }
    };
    
    // Function to poll recent chat
    const pollRecentChat = () => {
        fetch("https://selmai.pythonanywhere.com/?public_poll")
            .then(response => response.json())
            .then(data => {
                const recentMessages = data || [];
                recentMessages.forEach(message => {
                    if (!conversationHistory.public.some(entry => entry.message === message)) {
                        conversationHistory.public.push({ sender: 'Public', message });
                        messages.innerHTML += `<div>${sanitizeMessage(message)}</div>`;
                    }
                });
                scrollToBottom();
            })
            .catch(error => console.error('Error during polling:', error));
    };

    const scrollToBottom = () => {
        messages.scrollTop = messages.scrollHeight;
    };

    setInterval(pollRecentChat, 5000);  // Poll chat every 5 seconds

    document.getElementById('sendMessage').addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
