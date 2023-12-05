const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Servir o arquivo HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// WebSocket - Tratar conexões
wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  // Tratar mensagens recebidas do cliente
  ws.on('message', (message) => {
    console.log(`Mensagem recebida: ${message}`);

    // Broadcasting para todos os clientes conectados
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Tratar fechamento da conexão
  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
