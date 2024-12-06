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
  console.log("Registrando empresa: register");
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


// Verificacion de la empresa registrada
const verify = async (req, res) => {
  console.log("Verificando empresa: verify");
  const { token } = req.params;
  const company = new Company(); 
  const result = await company.verify(token);
  
  if (result.status === "success") {
    console.log("Verificacion exitosa")
    // return res.redirect("http://localhost:5173/verified-success");
    return res.status(200).json(result);
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
  console.log("obtiene perfil de empresa");
  
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


const setCompanyImg = async (req, res) => {
  try {
    // Verificar que se haya recibido un archivo
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "Petición no incluye la imagen",
      });
    }

    // Validar la extensión del archivo
    const image = req.file.originalname;
    const extension = image.split(".").pop().toLowerCase();

    if (!["png", "jpg", "jpeg", "gif"].includes(extension)) {
      // Borrar el archivo subido si no tiene una extensión válida
      const filepath = req.file.path;
      fs.unlinkSync(filepath);

      return res.status(400).json({
        status: "error",
        message: "Extensión del fichero inválida",
      });
    }

    // Llamar al método de la clase `Company` para actualizar la imagen
    const result = await Company.setCompanyImg(req.user.id, req.file);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error al subir la imagen de la empresa:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Error al subir el avatar de la empresa",
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

// Obtener lista de empresas con sus sectores
const getCompaniesWithSectors = async (req, res) => {
  try {
    console.log("Intentando obtener la lista de empresas");
    const companies = await Company.getAllCompanies(); // Llama al método del DAO
    return res.status(200).json({
      status: "success",
      companies,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener la lista de empresas",
    });
  }
};

const getCompaniesBySector = async (req, res) => {
  const sector = req.params.sector; // El sector a buscar

  try {
    const companies = await Company.getCompaniesBySector(sector);
    return res.status(200).json({
      status: "success",
      companies,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener empresas por sector",
    });
  }
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      status: "error",
      message: "Debe proporcionar un correo electrónico.",
    });
  }

  try {
    // Generar un token único para el reinicio de contraseña
    await Company.generatePasswordResetToken(email); // Método que genera y guarda el token en DB

    return res.status(200).json({
      status: "success",
      message: "Se ha enviado un enlace de recuperación a su correo electrónico.",
    });
  } catch (error) {
    console.error("Error en recuperación de contraseña para empresa:", error);
    return res.status(500).json({
      status: "error",
      message: "Hubo un problema al procesar la solicitud.",
    });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({
      status: "error",
      message: "Token y nueva contraseña son requeridos.",
    });
  }

  try {
    await Company.resetPassword(token, password);
    return res.status(200).json({
      status: "success",
      message: "La contraseña se ha restablecido correctamente.",
    });
  } catch (error) {
    console.error(
      "Error en el restablecimiento de contraseña de la empresa:",
      error
    );
    return res.status(400).json({
      status: "error",
      message: error.message || "Error al procesar la solicitud.",
    });
  }
};

// Ruta para logearse la empresa
router.post("/register", register); 
// Verificar empresa
router.get("/verify/:token", verify);
// Ruta para logearse la empresa
router.post("/login", login);
// Ruta para actualizar el perfil de la empresa
router.put("/update",check.auth, updateProfile);
// Ruta nueva para obtener el perfi
router.get("/profile/:id", check.auth, getProfile);
// Subir avatar de la empresa
router.post("/upload", [check.auth, uploads.single("file0")], setCompanyImg);
// Obtener avatar de la empresa
router.get("/avatar/:file", getCompanyImg);
// Ruta nueva para obtener los contadores
router.get("/counters/:id",check.auth, getCounters);
// Agrega la nueva ruta para obtener empresas con sectores
router.get("/list", getCompaniesWithSectors);
// Nueva ruta para obtener empresas por sector
router.get("/sector/:sector", getCompaniesBySector);
// Ruta para recuperar la contraseña
router.post("/forgot-password", requestPasswordReset);
// Ruta para resetear la contraseña
router.post("/reset-password", resetPassword);

export default router;