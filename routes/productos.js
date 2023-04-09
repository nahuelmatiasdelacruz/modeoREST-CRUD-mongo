const {Router} = require("express");
const {check} = require("express-validator");
const { validarJwt, validarCampos, esAdminRole } = require("../middlewares");
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require("../controllers/productos");
const { existeCategoria, existeProducto } = require("../helpers/db-validators");

const router = Router();

router.get("/",obtenerProductos);

router.get("/:id",[
    check("id","No es un ID de mongo").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos
],obtenerProducto);

router.post("/",[
    validarJwt,
    check("nombre","El nombre es obligatorio").not().isEmpty(),
    check("categoria","No es un ID de Mongo valido").isMongoId(),
    check("categoria").custom(existeCategoria),
    validarCampos
],crearProducto);

router.put("/:id",[
    validarJwt,
    //check("categoria","No es un ID de Mongo valido").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos
],actualizarProducto);

router.delete("/:id",[
    validarJwt,
    esAdminRole,
    check("id","No es un ID de mongo").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos
],borrarProducto);

module.exports = router;