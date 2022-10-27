const fs = require("fs");

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
      const data = await fs.promises.readFile(this.naombreArch, "utf-8");
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

const contenedor = new Contenedor("./productos.txt");
//Agregar un producto más
contenedor.save({title: "Alimento Sobrecito Balanceado 2",price: 4850,thumbnail: "pedigree.png",}).then((resolve) => console.log(resolve));
//Filtramos por id
contenedor.getById(1).then((resolve) => console.log("El producto buscado es: ", resolve));
//Todos los productos
contenedor.getAll().then((resolve) =>console.log("Estos son todos los productos existentes:", resolve));
//Eliminar producto segun id
contenedor.deleteById(4)
//Eliminar todos los productos
contenedor.deleteAll
