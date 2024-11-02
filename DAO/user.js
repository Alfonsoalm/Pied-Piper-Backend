// Backend/DAO/user.js
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import jwt from "../services/jwt.js";
import followService from "../services/followService.js";
import UserModel from "../models/user.js";
import Follow from "../models/follow.js";
import Publication from "../models/publication.js";
import Database from "./database.js";

class User {
  constructor({
    name = "",
    surname = "",
    bio = "Gran persona",
    nick = "",
    email,
    password,
    role = "role_user",
    image = "default.png",
  } = {}) {
    this.name = name;
    this.surname = surname;
    this.bio = bio;
    this.nick = nick;
    this.email = email;
    this.password = password;
    this.role = role;
    this.image = image;
    console.log("Instancia Usuario creada");
  }

  async register() {
    try {
      const db = Database.getInstance();
      // Control de usuarios duplicados
      const existingUser = await db.findOne(UserModel, {
        $or: [
          { email: this.email.toLowerCase() },
          { nick: this.nick.toLowerCase() },
        ],
      });

      if (existingUser) {
        return {
          status: "error",
          message: "El usuario ya existe",
          statusCode: 409,
        };
      }
      // Cifrar la contraseña antes de guardarla
      if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
      }
      // Guardar usuario usando Database
      const userStored = await db.registerUser(this);
      // Retornar objeto con resultado exitoso
      return {
        status: "success",
        message: "Usuario registrado correctamente",
        user: {
          id: userStored._id,
          name: userStored.name,
          nick: userStored.nick,
          email: userStored.email,
        },
      };
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      return {
        status: "error",
        message: "Error en el registro de usuario",
        statusCode: 500,
      };
    }
  }

  async login(userData) {
    try {
      // Obtener instancia de base de datos
      const db = Database.getInstance();
      // Buscar el usuario en la base de datos
      const user = await db.findOne(UserModel, { email: userData.email });
      if (!user) {
        return {
          status: "error",
          message: "No existe el usuario",
          statusCode: 404,
        };
      }
      // Verificar la contraseña
      const pwdMatch = await bcrypt.compare(userData.password, user.password);
      if (!pwdMatch) {
        return {
          status: "error",
          message: "Contraseña incorrecta",
          statusCode: 400,
        };
      }
      // Generar token si la autenticación es exitosa
      const token = jwt.createToken(user);
      return {
        status: "success",
        message: "Usuario identificado correctamente",
        user: {
          id: user._id,
          name: user.name,
          nick: user.nick,
          email: user.email,
        },
        token,
      };
    } catch (error) {
      console.error("Error en el proceso de login:", error);
      return {
        status: "error",
        message: "Error en el servidor",
        statusCode: 500,
      };
    }
  }

  static async getProfile(userId, requesterId) {
    try {
      // Obtener la instancia de la base de datos
      const db = Database.getInstance();
      // Buscar el perfil del usuario excluyendo ciertos campos
      const userProfile = await UserModel.findById(userId).select({
        password: 0,
        role: 0,
      });
      // Verificar si el usuario existe
      if (!userProfile) {
        throw new Error("El usuario no existe o hay un error");
      }
      // Obtener información de seguimiento
      const followInfo = await followService.followThisUser(
        requesterId,
        userId
      );
      // Devolver el perfil del usuario y la información de seguimiento
      return {
        status: "success",
        user: userProfile,
        following: followInfo.following,
        followers: followInfo.followers,
      };
    } catch (error) {
      console.error("Error al obtener el perfil del usuario:", error);
      throw error;
    }
  }

  static async getUserList(requesterId, page = 1, itemsPerPage = 5) {
    try {
      // Realizar la consulta paginada para obtener usuarios
      const result = await UserModel.paginate(
        {},
        {
          select: "-password -email -role -__v", // Excluir campos sensibles
          sort: "_id", // Orden por ID
          page,
          limit: itemsPerPage,
        }
      );
      if (!result.docs || result.docs.length === 0) {
        throw new Error("No hay usuarios disponibles");
      }
      // Obtener información de seguimiento
      const followUserIds = await followService.followUserIds(requesterId);
      return {
        status: "success",
        users: result.docs,
        page: result.page,
        itemsPerPage: result.limit,
        total: result.totalDocs,
        pages: result.totalPages,
        user_following: followUserIds.following,
        user_follow_me: followUserIds.followers,
      };
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error);
      throw error;
    }
  }

  static async updateUser(userIdentityId, userToUpdate) {
    // Eliminar campos no permitidos para la actualización
    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.role;
    delete userToUpdate.image;
    try {
      // Comprobar si ya existe un usuario con el mismo email o nick
      const existingUsers = await UserModel.find({
        $or: [
          { email: userToUpdate.email.toLowerCase() },
          { nick: userToUpdate.nick.toLowerCase() },
        ],
      });

      const userExists = existingUsers.some(
        (user) => user._id.toString() !== userIdentityId
      );
      if (userExists) {
        return {
          status: "error",
          message: "El usuario ya existe con el mismo email o nick",
        };
      }
      // Cifrar la contraseña si se actualiza
      if (userToUpdate.password) {
        userToUpdate.password = await bcrypt.hash(userToUpdate.password, 10);
      } else {
        delete userToUpdate.password;
      }
      // Buscar y actualizar el usuario en la base de datos
      const updatedUser = await UserModel.findByIdAndUpdate(
        userIdentityId,
        userToUpdate,
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("Error al actualizar el usuario");
      }

      return {
        status: "success",
        message: "Usuario actualizado correctamente",
        user: updatedUser,
      };
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw new Error("Error en el proceso de actualización");
    }
  }

  static async setUserImg(userId, file) {
    if (!file) {
      throw new Error("Petición no incluye la imagen");
    }

    // Obtener la extensión del archivo
    const image = file.originalname;
    const imageSplit = image.split(".");
    const extension = imageSplit[1].toLowerCase();

    // Validar extensión
    const validExtensions = ["png", "jpg", "jpeg", "gif"];
    if (!validExtensions.includes(extension)) {
      fs.unlinkSync(file.path); // Eliminar el archivo si la extensión no es válida
      throw new Error("Extensión del fichero inválida");
    }

    try {
      // Actualizar el avatar en la base de datos
      const userUpdated = await UserModel.findByIdAndUpdate(
        userId,
        { image: file.filename },
        { new: true }
      );

      if (!userUpdated) {
        throw new Error("Error en la subida del avatar");
      }

      return {
        status: "success",
        user: userUpdated,
        file,
      };
    } catch (error) {
      console.error("Error al subir el avatar:", error);
      throw new Error("Error al subir el avatar");
    }
  }

  static async getUserImg(file) {
    const filePath = path.resolve(`./uploads/avatars/${file}`);

    // Verificar si el archivo existe
    return new Promise((resolve, reject) => {
      fs.stat(filePath, (error) => {
        if (error) {
          reject(new Error("No existe la imagen"));
        } else {
          resolve(filePath);
        }
      });
    });
  }

  async getCounters(userId) {
    try {
      const followingCount = await Follow.countDocuments({ user: userId });
      const followedCount = await Follow.countDocuments({ followed: userId });
      const publicationsCount = await Publication.countDocuments({ user: userId });

      return {
        status: "success",
        userId,
        following: followingCount,
        followed: followedCount,
        publications: publicationsCount,
      };
    } catch (error) {
      console.error("Error al obtener los contadores:", error);
      throw new Error("Error al obtener los contadores");
    }
  }
}

export default User;
