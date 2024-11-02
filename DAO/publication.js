// Backend/DAO/publication.js
import PublicationModel from "../models/publication.js";
import followService from "../services/followService.js";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

class Publication {
  // Guardar publicación
  static async save(data) {
    try {
      const newPublication = new PublicationModel(data);
      const publicationStored = await newPublication.save();
      return {
        status: "success",
        message: "Publicación guardada",
        publicationStored,
      };
    } catch (error) {
      throw new Error("No se ha guardado la publicación");
    }
  }

  // Obtener detalles de una publicación
  static async detail(publicationId) {
    try {
      const publicationStored = await PublicationModel.findById(publicationId);
      if (!publicationStored) throw new Error("No existe la publicación");
      return publicationStored;
    } catch (error) {
      throw new Error("Error al obtener la publicación");
    }
  }

  // Eliminar publicación
  static async remove(publicationId, userId) {
    try {
      const publicationRemoved = await PublicationModel.deleteOne({
        user: userId,
        _id: publicationId,
      });
      if (!publicationRemoved)
        throw new Error("No se ha eliminado la publicación");
      return {
        status: "success",
        message: "Publicación eliminada correctamente",
        publication: publicationId,
      };
    } catch (error) {
      throw new Error("Error al eliminar la publicación");
    }
  }

  // Obtener publicaciones de un usuario con paginación
  // Obtener publicaciones de un usuario con paginación
  static async user(userId, page = 1, itemsPerPage = 5) {
    try {
      console.log("Obteniendo publicaciones para el usuario ID:", userId);

      const publications = await PublicationModel.find({ user: userId })
        .sort("-created_at")
        .populate("user", "-password -__v -role -email")
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);

      const total = await PublicationModel.countDocuments({ user: userId });

      if (!publications) {
        console.error(
          "No se encontraron publicaciones para el usuario ID:",
          userId
        );
        throw new Error("No se encontraron publicaciones");
      }

      console.log("Publicaciones encontradas:", publications);
      return {
        page,
        total,
        pages: Math.ceil(total / itemsPerPage),
        publications,
      };
    } catch (error) {
      console.error(
        "Error en la consulta de publicaciones del usuario:",
        error
      );
      throw new Error("Error al obtener publicaciones del usuario");
    }
  }

  // Subir imagen de una publicación
  static async upload(publicationId, userId, file) {
    try {
      const image = file.originalname;
      const extension = image.split(".").pop().toLowerCase();

      if (!["png", "jpg", "jpeg", "gif"].includes(extension)) {
        fs.unlinkSync(file.path);
        throw new Error("Extensión del archivo inválida");
      }

      const publicationUpdated = await PublicationModel.findOneAndUpdate(
        { user: userId, _id: publicationId },
        { file: file.filename },
        { new: true }
      );
      if (!publicationUpdated)
        throw new Error("Error al actualizar la publicación");
      return publicationUpdated;
    } catch (error) {
      throw new Error("Error al subir la imagen");
    }
  }

  // Obtener archivo multimedia de una publicación
  static async media(file) {
    const filePath = `./uploads/publications/${file}`;
    if (!fs.existsSync(filePath)) throw new Error("No existe la imagen");
    return filePath;
  }

  // Obtener publicaciones de los usuarios que sigue (feed)
  static async feed(userId, page = 1, itemsPerPage = 5) {
    try {
      const following = await followService.followUserIds(userId);
      const publications = await PublicationModel.find({
        user: { $in: following.following },
      })
        .populate("user", "-password -role -__v -email")
        .sort("-created_at")
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);

      const total = await PublicationModel.countDocuments({
        user: { $in: following.following },
      });
      return {
        total,
        page,
        pages: Math.ceil(total / itemsPerPage),
        publications,
      };
    } catch (error) {
      throw new Error("Error al obtener el feed de publicaciones");
    }
  }
}

export default Publication;
