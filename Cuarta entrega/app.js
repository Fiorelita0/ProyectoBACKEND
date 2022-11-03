const express= require("express")
const app= express()

app.use("/static", express.static(__dirname + "public"))

const {Router}= express;

const productosRouter = new Router();
productosRouter.use(express.json());
productosRouter.use(express.urlencoded({ extended: true }))
const productos = []

const PORT= process.env.PORT || 8080
app.listen(PORT, ()=> console.log(`http://localhost:${PORT}`));

//Subrutas
app.use("/api/productos", productosRouter);
//index.html
app.use('/static', express.static('public'));
//Cuando no funciona la pagina
app.use((req, res, next) => {
    res.status(404).send("Pagina no encontrada");
})

//Productos
productosRouter.get("/",(req,res)=>{
res.json(productos)
})
productosRouter.get("/:id",(req,res)=>{
    let id = parseInt(req.params.id);
    let producto = productos.find(item => item.id == id);
    res.json(producto ? producto : { error: "producto no encontrado" });
})
productosRouter.post("/",(req,res)=>{
    let producto=req.body
    req.body.id=productos.length +1;
    productos.push(producto)
    res.json(producto)
});
productosRouter.put("/:id", (req, res) => {
    let id = parseInt(req.params.id);
    req.body.id = id;
    let producto = req.body;
    const array = productos.map(item => item.id == id ? producto : item);
    productos.splice(0);
    productos.push(...array);
    res.json(producto);
})

productosRouter.delete("/:id", (req, res) => {
    let id = parseInt(req.params.id);
    let array = productos.filter(item => item.id != id);
    productos.splice(0);
    productos.push(...array);
    res.json(productos);
})

