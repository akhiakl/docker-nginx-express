const express = require('express');
const server = require('http');
const path = require('path');
const winston = require('winston');
const socketIO = require('socket.io');

const app = express();
const httpServer = server.createServer(app);
const io = socketIO(httpServer, {
  // transports: ['websocket', 'polling'],
  cors: {
    origin: '*',
  },
});
const redis = require('socket.io-redis');
io.adapter(redis({ host: 'redis', port: 6379 }));

app.get('/', (req, res) => {
  const environment = {
    title: 'Docker with Nginx and Express',
    node: process.env.NODE_ENV,
    instance: process.env.INSTANCE,
    port: process.env.PORT,
  };
  res.render('index', { environment });
});
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
io.on('connection', (socket) => {
  // eslint-disable-next-line no-console
  console.log('\n\nsocket', socket.id);
  socket.on('hello', (arg) => {
    console.log(arg); // world
  });
  socket.emit('hello', 'world');
});

httpServer.listen(process.env.PORT, () => {
  winston.info(`NODE_ENV: ${process.env.NODE_ENV}`);
  winston.info(`INSTANCE: ${process.env.INSTANCE}`);
  winston.info(`EXPRESS: ${process.env.PORT}`);
});
