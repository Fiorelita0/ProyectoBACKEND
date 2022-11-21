const express = require('express');
const { Router } = require('express');
const moment = require('moment');
const Contenedor = require("./Contenedor.js")
const archivoProductos= new Contenedor('../productos.txt')
const archivoCarrito = new Contenedor('../carrito.txt');

const routerSesion = new Router()

const routerProductos = new Router()
routerProductos.use(express.json())
routerProductos.use(express.urlencoded({ extended: false}))

const routerCarrito = new Router()
routerCarrito.use(express.json())
routerCarrito.use(express.urlencoded({ extended: false }))

let admin = false;

function soloParaAdmins(req, res, next) {
    if (admin) {
        next()
    } else {
        const text = `ruta ${req.originalUrl},metodo ${req.method} no autorizada`
        res.json({ error: -1, descripcion: text })
    }
}

const getDate = () => {
    const today = moment();
    return today.format("DD/MM/YYYY HH:mm:ss")
}

const generarCodigo = async () => {
    const dataProducts = await archivoProductos.recuperar()
    let salir = true;
    //generate code
    while (salir) {
        let code = parseInt(Math.random() * 100) + 1
        const codeExist = dataProducts.find(element => element.code == code)
        if (!codeExist) {
            return code;
        }
    }

}

//api/sesion/
//api/sesion/login
routerSesion.get('/login', (req, res) => {
    admin = true
    res.sendStatus(200)
})
//api/sesion/logout
routerSesion.get('/logout', (req, res) => {
    admin = false
    res.sendStatus(200)
})

//api/productos/
//api/productos/
routerProductos.get("/", (req, res) => {
    archivoProductos.recuperar().then(prods => {
        res.json(prods)
    })

})
//api/productos/:id
routerProductos.get("/:id", (req, res) => {
    let id = parseInt(req.params.id);
    archivoProductos.recuperarId(id).then(prods => {
        res.json(prods)
    })
})
//api/productos/
routerProductos.post("/", soloParaAdmins, async (req, res) => {
    const code = await generarCodigo();
    const date = getDate()
    const obj = { ...req.body, code, date }
    archivoProductos.guardar(obj).then(prods => {
        res.json(prods)
    })
})
//api/productos/:id
routerProductos.put("/:id", soloParaAdmins, async (req, res) => {
    const code = await generarCodigo();
    const date = getDate()
    const obj = { ...req.body, code, date }
    let id = parseInt(req.params.id);
    archivoProductos.actualizar(obj, id).then(prods => {
        res.json(prods)
    })
})

//api/productos/:id
routerProductos.delete("/:id", soloParaAdmins, (req, res) => {
    let id = parseInt(req.params.id);
    archivoProductos.eliminar(id).then(prods => {
        res.json(prods)
    })
})

//Ruta Madre:apí/carrito/
//apí/carrito/
routerCarrito.post("/", (req, res) => {
    const carrito = { productos: [], timestamp: getDate() }
    archivoCarrito.guardar(carrito).then(carrito => {
        res.json(carrito.id)
    })
})
//apí/carrito/:id
routerCarrito.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    archivoCarrito.recuperarId(id).then(carrito => {
        carrito.productos = []
        archivoCarrito.actualizar(carrito, id).then(arrayCarrito => {
            res.json(arrayCarrito)
        })
    })

})
//apí/carrito/:id/productos
routerCarrito.get("/:id/productos", (req, res) => {
    const id = parseInt(req.params.id);
    archivoCarrito.recuperarId(id).then(carrito => {
        res.json(carrito.productos)
    })
})
//apí/carrito/:id/productos/
routerCarrito.post("/:id/productos/", (req, res) => {
    const id = parseInt(req.params.id);
    const id_prod = req.body.id;
    archivoCarrito.recuperarId(id).then(carrito => {
        return archivoProductos.recuperarId(id_prod).then(prods => {
            carrito.productos.push(prods);
            return carrito
        })
    }).then(carrito => {
        archivoCarrito.actualizar(carrito, id).then(compraactualizar => {
            res.json(compraactualizar)
        })
    })
})
//apí/carrito/:id/productos/:id_prod
routerCarrito.delete("/:id/productos/:id_prod", (req, res) => {
    const id = parseInt(req.params.id);
    const id_prod = parseInt(req.params.id_prod);
    archivoCarrito.recuperarId(id).then(carrito => {
        const arrayAuxy = carrito.productos.filter(item => item.id != id_prod);
        carrito.productos.splice(0)
        carrito.productos.push(...arrayAuxy)
        return carrito
    }).then(carrito => {
        archivoCarrito.actualizar(carrito, id).then(compraactualizar => {
            res.json(compraactualizar)
        })
    })
})

module.exports = {
   routerProductos, routerCarrito, routerSesion
}