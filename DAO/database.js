// Backend/DAO/Database.js
import mongoose from "mongoose";
import UserModel from "../models/user.js";
import CompanyModel from "../models/company.js"; // Importamos el modelo de la empresa

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

  // Método para buscar un usuario o una empresa por ciertos criterios
  async findOne(model, query) {
    try {
      return await model.findOne(query);
    } catch (error) {
      console.error("Error al buscar en la base de datos:", error);
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
      console.error("Error al actualizar la empresa en la base de datos:", error);
      throw error;
    }
  }

  // Método para actualizar un usuario en la base de datos (similar al de empresas)
  async updateUser(userId, updateData) {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
        new: true,
      });
      if (!updatedUser) {
        throw new Error("Error al actualizar el usuario");
      }
      return updatedUser;
    } catch (error) {
      console.error("Error al actualizar el usuario en la base de datos:", error);
      throw error;
    }
  }
}

export default Database;
