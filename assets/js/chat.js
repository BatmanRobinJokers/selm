// chat.js

export const toggleChatMode = (chatModeBtn, messages, conversationHistory) => {
    let mode = "selm";  // Default mode is 'selm'

    chatModeBtn.addEventListener('click', () => {
        // Clear the chat screen
        messages.innerHTML = '';
        
        // Toggle mode between "selm" and "public"
        mode = (mode === "selm") ? "public" : "selm";
        
        // Notify the user of the mode change
        messages.innerHTML += `<div><strong>System:</strong> Chat mode switched to ${mode}.</div>`;
        
        // Display the conversation history for the current mode
        conversationHistory[mode].forEach(entry => {
            messages.innerHTML += `<div>${sanitizeMessage(entry.message)}</div>`;
        });
        
        scrollToBottom(messages);
    });

    return mode;
};
