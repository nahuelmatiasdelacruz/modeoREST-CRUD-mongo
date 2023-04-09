const {Router} = require("express");
const {check} = require("express-validator");
const { validarJwt, validarCampos, esAdminRole } = require("../middlewares");
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require("../controllers/categorias");
const { existeCategoria } = require("../helpers/db-validators");

const router = Router();

router.get("/",obtenerCategorias);

router.get("/:id",[
    check("id","No es un ID de mongo").isMongoId(),
    check("id").custom(existeCategoria),
    validarCampos
],obtenerCategoria);

router.post("/",[
    validarJwt,
    check("nombre","El nombre es obligatorio").not().isEmpty(),
    validarCampos
],crearCategoria);

router.put("/:id",[
    validarJwt,
    check("nombre","El nombre es obligatorio").not().isEmpty(),
    check("id").custom(existeCategoria),
    validarCampos
],actualizarCategoria);

router.delete("/:id",[
    validarJwt,
    esAdminRole,
    check("id","No es un ID de mongo").isMongoId(),
    check("id").custom(existeCategoria),
    validarCampos
],borrarCategoria);

module.exports = router;