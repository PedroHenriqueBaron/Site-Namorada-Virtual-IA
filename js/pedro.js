async function StartChat() {
  

  const menssagem=document.getElementById("user-input");
  const initialResponse = await chatSession.sendMessage(menssagem);
  displayMessage(initialResponse.response.text(), "model");
}

function displayMessage(message, role) {
  const chatLog = document.getElementById("chat-log");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.classList.add(role === "user" ? "user" : "model");
  messageElement.textContent = message;
  chatLog.appendChild(messageElement);
  chatLog.scrollTop = chatLog.scrollHeight;
}

async function sendMessage() {
  const userInput = document.getElementById("user-input").value;
  if (!userInput) return;

  displayMessage(userInput, "user");
  document.getElementById("user-input").value = "";

  const response = await chatSession.sendMessage(userInput);
  displayMessage(response.response.text(), "model");
}

document.getElementById("send-button").addEventListener("click", sendMessage);

StartChat();

