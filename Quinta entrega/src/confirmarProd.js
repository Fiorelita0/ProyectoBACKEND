const Contenedor = require('./Contenedor.js')
const contProductos = new Contenedor('../productos.txt')

const idFunction = async () => {
    const productos = await contProductos.recuperar()
    if (productos.length != 0) {
        let arrayId = productos.map(item => item.id);
        let highId = Math.max(...arrayId);
        id = highId + 1;
    } else id = 1;
    return id
}

const confiSocketProducts = (io) => {
    io.on('connection', socket => {
        socket.emit('idProduct', idFunction());

        socket.on('addProduct', async producto => {
            console.log(producto);
            await contProductos.guardar(producto)
            const productos = await contProductos.recuperar()
            io.sockets.emit('showProducts', productos)
        })
    })
}

module.exports = { confiSocketProducts }