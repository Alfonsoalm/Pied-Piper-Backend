// Importar librerias
import express from "express";
import cors from "cors";
// Cargar conf rutas
import UserRoutes from "./routes/user.js";
import PublicationRoutes from"./routes/publication.js";
import FollowRoutes from"./routes/follow.js";
import CompanyRoutes from "./routes/company.js";

// Mensaje bienvenida
console.log("API NODE para RED SOCIAL arrancada!!");
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
app.use("/api/company", CompanyRoutes);

// Poner servidor a escuchar peticiones http
app.listen(puerto, () => {
    console.log("Servidor de node corriendo en el puerto: ", puerto);
});