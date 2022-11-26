class Contenedor {
    constructor(cliente) {
        this.knexCli = cliente
    }
    async guardar(tabla, cosas) {
        return await this.knexCli.insert(cosas).into(tabla)
    }
    async buscar(tabla) {
        return await this.knexCli.select("*").from(tabla)
    }    
}
module.exports = Contenedor