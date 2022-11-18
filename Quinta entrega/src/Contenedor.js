const fs = require('fs')
class Contenedor {
    constructor(ruta) {
        this.ruta = ruta
    }
    verificar(obj) {
        return Object.entries(obj).length !== 0;
    }

    async guardar(elemento) {
        this.array = await this.recuperar()
        if (this.verificar(elemento)) {
            this.array.push(elemento)
            const contenido = JSON.stringify(this.array, null, 4)
            await fs.promises.writeFile(this.ruta, contenido)
        }
    }

    async recuperar() {
        try {
            const contenido = await fs.promises.readFile(this.ruta, 'utf-8')
            this.array = JSON.parse(contenido)
            return this.array
        } catch {
            return []
        }
    }
}
module.exports = Contenedor
