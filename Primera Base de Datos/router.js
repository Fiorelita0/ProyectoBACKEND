const { Router } = require('express')

const router = new Router()

router.get("/", (req, res) => {
    res.render("views/formulario.ejs")
})

module.exports = {
    router
}