// Backend/routes/publication.js
import express from "express";
import multer from "multer";
import check from "../middlewares/auth.js";
import Publication from "../DAO/publication.js";
import path from "path";

const router = express.Router();

// Configuración de subida
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/publications/");
  },
  filename: (req, file, cb) => {
    cb(null, "pub-" + Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage });

// Función para guardar publicación
const savePublication = async (req, res) => {
  try {
    const result = await Publication.save({ ...req.body, user: req.user.id });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Función para obtener detalles de una publicación
const getPublicationDetail = async (req, res) => {
  try {
    const publication = await Publication.detail(req.params.id);
    res.status(200).json({ status: "success", publication });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
};

// Función para eliminar una publicación
const removePublication = async (req, res) => {
  try {
    const result = await Publication.remove(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Función para obtener publicaciones de un usuario
const getUserPublications = async (req, res) => {
  const userId = req.params.id;
  const page = req.params.page ? parseInt(req.params.page, 10) : 1;

  try {
    const result = await Publication.user(userId, page);

    // Si no hay publicaciones, devolver un array vacío
    if (!result.publications.length) {
      return res.status(200).json({
        status: "success",
        message: "No hay publicaciones para este usuario",
        publications: [],  // Devolvemos un array vacío en lugar de lanzar un error
        total: 0,
        pages: 0,
      });
    }

    // Si hay publicaciones, devolver los resultados
    res.status(200).json({
      status: "success",
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener publicaciones del usuario",
      error: error.message,
    });
  }
};

// Función para subir imagen de una publicación
const uploadPublicationImage = async (req, res) => {
  try {
    const publication = await Publication.upload(req.params.id, req.user.id, req.file);
    res.status(200).json({ status: "success", publication, file: req.file });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Función para obtener archivo multimedia de una publicación
const getPublicationMedia = async (req, res) => {
  try {
    const filePath = await Publication.media(req.params.file);
    res.sendFile(path.resolve(filePath));
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
};

// Función para el feed de publicaciones
const getPublicationFeed = async (req, res) => {
  try {
    const result = await Publication.feed(req.user.id, req.params.page);
    res.status(200).json({ status: "success", ...result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Ruta para guardar una nueva publicación
router.post("/save", check.auth, savePublication);
// Ruta para obtener detalles de una publicación específica
router.get("/detail/:id", check.auth, getPublicationDetail);
// Ruta para eliminar una publicación específica
router.delete("/remove/:id", check.auth, removePublication);
// Ruta para obtener publicaciones de un usuario con paginación
router.get("/user/:id/:page?", check.auth, getUserPublications);
// Ruta para subir una imagen asociada a una publicación
router.post("/upload/:id", [check.auth, uploads.single("file0")], uploadPublicationImage);
// Ruta para obtener un archivo multimedia de una publicación
router.get("/media/:file", getPublicationMedia);
// Ruta para obtener el feed de publicaciones de los usuarios seguidos
router.get("/feed/:page?", check.auth, getPublicationFeed);

export default router;
