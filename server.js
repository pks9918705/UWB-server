const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST"]
  }
});

// Middleware to handle CORS
app.use(cors({
  origin: '*', // Allow requests from any origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

let distance = 30.764; // Initial distance value

io.on('connection', (socket) => {
  console.log('a user connected');

  // Send the initial distance to the connected client
  socket.emit('distanceUpdate', distance);

  // Handle distance increment
  socket.on('incrementDistance', () => {
    distance += 0.75;
    console.log('distance: ' + distance);
    io.emit('distanceUpdate', distance);
  });

  // Handle distance decrement
  socket.on('decrementDistance', () => {
    distance -= 0.56;
    console.log('distance: ' + distance);
    io.emit('distanceUpdate', distance);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
