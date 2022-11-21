const { servidor } = require('./servidor.js');
const PORT = process.env.PORT || 8080;
const server = servidor.listen(PORT, () => {
    console.log(`conectado y escuchando en puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))