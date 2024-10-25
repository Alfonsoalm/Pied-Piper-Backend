// Importar dependencias
// const connection = require("./database/connection");
// const express = require("express");
// const cors = require("cors");

import connection from "./database/connection.js";
import express from "express";
import cors from "cors";

// Mensaje bienvenida
console.log("API NODE para RED SOCIAL arrancada!!");

// Conexion a bbdd
connection();

// Crear servidor node
const app = express();
const puerto = 3900;

// Configurar cors para permitir solo solicitudes de tu frontend
app.use(cors({
    origin: 'http://localhost:5173', // Permitir solo este origen (el puerto donde se ejecuta React)
    credentials: true, // Permitir envío de cookies o autenticación
  }));
  

// Convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true})); 

// Cargar conf rutas
// const UserRoutes = require("./routes/user");
// const PublicationRoutes = require("./routes/publication");
// const FollowRoutes = require("./routes/follow");

import UserRoutes from "./routes/user.js";
import PublicationRoutes from"./routes/publication.js";
import FollowRoutes from"./routes/follow.js";

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