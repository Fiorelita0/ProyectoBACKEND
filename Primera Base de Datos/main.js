const knex = require('knex')
const { getConfig } = require('./knex.js')

//Cliente Confi
//getConfig(CLIENT, DRIVER, USERNAME, PASSWORD, HOST, PORT, DB_NAME)
const MYSQL_KNEX_CONFIG = getConfig('mysql2','mysql2', 'root', 'fiorela2003', 'localhost', '3306', 'coderhouse')
const SQLITE3_KNEX_CONFIG = getConfig('sqlite3')

const knexCliMySQL = knex(MYSQL_KNEX_CONFIG)
const knexCliSQLite = knex(SQLITE3_KNEX_CONFIG)

const clienteSQL = require('./Contenedor.js')

const contenedorMensajes = new clienteSQL(knexCliSQLite)
const contendorProductos = new clienteSQL(knexCliMySQL)

//Verificar si la tabla existe
const existTableMsg = async () => {
    const existeTablaPersonas = await knexCliSQLite.schema.hasTable("mensajes")
    if (!existeTablaPersonas) {
        await knexCliSQLite.schema.createTable("mensajes", table => {
            table.increments('id'),
                table.string('userName'),
                table.string('msg'),
                table.string('date')
        })
    }
}
const existTableProd = async () => {
    const existeTablaProd = await knexCliMySQL.schema.hasTable("productos")
    if (!existeTablaProd) {
        await knexCliMySQL.schema.createTable("productos", table => {
            table.increments('id'),
                table.string('title'),
                table.integer('price'),
                table.string('thumbnail')
        })
    }
}

//confiSocket
existTableMsg()
existTableProd();

const confiSocket = (io) => {
    io.on('connection', socket => {
        //First Conexion
        socket.emit('conexion', 'conexion realizada')

        socket.on('mensaje', async mensaje => {

            await contenedorMensajes.guardar("mensajes", mensaje)
            const mensajes = await contenedorMensajes.buscar("mensajes")
            io.sockets.emit('mensajes', mensajes)
        })

        socket.on('getProducts', async () => {
            const productos = await contendorProductos.buscar('productos')
            io.sockets.emit('showProducts', productos)
        })

        socket.on('addProduct', async producto => {
            await contendorProductos.guardar('productos', producto)
            const productos = await contendorProductos.buscar('productos')
            io.sockets.emit('showProducts', productos)
        })
    })
}

module.exports = { confiSocket }