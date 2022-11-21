const express = require('express');
const http = require('http');
const { routerProductos, routerCarrito, routerSesion } = require('./routers.js')
const app = express();
const httpServer = new http.Server(app)

app.use('/api/sesion/', routerSesion)
app.use('/api/productos/', routerProductos)
app.use('/api/carrito/', routerCarrito)

//Error 404
app.all('*', (req, res) => {
    const text = `ruta ${req.originalUrl},metodo ${req.method} no implementada`
    res.status(404).json({ error: -2, descripcion: text })
})
module.exports = { servidor: httpServer }