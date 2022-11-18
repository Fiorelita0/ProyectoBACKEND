const express = require('express');
const http = require('http');
const socketio = require('socket.io')
const { router } = require('./router.js')
const { confiSocket } = require("./confirmarSock.js")

const app = express();
const httpServer = new http.Server(app)
const io = new socketio.Server(httpServer)

app.set("view engine", "ejs");
app.use(express.static('public'))

app.use('/', router)

//error 404
app.use((req, res, next) => {
    res.status(404).send("Pagina no encontrada");
})
confiSocket(io);

module.exports = { servidor: httpServer }