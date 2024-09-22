body {
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background-color: #1c1c1e;
}

.chat-container {
    display: flex;
    flex-direction: column;
    width: 400px;
    height: 600px;
    background-color: #2c2c2e;
    border-radius: 8px;
    overflow: hidden;
}

.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #3a3a3c;
    color: white;
}

.chat-messages {
    flex: 1;
    padding: 20px;
    background-color: #3a3a3c;
    overflow-y: auto;
    color: white;
    font-size: 14px;
}

.input-container {
    display: flex;
    align-items: center;
    border-top: 1px solid #444;
    background-color: #2c2c2e;
    padding: 10px;
}

.input-box {
    flex-grow: 1;
    padding: 12px 40px 12px 50px; /* Adjusted padding for paperclip space */
    border-radius: 20px;
    border: none;
    outline: none;
    background-color: #1f1f21;
    color: white;
    font-size: 16px;
}

.input-box::placeholder {
    color: #6c6c6e;
}

.send-btn {
    border: 2px solid #ff00ff;
    background-color: transparent;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    margin-left: 10px;
    box-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff;
    transition: box-shadow 0.2s ease;
    outline: none;
}

.send-btn:hover {
    box-shadow: 0 0 15px #ff00ff, 0 0 30px #ff00ff, 0 0 40px #ff00ff;
}

.file-btn {
    color: white;
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 20px;
    position: absolute;
    left: 10px; /* Positioning of paperclip */
    top: 50%;
    transform: translateY(-50%);
}

.file-input {
    display: none;
}

.copy-btn {
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: #40e0d0; /* Neon turquoise */
    font-size: 20px;
    box-shadow: 0 0 10px #40e0d0; /* Glow effect */
}

.copy-btn:hover {
    box-shadow: 0 0 15px #40e0d0, 0 0 30px #40e0d0;
}

.copy-btn:active {
    transform: scale(0.95);
}
