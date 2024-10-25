// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const PublicationContoller = require("../controllers/publication");
// const check = require("../middlewares/auth");

import express from "express";
import multer from "multer";
import PublicationContoller from "../controllers/publication.js";
import check from "../middlewares/auth.js";
const router = express.Router();

// Configuracion de subida
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/publications/")
    },
    filename: (req, file, cb) => {
        cb(null, "pub-"+Date.now()+"-"+file.originalname);
    }
});

const uploads = multer({storage});

// Definir rutas
router.get("/prueba-publication", PublicationContoller.pruebaPublication);
router.post("/save", check.auth, PublicationContoller.save);
router.get("/detail/:id", check.auth, PublicationContoller.detail);
router.delete("/remove/:id", check.auth, PublicationContoller.remove);
router.get("/user/:id/:page?", check.auth, PublicationContoller.user);
router.post("/upload/:id", [check.auth, uploads.single("file0")], PublicationContoller.upload);
router.get("/media/:file", PublicationContoller.media); //cambio
router.get("/feed/:page?", check.auth, PublicationContoller.feed);

// Exportar router
// module.exports = router;
export default router;