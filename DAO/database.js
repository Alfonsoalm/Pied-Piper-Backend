// Backend/DAO/Database.js
import mongoose from "mongoose";
import UserModel from "../models/user.js";

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

  async findOne(model, query) {
    try {
      return await model.findOne(query);
    } catch (error) {
      console.error("Error al buscar en la base de datos:", error);
      throw error;
    }
  }



}

export default Database;