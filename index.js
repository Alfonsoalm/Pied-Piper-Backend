// Importar librerias
import express from "express";
import cors from "cors";
// Cargar conf rutas
import UserRoutes from "./routes/user.js";
import PublicationRoutes from"./routes/publication.js";
import FollowRoutes from"./routes/follow.js";
// Importar archivo de conexion a bbdd
import connection from "./database/connection.js";

// Mensaje bienvenida
console.log("API NODE para RED SOCIAL arrancada!!");
// Conexion a bbdd
connection();
// Crear servidor node
const app = express();
const puerto = 3900;
// Configurar cors para permitir solo solicitudes de tu frontend
app.use(cors({
    origin: ['http://localhost:5173'], // 'https://2284-87-223-126-135.ngrok-free.app'], // Lista de orígenes permitidos
    credentials: true, // Permitir envío de cookies o autenticación
}));
// Convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true})); 
app.use("/api/user", UserRoutes);
app.use("/api/publication", PublicationRoutes);
app.use("/api/follow", FollowRoutes);

// Ruta de prueba
app.get("/ruta-prueba", (req, res) => {
    return res.status(200).json(
        {
            "id": 1,
            "nombre": "Victor",
            "web": "victorroblesweb.es"
        }
    );
})

// Poner servidor a escuchar peticiones http
app.listen(puerto, () => {
    console.log("Servidor de node corriendo en el puerto: ", puerto);
});