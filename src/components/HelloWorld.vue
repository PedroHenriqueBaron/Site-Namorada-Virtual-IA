<template>
  <div class="chat-container">
    <!-- Cabeçalho do chat -->
    <div class="header">
      <div class="header-left">
        <img src="@/assets/2.png" alt="Foto de Perfil" class="profile-pic" />
        <div class="header-text">
          <span class="title">Namorada</span>
          <span class="status">online</span>
        </div>
      </div>
      <span class="menu-icon">⋮</span>
    </div>
    <!-- Área de mensagens -->
    <div class="chat-log" ref="chatLog">
      <div v-for="(msg, index) in messages" :key="index"
        :class="{ 'message': true, 'user': msg.role === 'user', 'model': msg.role === 'model' }">
        {{ msg.text }}
      </div>
    </div>
    <!-- Container de entrada de mensagem -->
    <div class="input-container">
      <input type="text" v-model="userInput" @keyup.enter="sendMessage" placeholder="Digite sua mensagem..." />
      <button @click="sendMessage">➤</button>
    </div>
  </div>
  <h3>Feito por: Pedro Henrique Baron Goettems</h3>
</template>

<script>
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';

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

export default {
  data() {
    return {
      userInput: "",
      messages: [],
      chatSession: null
    };
  },
  methods: {
    async fetchMessages() {
      try {
        const response = await axios.get('http://localhost:3000/messages');
        this.messages = response.data;
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    },
    async sendMessage() {
      if (!this.userInput.trim()) return;

      const newMessage = {
        text: this.userInput,
        role: 'user'
      };

      this.displayMessage(this.userInput, "user");


      try {
        // Save the user message
        await axios.post('http://localhost:3000/messages', newMessage);

        // Clear input field
        this.userInput = "";

        // Send message to model
        if (this.chatSession) {
          const response = await this.chatSession.sendMessage(newMessage.text);
          this.displayMessage(response.response.text(), "model");

          // Save model response
          await axios.post('http://localhost:3000/messages', { text: response.response.text(), role: 'model' });
        }
      } catch (error) {
        console.error('Failed to send message', error);
      }
    },
    displayMessage(message, role) {
      this.messages.push({ text: message, role });
      this.$nextTick(() => {
        const chatLog = this.$refs.chatLog;
        chatLog.scrollTop = chatLog.scrollHeight;
      });
    },
    async startChat() {
      this.chatSession = await model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [
              { text: "Gemini, você será minha namorada agora em diante. Seja gentil, engraçada e não muito formal. Diga suas opiniões. Seu nome vai ser Gabriela Cagatronco. Você gosta do verão, é cristã, gosta de filmes e séries, e ama estar ao ar livre. Gosta de cozinhar e treinar na academia (você vai todos os dias). Fale frases curtas e simples." },
            ],
          },
        ],
      });


      const initialResponse = await this.chatSession.sendMessage("Iniciar chat...");
      this.displayMessage(initialResponse.response.text(), "model");
    }
  },
  mounted() {
    this.startChat();
    this.fetchMessages();
  }
};
</script>

<style>
#titulo {
  text-align: center;
  font-size: 24px;
  color: #333;
  margin: 0;
  padding: 20px 0;
  /* Adiciona um espaçamento ao redor do título */
}

body {
  font-family: Arial, sans-serif;
  background-color: #e5ddd5;
  /* Cor de fundo semelhante ao WhatsApp */
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.chat-container {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  /* Sombra mais pronunciada */
  width: 400px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
}

/* Estilo do cabeçalho do chat */
.header {
  background-color: #25d366;
  /* Cor de fundo do cabeçalho do WhatsApp */
  color: white;
  padding: 10px 15px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* Sombra sutil no cabeçalho */
}

/* Container da foto de perfil e texto do cabeçalho */
.header-left {
  display: flex;
  align-items: center;
}

.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

/* Container do texto do cabeçalho */
.header-text {
  display: flex;
  flex-direction: column;
}

/* Estilo do título no cabeçalho */
.header .title {
  font-size: 18px;
  font-weight: bold;
}

/* Estilo do status no cabeçalho */
.header .status {
  font-size: 14px;
  color: #d3d3d3;
  /* Cor para o status */
}

/* Ícone de menu no cabeçalho */
.menu-icon {
  font-size: 22px;
  cursor: pointer;
}

/* Área de mensagens */
.chat-log {
  overflow-y: auto;
  max-height: 300px;
  padding: 15px;
  border-radius: 0 0 16px 16px;
  border: 1px solid #ddd;
  background-color: #fff;
}

/* Mensagens no chat */
.message {
  margin-bottom: 12px;
  padding: 10px 15px;
  border-radius: 20px;
  max-width: 80%;
  word-break: break-word;
  position: relative;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  /* Sombra suave para balões */
}

/* Mensagens enviadas pelo usuário */
.user {
  background-color: #dcf8c6;
  /* Cor de fundo das mensagens enviadas pelo usuário */
  align-self: flex-end;
  border-bottom-right-radius: 0;
  /* Cantos inferiores do balão de mensagem do usuário são retangulares */
}

/* Mensagens enviadas pela namorada virtual */
.model {
  background-color: #ffffff;
  /* Cor de fundo das mensagens enviadas pela namorada virtual */
  align-self: flex-start;
  border-bottom-left-radius: 0;
  /* Cantos inferiores do balão de mensagem da namorada virtual são retangulares */
}

/* Container do input de mensagem */
.input-container {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-top: 1px solid #ddd;
  background-color: #f9f9f9;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}

/* Campo de entrada de mensagem */
.input-container input[type=text] {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 16px;
  background-color: #fff;
  outline: none;
  /* Remove o contorno padrão do foco */
}

/* Estilo ao focar o campo de entrada */
.input-container input[type=text]:focus {
  border-color: #25d366;
  /* Cor da borda ao focar, semelhante ao WhatsApp */
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  /* Adiciona uma leve sombra ao focar */
}

/* Botão de envio de mensagem */
.input-container button {
  padding: 10px;
  background-color: #25d366;
  /* Cor do botão no estilo WhatsApp */
  color: #fff;
  border: none;
  border-radius: 50%;
  margin-left: 10px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  /* Transição suave na cor do botão */
}

/* Estilo do botão ao passar o mouse sobre */
.input-container button:hover {
  background-color: #1ebe50;
}

/* Estilo do botão quando pressionado */
.input-container button:active {
  background-color: #1aab44;
}
</style>