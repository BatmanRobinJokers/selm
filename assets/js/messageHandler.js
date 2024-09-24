// messageHandler.js
import { sanitizeMessage, scrollToBottom } from './assets/js/utils.js';
import { handleWeatherCommand } from './assets/js/weatherHandler.js';

export const sendMessage = (chatInput, messages, spinner, conversationHistory, mode) => {
    const message = chatInput.value.trim();

    if (message.toLowerCase() === 'get conversation') {
        displayConversation(messages);
        chatInput.value = '';
        return;
    }

    if (message) {
        conversationHistory[mode].push({ sender: 'You', message });
        chatInput.value = '';
        spinner.style.display = 'block';

        const url = (mode === "selm") 
            ? `https://selmai.pythonanywhere.com/?selm_chat=${encodeURIComponent(message)}`
            : `https://selmai.pythonanywhere.com/?public_chat=${encodeURIComponent(message)}`;

        if (message.toLowerCase().startsWith('weather')) {
            handleWeatherCommand(message, url, messages, conversationHistory, mode, spinner);
        } else {
            fetch(url)
                .then(response => handleResponse(response, messages, conversationHistory, mode, spinner))
                .catch(error => handleError(error, messages, conversationHistory, mode, spinner));
        }
    }
};

const handleResponse = (response, messages, conversationHistory, mode, spinner) => {
    spinner.style.display = 'none';
    return response.json().then(data => {
        const responseMessages = data.responses || [];
        responseMessages.forEach(responseMessage => {
            if (responseMessage !== conversationHistory.lastMessage) {
                conversationHistory[mode].push({ sender: mode === 'selm' ? 'Selm' : 'Public', message: responseMessage });
                messages.innerHTML += `<div>${sanitizeMessage(responseMessage)}</div>`;
                if (mode === 'public') conversationHistory.lastMessage = responseMessage;
            }
        });
        scrollToBottom(messages);
    });
};

const handleError = (error, messages, conversationHistory, mode, spinner) => {
    console.error('Error:', error);
    spinner.style.display = 'none';
    const errorMessage = 'Unable to send message';
    messages.innerHTML += `<div><strong>Error:</strong> ${errorMessage}</div>`;
    conversationHistory[mode].push({ sender: 'System', message: errorMessage });
    scrollToBottom(messages);
};
