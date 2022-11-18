const Contenedor = require('./Contenedor.js')
const contMensajes = new Contenedor('../mensajes.txt')

const contProductos = new Contenedor('../productos.txt')

const idFunction = async (producto) => {
    const productos = await contProductos.recuperar()
    if (productos.length != 0) {
        let arrayId = productos.map(item => item.id);
        let highId = Math.max(...arrayId);
        producto.id = highId + 1;
    } else producto.id = 0;
}


const confiSocket = (io) => {
    io.on('connection', socket => {
        socket.emit('conexion', 'conexion realizada')

        socket.on('mensaje', async mensaje => {
            await contMensajes.guardar(mensaje)
            const mensajes = await contMensajes.recuperar()
            io.sockets.emit('mensajes', mensajes)
        })

        socket.on('getProducts', async () => {
            const productos = await contProductos.recuperar()
            io.sockets.emit('showProducts', productos)
        })

        socket.on('addProduct', async producto => {
            await idFunction(producto)
            await contProductos.guardar(producto)
            const productos = await contProductos.recuperar()
            io.sockets.emit('showProducts', productos)
        })
    })
}

module.exports = { confiSocket }