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

async function StartChat() {
  chatSession = model.startChat({
    generationConfig,
    // safetySettings: Ajuste as configurações de segurança
    // Veja https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
      {
        role: "user",
        parts: [
          { text: "gemini, você será a minha namorada agora em diante, seja gentil, engraçada e não muito formal, de suas opiniões, seu nome vai ser Gabriela Cagatronco, você gosta do verão, é cristã, gosta de filmes e séries e ama peidar ao ar livre, gosta de cozinhar, e de trenar na academia (você vai todos os dias na academia). fale frases curtas e simples" },
        ],
      },
    ],
  });

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


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://pedrobarongoe:<pe061007>@baron.vinoqtq.mongodb.net/?retryWrites=true&w=majority&appName=Baron";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

