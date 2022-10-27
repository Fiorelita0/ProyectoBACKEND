const fs=require('fs')
const express= require("express")

class Contenedor {
    constructor(nombreArchivo) {
      this.nombreArch = nombreArchivo;
    }
    async save(object) {
        let array = [];
        try {
          const data = await fs.promises.readFile(this.nombreArch, "utf-8");
          array = JSON.parse(data);
          //Encontrar object segun id
          let idArray = array.map((obj) => obj.id);
          let maxId = Math.max(...idArray);
    
          object.id = maxId + 1;
          array.push(object);
          fs.writeFileSync(this.nombreArch, JSON.stringify(array));
    
          console.log(`El archivo tiene como maximo de productos: ${object.id}`);
        } catch {
          object.id = 0;
          array.push(object);
          fs.writeFileSync(this.nombreArch, JSON.stringify(array));
        }
        return object.id;
      }
      async getById(id) {
        try {
          const data = await fs.promises.readFile(this.nombreArch, "utf-8");
          let array = JSON.parse(data);
          const producto = array.find((obj) => obj.id === id);
          if (producto) {
            return producto;
          } else {
            console.log("No se encontró producto");
            return null;
          }
        } catch {
          console.log("No existe el id");
        }
      }
      async getAll() {
        try {
          const data = await fs.promises.readFile(this.nombreArch, "utf-8");
          const array = JSON.parse(data);
          return array;
        } catch {
          return null;
        }
      }
      async deleteById(number) {
        try {
          const data = await fs.promises.readFile(this.nombreArch, "utf-8");
          const array = JSON.parse(data);
          const nuevoArray = array.filter((obj) => obj.id !== number);
          fs.writeFileSync(this.nombreArch, JSON.stringify(nuevoArray));
        } catch {
          return console.log("No hay objetos en el archivo");
        }
      }
      async deleteAll() {
        try {
                let data = await fs.promises.readFile(this.nombreArch, "utf8");
                let dataArch = JSON.parse(data);
                if (dataArch.length) {
                    await fs.promises.writeFile(this.nombreArch, "");
                } else {
                    console.log("No hay productos que borrar");
                }
            } catch {
                console.log("Error");
            }
      }
}
const nuevoArchivo = new Contenedor("./productos.txt")

const app= express();
const PUERTO= 8080;
const server= app.listen(PUERTO,() => console.log(`http://localhost:${PUERTO}`))

server.on("error", error => console.log(`Error en servidor ${error}`))

app.get('/', (req, res) => {
    res.end("Bienvenidos a Libreria El Capitan")
})
app.get('/productos', (req, res) => {
    nuevoArchivo.getAll().then(resolve => {
        res.end(`Estos son todos los productos que tenemos: ${JSON.stringify(resolve)}`)
    });
})
app.get('/productoRandom', (req, res) => {
    let prodRandom = parseInt((Math.random() * 3) + 1)
    nuevoArchivo.getById(prodRandom).then(resolve => {
        res.end(`Producto random: ${JSON.stringify(resolve)}`)
    });
})
