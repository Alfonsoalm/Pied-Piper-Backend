// Backend/routes/company.js
import express from "express";
import Company from "../DAO/company.js";
import check from "../middlewares/auth.js";
import {validateCompany} from "../helpers/validate.js";
import multer from "multer";

const router = express.Router();

// Configuración de Multer para subir imágenes de avatar de empresa
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/avatars/");
  },
  filename: (req, file, cb) => {
    cb(null, "avatar-" + Date.now() + "-" + file.originalname);
  },
});
const uploads = multer({ storage });

// Registro de empresa
const register = async (req, res) => {
  const companyData = req.body;
  // Validación avanzada de los datos
  try {
    validateCompany(companyData);
  } catch (validationError) {
    return res.status(400).json({
      status: "error",
      message: "Datos no válidos: " + validationError.message,
    });
  }

  const company = new Company(companyData);

  const result = await company.register();
  
  if (result.status === "success") {
    return res.status(201).json(result);
  } else {
    return res.status(result.statusCode || 500).json(result);
  }

};

// Login de empresa
const login = async (req, res) => {
  const companyData = req.body;
  
  const company = new Company();
  const result = await company.login(companyData);
  
  if (result.status === "success") {
    return res.status(200).json(result);
  } else {
    return res.status(result.statusCode || 500).json(result);
  }
};

// Actualizar perfil de empresa
const updateProfile = async (req, res) => {
  const companyId = req.user.id;  // ID de la empresa autenticada
  const companyData = req.body;
  
  const company = new Company();
  const result = await company.updateProfile(companyId, companyData);
  
  if (result.status === "success") {
    return res.status(200).json(result);
  } else {
    return res.status(500).json(result);
  }
};

// Obtener el perfil de una empresa
const getProfile = async (req, res) => {
  const companyId = req.params.id; // ID de la empresa
  
  try {
    const user = await Company.getProfile(companyId); // Usar método para obtener perfil
    if (user) {
      return res.status(200).json({
        status: "success",
        user,
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "No se encontró la empresa",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener el perfil de la empresa",
    });
  }
};

// Subir avatar de empresa
const setCompanyImg = async (req, res) => {
  try {
    const result = await Company.setCompanyImg(req.user.id, req.file);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Obtener avatar de la empresa
const getCompanyImg = async (req, res) => {
  try {
    const filePath = await Company.getCompanyImg(req.params.file);
    return res.sendFile(filePath);
  } catch (error) {
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

// Obtener los contadores de una empresa
const getCounters = async (req, res) => {
    const companyId = req.params.id;
  
    try {
      // Aquí llamamos al método estático `getCounters` de la clase Company
      const counters = await Company.getCounters(companyId);
  
      return res.status(200).json({
        status: "success",
        ...counters  // Devolvemos los contadores obtenidos del DAO
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Error al obtener los contadores de la empresa",
      });
    }

};

export default router;

// Ruta para logearse la empresa
router.post("/register", register); // OK
// Ruta para logearse la empresa
router.post("/login", login); // OK
// Ruta para actualizar el perfil de la empresa
router.put("/update",check.auth, updateProfile); // OK
// Ruta nueva para obtener el perfi
router.get("/profile/:id", check.auth, getProfile); // ?
// Subir avatar de la empresa
router.post("/upload", [check.auth, uploads.single("file0")], setCompanyImg);
// Obtener avatar de la empresa
router.get("/avatar/:file", getCompanyImg);
// Ruta nueva para obtener los contadores
router.get("/counters/:id",check.auth, getCounters);  // ?
