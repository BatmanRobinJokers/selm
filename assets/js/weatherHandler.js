// weatherHandler.js

import { getGeolocation, sanitizeMessage, scrollToBottom } from './utils.js';

export const handleWeatherCommand = (message, url, messages, conversationHistory, mode, spinner) => {
    return getGeolocation()
        .then(({ latitude, longitude }) => {
            const geoMessage = `weather ${latitude} ${longitude}`;
            return fetch(`${url}&query=${encodeURIComponent(geoMessage)}`);
        })
        .then(response => handleResponse(response, messages, conversationHistory, mode, spinner))
        .catch(error => handleError(error, messages, conversationHistory, mode, spinner));
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
