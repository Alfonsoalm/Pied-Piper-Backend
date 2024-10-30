import express from "express";
import multer from "multer";
import PublicationContoller from "../controllers/publication.js";
import check from "../middlewares/auth.js";
import fs from "fs";
import path from "path";
import Publication from "../models/publication.js";
import followService from "../services/followService.js";

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


router.post("/save", check.auth, save);
// Guardar publicacion
const save = (req, res) => {
    // Recoger datos del body
    const params = req.body;
    // Si no me llegan dar respuesta negativa
    if (!params.text) return res.status(400).send({ status: "error", "message": "Debes enviar el texto de la publicacion." });
    // Crear y rellenar el objeto del modelo
    let newPublication = new Publication(params);
    newPublication.user = req.user.id;
    newPublication.save((error, publicationStored) => {
        if (error || !publicationStored) return res.status(400).send({ status: "error", "message": "No se ha guardado la publicación." });
        return res.status(200).send({
            status: "success",
            message: "Publicación guardada",
            publicationStored
        });
    });
}


router.get("/detail/:id", check.auth, detail);
// Sacar una publicacion
const detail = (req, res) => {
    // Sacar id de publicacion de la url
    const publicationId = req.params.id;
    // Find con la condicion del id
    Publication.findById(publicationId, (error, publicationStored) => {
        if (error || !publicationStored) {
            return res.status(404).send({
                status: "error",
                message: "No existe la publicacion"
            })
        }
        return res.status(200).send({
            status: "success",
            message: "Mostrar publicacion",
            publication: publicationStored
        });
    });
}


router.delete("/remove/:id", check.auth, remove);
// Eliminar publicaciones
const remove = (req, res) => {
    // Sacar el id del publicacion a eliminar
    const publicationId = req.params.id;
    // Find y luego un remove
    Publication.deleteOne({ "user": req.user.id, "_id": publicationId }, (error, publicationRemoved) => {
        if (error || !publicationRemoved) {
            return res.status(500).send({
                status: "error",
                message: "No se ha eliminado la publicacion"
            });
        }
        return res.status(200).send({
            status: "success",
            message: "Publicación eliminada correctamente",
            publication: publicationId
        });
    });
}


router.get("/user/:id/:page?", check.auth, user);
const user = (req, res) => {
    // Sacar el id de usuario
    const userId = req.params.id;
    // Controlar la página
    let page = 1;
    if (req.params.page) page = req.params.page;
    const itemsPerPage = 5;
    // Find, populate, ordenar, paginar
    Publication.find({ "user": userId })
        .sort("-created_at")
        .populate('user', '-password -__v -role -email')
        .paginate(page, itemsPerPage, (error, publications, total) => {
            // Si hay un error en la consulta o no hay publicaciones, devolvemos un array vacío y total en 0
            if (error) {
                return res.status(500).send({
                    status: "error",
                    message: "Error en la petición de publicaciones"
                });
            }
            if (!publications || publications.length === 0) {
                return res.status(200).send({
                    status: "success",
                    message: "No hay publicaciones para mostrar",
                    publications: [], // Array vacío de publicaciones
                    total: 0, // Total es 0 cuando no hay publicaciones
                    pages: 0, // No hay páginas para mostrar
                });
            }
            return res.status(200).send({
                status: "success",
                message: "Publicaciones del perfil de un usuario",
                page,
                total,
                pages: Math.ceil(total / itemsPerPage),
                publications,
            });
        });
};


router.post("/upload/:id", [check.auth, uploads.single("file0")], upload);
// Subir ficheros
const upload = (req, res) => {
    // Sacar publication id
    const publicationId = req.params.id;
    // Recoger el fichero de imagen y comprobar que existe
    if (!req.file) {
        return res.status(404).send({
            status: "error",
            message: "Petición no incluye la imagen"
        });
    }
    // Conseguir el nombre del archivo
    let image = req.file.originalname;
    // Sacar la extension del archivo
    const imageSplit = image.split("\.");
    const extension = imageSplit[1];
    // Comprobar extension
    if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {
        // Borrar archivo subido
        const filePath = req.file.path;
        const fileDeleted = fs.unlinkSync(filePath);
        // Devolver respuesta negativa
        return res.status(400).send({
            status: "error",
            message: "Extensión del fichero invalida"
        });
    }
    // Si si es correcta, guardar imagen en bbdd
    Publication.findOneAndUpdate({ "user": req.user.id, "_id": publicationId }, { file: req.file.filename }, { new: true }, (error, publicationUpdated) => {
        if (error || !publicationUpdated) {
            return res.status(500).send({
                status: "error",
                message: "Error en la subida del avatar"
            })
        }
        // Devolver respuesta
        return res.status(200).send({
            status: "success",
            publication: publicationUpdated,
            file: req.file,
        });
    });
}


router.get("/media/:file", media); //cambio
// Devolver archivos multimedia imagenes
const media = (req, res) => {
    // Sacar el parametro de la url
    const file = req.params.file;
    // Montar el path real de la imagen
    const filePath = "./uploads/publications/" + file;
    // Comprobar que existe
    fs.stat(filePath, (error, exists) => {
        if (!exists) {
            return res.status(404).send({
                status: "error",
                message: "No existe la imagen"
            });
        }
        // Devolver un file
        return res.sendFile(path.resolve(filePath));
    });
}


router.get("/feed/:page?", check.auth, feed);
// Listar todas las publicaciones (FEED)
const feed = async (req, res) => {
    // Sacar la pagina actual
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    // Establecer numero de elementos por pagina
    let itemsPerPage = 5;
    // Sacar un array de identificadores de usuarios que yo sigo como usuario logueado
    try {
        const myFollows = await followService.followUserIds(req.user.id);
        // Find a publicaciones in, ordenar, popular, paginar
        const publications = Publication.find({ user: myFollows.following })
            .populate("user", "-password -role -__v -email")
            .sort("-created_at")
            .paginate(page, itemsPerPage, (error, publications, total) => {
                if(error || !publications){
                    return res.status(500).send({
                        status: "error",
                        message: "No hay publicaciones para mostrar",
                    });
                }
                return res.status(200).send({
                    status: "success",
                    message: "Feed de publicaciones",
                    following: myFollows.following,
                    total,
                    page,
                    pages: Math.ceil(total / itemsPerPage),
                    publications
                });
            });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al obtener usuarios que sigues",
        });
    }
}


// Exportar router
export default router;