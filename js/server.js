const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Configuração do MongoDB
const uri = "mongodb+srv://pedrobarongoe:pe061007@baron.vinoqtq.mongodb.net/?retryWrites=true&w=majority&appName=Baron";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Criação do servidor Express
const app = express();
app.use(express.json()); // Para interpretar JSON no corpo das requisições

// Rota de teste de conexão com o MongoDB
app.get('/ping', async (req, res) => {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    res.status(200).json({ message: "Conexão com o MongoDB foi bem-sucedida!" });
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    res.status(500).json({ error: "Erro ao conectar ao MongoDB." });
  } finally {
    await client.close();
  }
});

// Rota para realizar operações no MongoDB
app.post('/data', async (req, res) => {
  const { database, collection, data } = req.body;

  if (!database || !collection || !data) {
    return res.status(400).json({ error: "Por favor, forneça 'database', 'collection' e 'data' no corpo da requisição." });
  }

  try {
    await client.connect();
    const db = client.db(database);
    const result = await db.collection(collection).insertOne(data);
    res.status(200).json({ message: "Dados inseridos com sucesso!", result });
  } catch (error) {
    console.error("Erro ao inserir dados no MongoDB:", error);
    res.status(500).json({ error: "Erro ao inserir dados no MongoDB." });
  } finally {
    await client.close();
  }
});

// Inicializar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
