// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const UserController = require("../controllers/user");
// const check = require("../middlewares/auth");

import express from "express";
import multer from "multer";
import UserController from "../controllers/user.js";
import check from "../middlewares/auth.js";
const router = express.Router();

// Configuracion de subida
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/avatars/")
    },
    filename: (req, file, cb) => {
        cb(null, "avatar-"+Date.now()+"-"+file.originalname);
    }
});

const uploads = multer({storage});

// Definir rutas
router.get("/prueba-usuario", check.auth, UserController.pruebaUser);
// Ruta para guardar datos de nuevo usuario a la base de datos
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:id", check.auth, UserController.profile);
router.get("/list/:page?", check.auth, UserController.list);
router.put("/update", check.auth, UserController.update);
router.post("/upload", [check.auth, uploads.single("file0")], UserController.upload);
router.get("/avatar/:file", UserController.avatar); // cambio
router.get("/counters/:id", check.auth, UserController.counters);

// Exportar router
// module.exports = router;
export default router;