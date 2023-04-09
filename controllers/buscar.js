const { Usuario, Producto, Categoria } = require("../models");

const {ObjectId} = require("mongoose").Types;
const coleccionesPermitidas = [
    "categoria",
    "productos",
    "roles",
    "usuarios",
];
const buscarCategorias = async (termino,res)=>{
    const isMongoId = ObjectId.isValid(termino);
    if(isMongoId){
        const categoria = await Categoria.findById(termino);
        res.json({
            results: (categoria) ? [categoria] : []
        });
    }
    const regex = new RegExp(termino,"i");
    const categorias = await Categoria.find({nombre: regex, estado: true});
    res.json({count: categorias.length, results: categorias});
}
const buscarProductos = async (termino,res)=>{
    const isMongoId = ObjectId.isValid(termino);
    if(isMongoId){
        const producto = await Producto.findById(termino).populate("categoria","nombre");
        res.json({
            results: (producto) ? [producto] : []
        });
    }
    const regex = new RegExp(termino,"i");
    const productos = await Producto.find({nombre: regex, estado: true}).populate("categoria","nombre");
    res.json({count: productos.length, results: productos});
}
const buscarUsuarios = async (termino,res)=>{
    const isMongoId = ObjectId.isValid(termino);
    if(isMongoId){
        const usuario = await Usuario.findById(termino);
        res.json({
            results: (usuario) ? [usuario] : []
        });
    }
    const regex = new RegExp(termino,"i");
    const usuarios = await Usuario.find({
        $or: [{nombre: regex},{correo: regex}], 
        $and: [{estado: true}]
    });
    res.json({count: usuarios.length, results: usuarios});
}
const buscar = async (req,res)=>{
    const {coleccion,termino} = req.params;
    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`});
    }
    switch(coleccion){
    case "categoria":
        await buscarCategorias(termino,res);
        break;
    case "productos":
        await buscarProductos(termino,res);
        break;
    case "usuarios":
        await buscarUsuarios(termino,res);
        break;
    default:
        res.status(500).json({msg: `No existe esta busqueda`});
    }
}

module.exports = {
    buscar
}