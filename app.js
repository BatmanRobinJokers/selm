<script src="https://cdn.socket.io/4.0.0/socket.io.min.js"></script>
<script>
  // Connect to the backend via Socket.IO
  const socket = io('https://selmai.pythonanywhere.com');  // Update this to match your backend URL

  // Handle connection event
  socket.on('connect', () => {
    console.log('Connected to server!');
  });

  // Send chat message
  function sendMessage(message) {
    socket.emit('chat_message', { message: message });
  }

  // Handle chat response
  socket.on('chat_response', (data) => {
    console.log('Received response: ', data.response);
  });
</script>
