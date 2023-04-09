const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req,res) => {
    const{correo,password} = req.body;
    try{
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({msg: "Usuario / contraseña no son correctos"});
        }
        if(!usuario.estado){
            return res.status(400).json({msg: "Usuario eliminado"});
        }
        const validPassword = bcryptjs.compareSync(password,usuario.password);
        if(!validPassword){
            return res.status(400).json({msg: "Contraseña incorrecta"});
        }
        const token = await generarJWT(usuario.id);

        res.json({
            msg: "Login OK",
            usuario,
            token
        })
    }catch(e){
        console.log(e);
        return res.status(500).json({msg: "Algo salio mal"});
    }
}

module.exports = {login}