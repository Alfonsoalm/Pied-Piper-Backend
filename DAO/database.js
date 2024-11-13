// Backend/DAO/Database.js
import mongoose from "mongoose";
import CompanyModel from "../models/company.js"; // Importamos el modelo de la empresa
import UserModel from "../models/user.js";
import OfferModel from "../models/offer.js";

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    this.connect();
    Database.instance = this;
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect() {
    try {
      mongoose.set("strictQuery", false);
      await mongoose.connect("mongodb://localhost:27017/mi_redsocial");
      console.log("Conectado correctamente a bd: mi_redsocial");
    } catch (error) {
      console.error("Error al conectar a la base de datos:", error);
      throw new Error("No se ha podido conectar a la base de datos");
    }
  }

  // Método para registrar un nuevo usuario
  async registerUser(data) {
    try {
      const newUser = new UserModel(data);
      const userStored = await newUser.save();

      userStored.toObject();
      delete userStored.password;
      return userStored;
    } catch (error) {
      console.error("Error al guardar usuario en la base de datos:", error);
      throw new Error("Error al guardar usuario");
    }
  }

  // Método para registrar una nueva empresa
  async registerCompany(data) {
    try {
      const newCompany = new CompanyModel(data);
      const companyStored = await newCompany.save();
      companyStored.toObject();
      delete companyStored.password;
      return companyStored;
    } catch (error) {
      console.error("Error al guardar empresa en la base de datos:", error);
      throw new Error("Error al guardar empresa");
    }
  }

  // Método para registrar una nueva oferta
  async registerOffer(data) {
    try {
      const newOffer = new OfferModel(data); // Asegúrate de que OfferModel esté importado
      const offerStored = await newOffer.save();
      return offerStored;
    } catch (error) {
      console.error("Error al guardar la oferta en la base de datos:", error);
      throw new Error("Error al guardar la oferta");
    }
  }

  // Método para buscar un usuario o una empresa por ciertos criterios
  async findOne(model, query) {
    try {
      return await model.findOne(query);
    } catch (error) {
      console.error("Error al buscar en la base de datos:", error);
      throw error;
    }
  }

  // Método para buscar un documento por su ID
  async findById(model, id) {
    try {
      return await model.findById(id);
    } catch (error) {
      console.error("Error al buscar por ID en la base de datos:", error);
      throw error;
    }
  }

  // Método genérico para obtener todos los documentos de un modelo
  async getAll(model) {
    try {
      return await model.find();
    } catch (error) {
      console.error(
        "Error al obtener todos los documentos de la base de datos:",
        error
      );
      throw error;
    }
  }

  // Método para actualizar una empresa en la base de datos
  async updateCompany(companyId, updateData) {
    try {
      const updatedCompany = await CompanyModel.findByIdAndUpdate(
        companyId,
        updateData,
        { new: true }
      );
      if (!updatedCompany) {
        throw new Error("Error al actualizar la empresa");
      }
      return updatedCompany;
    } catch (error) {
      console.error(
        "Error al actualizar la empresa en la base de datos:",
        error
      );
      throw error;
    }
  }

  // Método para actualizar un usuario en la base de datos (similar al de empresas)
  async updateUser(userId, updateData) {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        updateData,
        {
          new: true,
        }
      );
      if (!updatedUser) {
        throw new Error("Error al actualizar el usuario");
      }
      return updatedUser;
    } catch (error) {
      console.error(
        "Error al actualizar el usuario en la base de datos:",
        error
      );
      throw error;
    }
  }

  // Método genérico para actualizar un documento por ID
  async update(model, id, updateData) {
    try {
      return await model.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      console.error(
        "Error al actualizar el documento en la base de datos:",
        error
      );
      throw error;
    }
  }

  // Método genérico para eliminar un documento por ID
  async delete(model, id) {
    try {
      return await model.findByIdAndDelete(id);
    } catch (error) {
      console.error(
        "Error al eliminar el documento de la base de datos:",
        error
      );
      throw error;
    }
  }

  // Método para encontrar múltiples documentos que coincidan con una consulta
  async findMany(model, query) {
    try {
      return await model.find(query);
    } catch (error) {
      console.error(
        "Error al buscar múltiples documentos en la base de datos:",
        error
      );
      throw error;
    }
  }
}

export default Database;
