document.getElementById("sendButton").addEventListener("click", function() {
    let message = document.getElementById("messageInput").value;
    fetch("https://selmai.pythonanywhere.com/process_chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("chatMessages").innerHTML += `<p>${data.response}</p>`;
        document.getElementById("messageInput").value = "";
    });
});
