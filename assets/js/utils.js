// utils.js

export const sanitizeMessage = (message) => {
    return message
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/\n/g, '<br>');
};

export const getGeolocation = () => {
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

export const scrollToBottom = (messages) => {
    messages.scrollTop = messages.scrollHeight;
};
