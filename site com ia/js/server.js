import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBwOdRBdL_5RoPEZ4hv31uK1N3RamdOfjw";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

let chatSession;

async function initializeChat() {
  chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          { text: "Oi, quero começar nossa conversa!" },
        ],
      },
    ],
  });

  const initialResponse = await chatSession.sendMessage("");
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

initializeChat();
