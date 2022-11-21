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

            if (this.array.length != 0) {
                let arrayId = this.array.map(item => item.id);
                let highId = Math.max(...arrayId);
                elemento.id = highId + 1;
            } else elemento.id = 0;

            this.array.push(elemento)
            const contenido = JSON.stringify(this.array, null, 4)
            await fs.promises.writeFile(this.ruta, contenido)
        }
        return elemento
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
    async recuperarId(id) {
        try {
            const contenido = await fs.promises.readFile(this.ruta, 'utf-8')
            this.array = JSON.parse(contenido)
            const objId = this.array.filter(item => item.id == id)
            return (objId ? objId : { error: "Producto no encontrado" })
        } catch {
            return {}
        }
    }

    async actualizar(obj, id) {
        this.productos = this.productos.map(prod=>{
            if(prod.id == id){
                if(obj.title){
                    prod.title=obj.title;
                }
                if(obj.price){
                    prod.price=obj.price;
                }
                if(obj.thumbnail){
                    prod.thumbnail=obj.thumbnail;
                }
            }
            return prod;
        })
        return obj;
    }

    async eliminar(id) {
        this.array = await this.recuperar()
        let newArray = this.array.filter(item => item.id != id);
        this.array.splice(0);
        this.array.push(...newArray);
        const contenido = JSON.stringify(this.array, null, 4)
        await fs.promises.writeFile(this.ruta, contenido)
        return (this.array);
    }
}
module.exports = Contenedor