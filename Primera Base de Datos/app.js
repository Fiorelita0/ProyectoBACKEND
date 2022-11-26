const { servidor } = require('./servidor.js');

const server = servidor.listen(8080, () => {
    console.log(`conectado y escuchando en puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))