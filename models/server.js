const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.paths = {
            auth: "/api/auth",
            buscar: "/api/buscar",
            categorias: "/api/categorias",
            productos: "/api/productos",
            usuarios: "/api/usuarios",
        }
        // Conectar a base de datos
        this.conectarDb();
        // Middleware
        this.middlewares();
        // Rutas de la aplicacion
        this.routes();
    }
    async conectarDb(){
        await dbConnection();
    }
    middlewares() {
        // Directorio publico
        this.app.use(express.static("public"));
        // Parseo y lectura del body
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
        //CORS
        this.app.use(cors());
    }
    routes() {
        this.app.use(this.paths.auth,require("../routes/auth"));
        this.app.use(this.paths.buscar,require("../routes/buscar"));
        this.app.use(this.paths.categorias,require("../routes/categorias"));
        this.app.use(this.paths.productos,require("../routes/productos"));
        this.app.use(this.paths.usuarios,require("../routes/user"));
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log("Server running on port " + this.port);
        });
    }
}

module.exports = Server;
