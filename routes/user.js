// Backend/routes/user.js
import express from "express";
import multer from "multer";
import check from "../middlewares/auth.js";
import User from "../DAO/user.js";
import fs from "fs";
import { validateUser } from "../helpers/validate.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/avatars/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, "avatar-" + Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({storage});


// Registro de usuario
const register = async (req, res) => {
  const userData = req.body;
  // Validación avanzada de los datos
  try {
    validateUser(userData);
  } catch (validationError) {
    return res.status(400).json({
      status: "error",
      message: "Datos no válidos: " + validationError.message,
    });
  }
  // Crear instancia de User y llamar a su método de registro
  const user = new User(userData);
  const result = await user.register();
  // Enviar respuesta basada en el resultado
  if (result.status === "success") {
    return res.status(201).json(result);
  } else {
    return res.status(result.statusCode || 500).json(result);
  }
};

const login = async (req, res) => {
  // Recoger parámetros body
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({
      status: "error",
      message: "Faltan datos por enviar",
    });
  }
  // Crear instancia de User y llamar a su método de login
  const userInstance = new User();
  const result = await userInstance.login({ email, password });
  // Enviar respuesta basada en el resultado
  if (result.status === "success") {
    return res.status(200).json(result);
  } else {
    return res.status(result.statusCode || 500).json(result);
  }
};

const getProfile = async (req, res) => {
  const userId = req.params.id; // ID del usuario del que queremos obtener info
  const requesterId = req.user.id; // ID del usuario que solicita el perfil

  try {
    // Llamar al método estático getProfile de User
    const profileData = await User.getProfile(userId, requesterId);
    return res.status(200).json(profileData);
  } catch (error) {
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

const getUserList = async (req, res) => {
  const page = req.params.page ? parseInt(req.params.page) : 1;
  const itemsPerPage = 5;
  const requesterId = req.user.id;

  try {
    // Llamar al método getUserList en User
    const userListData = await User.getUserList(
      requesterId,
      page,
      itemsPerPage
    );
    return res.status(200).json(userListData);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  const userIdentityId = req.user.id;
  const userToUpdate = req.body;

  // Ajustar formato de campos
  if (userToUpdate.preferred_locations) {
    userToUpdate.preferred_locations = Array.isArray(userToUpdate.preferred_locations)
      ? userToUpdate.preferred_locations
      : [userToUpdate.preferred_locations];
  }
  if (userToUpdate.distance_range_km) {
    userToUpdate.distance_range_km = parseInt(userToUpdate.distance_range_km);
  }
  console.log(userToUpdate);

  try {
    const updateResult = await User.updateUser(userIdentityId, userToUpdate);
    return res.status(200).json(updateResult);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const setUserImg = async (req, res) => {
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

    // Llamar al método de la clase `User` para actualizar la imagen
    const result = await User.setUserImg(req.user.id, req.file);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Error al subir el avatar",
    });
  }
};


const getUserImg = async (req, res) => {
  try {
    const filePath = await User.getUserImg(req.params.file);
    return res.sendFile(filePath);
  } catch (error) {
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

const getCounters = async (req, res) => {
  const userId = req.params.id || req.user.id;
  try {
    const user = new User({});
    const result = await user.getCounters(userId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en los contadores:", error);
    return res.status(500).json({
      status: "error",
      message: "Error en los contadores",
    });
  }
};
 
const getAllProfessions = async (req, res) => {
  try {
    const professions = await User.getAllProfessions(); // Llama al método en el DAO
    return res.status(200).json({
      status: "success",
      professions,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener las profesiones",
    });
  }
};

const getUsersByProfession = async (req, res) => {
  const profession = req.params.profession; // La profesión a buscar

  try {
    const users = await User.getUsersByProfession(profession);
    return res.status(200).json({
      status: "success",
      users,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener usuarios por profesión",
    });
  }
};

// Rutas para guardar datos de nuevo usuario a la base de datos
router.post("/register", register);
// Ruta para realizar el login de un usuario y obtener token de autenticacion
router.post("/login", login);
// Ruta para obtener el perfil de un usuario (seguidos y seguidores)
router.get("/profile/:id", check.auth, getProfile);
// Ruta para listar los usuarios por pagina
router.get("/list/:page?", check.auth, getUserList);
// Ruta para actualizar un usuario
router.put("/update", check.auth, updateUser);
// Ruta para subir imagen de un usuario
router.post("/upload", [check.auth, uploads.single("file0")], setUserImg);
// Obtener imagen del usuario o avatar
router.get("/avatar/:file", getUserImg);
// Obtener el numero de seguidos, seguidores y publicaciones
router.get("/counters/:id", check.auth, getCounters);
// Nueva ruta para obtener todas las profesiones
router.get("/professions", getAllProfessions);
// Nueva ruta para obtener usuarios por profesión
router.get("/profession/:profession", getUsersByProfession);

export default router;