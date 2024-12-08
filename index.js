// Importar librerias
import express from "express";
import cors from "cors";
// Cargar conf rutas
import UserRoutes from "./routes/user.js";
import PublicationRoutes from"./routes/publication.js";
import FollowRoutes from"./routes/follow.js";
import OfferRoutes from"./routes/offer.js";
import CompanyRoutes from "./routes/company.js";
import MessageRoutes from "./routes/message.js";

// Mensaje bienvenida
console.log("API NODE para RED SOCIAL arrancada!!");
// Crear servidor node
const app = express();
const puerto = 3900;

// Configurar cors para permitir solo solicitudes de tu frontend
app.use(cors({
    origin: 'http://localhost:5173', // Asegúrate de que coincida con el puerto de tu frontend
    credentials: true, // Permitir el uso de cookies, tokens o cabeceras de autenticación
}));

// Convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true})); 
app.use("/api/user", UserRoutes);
app.use("/api/publication", PublicationRoutes);
app.use("/api/company", CompanyRoutes);
app.use("/api/offer", OfferRoutes);
app.use("/api/follow", FollowRoutes); 
app.use("/api/message", MessageRoutes);

// Poner servidor a escuchar peticiones http
app.listen(puerto, "0.0.0.0", () => {
    console.log("Servidor de node corriendo en el puerto: ", puerto);
});