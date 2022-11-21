const express = require('express');
const { Router } = require('express')
const Contenedor = require("./Contenedor.js")
const archivoProductos= new Contenedor('../productos.txt')
const archivoCarrito = new Contenedor('../carrito.txt');

const routerSesion = new Router()

const routerProd = new Router()
routerProd.use(express.json())
routerProd.use(express.urlencoded({ extended: true }))

const routerCarr = new Router()
routerCarr.use(express.json())
routerCarr.use(express.urlencoded({ extended: true }))

let admin = false;
//Verify if admin is true?
function soloParaAdmins(req, res, next) {
    if (admin) {
        next()
    } else {
        const text = `ruta ${req.originalUrl},metodo ${req.method} no autorizada`
        res.json({ error: -1, descripcion: text })
    }
}

//Get Date to a product
const getDate = () => {
    const today = moment();
    return today.format("DD/MM/YYYY HH:mm:ss")
}
//Generate a code to a product
const generateCode = async () => {
    const dataProducts = await archivoProductos.retrieve()
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

//Ruta Madre:api/sesion/
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

//Ruta Madre:api/productos/
//api/productos/
routerProd.get("/", (req, res) => {
    archivoProductos.retrieve().then(prods => {
        res.json(prods)
    })

})
//api/productos/:id
routerProd.get("/:id", (req, res) => {
    let id = parseInt(req.params.id);
    archivoProductos.retrieveId(id).then(prods => {
        res.json(prods)
    })
})
//api/productos/
routerProd.post("/", soloParaAdmins, async (req, res) => {
    const code = await generateCode();
    const date = getDate()
    const obj = { ...req.body, code, date }
    archivoProductos.save(obj).then(prods => {
        res.json(prods)
    })
})
//api/productos/:id
routerProd.put("/:id", soloParaAdmins, async (req, res) => {
    const code = await generateCode();
    const date = getDate()
    const obj = { ...req.body, code, date }
    let id = parseInt(req.params.id);
    archivoProductos.update(obj, id).then(prods => {
        res.json(prods)
    })
})
//api/productos/:id
routerProd.delete("/:id", soloParaAdmins, (req, res) => {
    let id = parseInt(req.params.id);
    archivoProductos.delete(id).then(prods => {
        res.json(prods)
    })
})

//Ruta Madre:apí/carrito/
//apí/carrito/
routerCarr.post("/", (req, res) => {
    const carrito = { productos: [], timestamp: getDate() }
    archivoCarrito.save(carrito).then(carrito => {
        res.json(carrito.id)
    })
})
//apí/carrito/:id
routerCarr.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    archivoCarrito.retrieveId(id).then(carrito => {
        carrito.productos = []
        archivoCarrito.update(carrito, id).then(arrayCarrito => {
            res.json(arrayCarrito)
        })
    })

})
//apí/carrito/:id/productos
routerCarr.get("/:id/productos", (req, res) => {
    const id = parseInt(req.params.id);
    archivoCarrito.retrieveId(id).then(carrito => {
        res.json(carrito.productos)
    })
})
//apí/carrito/:id/productos/
routerCarr.post("/:id/productos/", (req, res) => {
    const id = parseInt(req.params.id);
    const id_prod = req.body.id;
    archivoCarrito.retrieveId(id).then(carrito => {
        return archivoProductos.retrieveId(id_prod).then(prods => {
            carrito.productos.push(prods);
            return carrito
        })
    }).then(carrito => {
        archivoCarrito.update(carrito, id).then(compraUpdate => {
            res.json(compraUpdate)
        })
    })
})
//apí/carrito/:id/productos/:id_prod
routerCarr.delete("/:id/productos/:id_prod", (req, res) => {
    const id = parseInt(req.params.id);
    const id_prod = parseInt(req.params.id_prod);
    archivoCarrito.retrieveId(id).then(carrito => {
        const arrayAuxy = carrito.productos.filter(item => item.id != id_prod);
        carrito.productos.splice(0)
        carrito.productos.push(...arrayAuxy)
        return carrito
    }).then(carrito => {
        archivoCarrito.update(carrito, id).then(compraUpdate => {
            res.json(compraUpdate)
        })
    })
})

module.exports = {
   routerProd, routerCarr, routerSesion
}