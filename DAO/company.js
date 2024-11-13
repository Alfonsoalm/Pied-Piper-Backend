// Backend/DAO/company.js
import bcrypt from "bcryptjs";
import jwt from "../services/jwt.js";
import CompanyModel from "../models/company.js";
import Database from "./database.js";

class Company {
  constructor({
    legal_id = "",
    name = "",
    email = "",
    password = "",
    sectors = "",
    size = "",
    location = "",
    website = "",
    phone = "",
    description = "",
  } = {}) {
    this.legal_id = legal_id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.sectors = sectors;
    this.size = size;
    this.location = location;
    this.website = website;
    this.phone = phone;
    this.description = description;
    console.log("Instancia Empresa creada");
  }

  async register() {
    try {
      const db = Database.getInstance();
      // Control de empresas duplicadas
      const existingCompany = await db.findOne(CompanyModel, {
        $or: [
          { email: this.email.toLowerCase() },
          { legal_id: this.legal_id.toLowerCase() },
        ],
      });

      if (existingCompany) {
        return {
          status: "error",
          message: "La empresa ya existe",
          statusCode: 409,
        };
      }

      // Cifrar la contraseña antes de guardarla
      if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
      }

      // Guardar empresa en la base de datos
      const companyStored = await db.registerCompany(this);

      return {
        status: "success",
        message: "Empresa registrada correctamente",
        company: {
          id: companyStored._id,
          name: companyStored.name,
          email: companyStored.email,
          legal_id: companyStored.legal_id,
        },
      };
    } catch (error) {
      console.error("Error al registrar empresa:", error);
      return {
        status: "error",
        message: "Error en el registro de la empresa",
        statusCode: 500,
      };
    }
  }

  async login(companyData) {
    try {
      const db = Database.getInstance(); // Esto llama al constructor y, a su vez, al método connect()
      // Buscar la empresa en la base de datos
      const company = await db.findOne(CompanyModel, {
        email: companyData.email,
      });
      if (!company) {
        return {
          status: "error",
          message: "No existe la empresa",
          statusCode: 404,
        };
      }
      console.log("Email ingresado:", companyData.email);
      console.log("Contraseña ingresada:", companyData.password);
      console.log("Contraseña almacenada en DB:", company.password);

      // Verificar la contraseña
      const pwdMatch = await bcrypt.compare(
        companyData.password,
        company.password
      );
      
      console.log("Resultado de comparación:", pwdMatch);
      
      if (!pwdMatch) {
        return {
          status: "error",
          message: "Contraseña incorrecta",
          statusCode: 400,
        };
      }

      // Generar token si la autenticación es exitosa
      const token = jwt.createToken(company);

      return {
        status: "success",
        message: "Empresa identificada correctamente",
        user: {
          id: company._id,
          name: company.name,
          email: company.email,
          legal_id: company.legal_id,
          isCompany: true, // Asegurarse de enviar false para los usuarios
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

  async updateProfile(companyId, companyToUpdate) {
    try {
      const db = Database.getInstance(); // Esto llama al constructor y, a su vez, al método connect()
      console.log("Intentando conectarse a bbdd");
      // Actualizar la empresa en la base de datos
      const updatedCompany = await CompanyModel.findByIdAndUpdate(
        companyId,
        companyToUpdate,
        { new: true }
      );

      if (!updatedCompany) {
        return {
          status: "error",
          message: "Error al actualizar la empresa",
        };
      }

      return {
        status: "success",
        message: "Perfil de empresa actualizado correctamente",
        company: updatedCompany,
      };
    } catch (error) {
      console.error("Error al actualizar la empresa:", error);
      return {
        status: "error",
        message: "Error en el proceso de actualización",
      };
    }
  }

  static async getProfile(companyId) {
    try {
      const db = Database.getInstance(); // Esto llama al constructor y, a su vez, al método connect()
      console.log("Intentando conectarse a bbdd");
      const companyProfile = await CompanyModel.findById(companyId).select(
        "-password -__v"
      );
      if (!companyProfile) {
        throw new Error("No se encontró la empresa");
      }
      console.log("companytProfile", companyProfile);
      return companyProfile;
    } catch (error) {
      console.error("Error al obtener el perfil de la empresa:", error);
      throw new Error("Error al obtener el perfil de la empresa");
    }
  }

  // Obtener los contadores de la empresa
  static async getCounters(companyId) {
    try {
      // Como no hay relaciones de seguimiento para empresas, devolvemos valores estáticos.
      return {
        companyId,
        following: 0, // Ninguna empresa sigue a otras
        followed: 0, // Ninguna empresa tiene seguidores
        publications: 0, // Por ahora, sin publicaciones asociadas
      };
    } catch (error) {
      console.error("Error al obtener los contadores de la empresa:", error);
      throw new Error("Error al obtener los contadores de la empresa");
    }
  }

  static async setCompanyImg(companyId, file) {
    if (!file) {
      throw new Error("No se ha proporcionado ninguna imagen");
    }
    const db = Database.getInstance(); // Esto llama al constructor y, a su vez, al método connect()
    console.log("Intentando conectarse a bbdd");
    // Obtener la extensión del archivo
    const image = file.originalname;
    const imageSplit = image.split(".");
    const extension = imageSplit[1].toLowerCase();

    // Validar extensión
    const validExtensions = ["png", "jpg", "jpeg", "gif"];
    if (!validExtensions.includes(extension)) {
      fs.unlinkSync(file.path); // Eliminar el archivo si la extensión no es válida
      throw new Error("Extensión de archivo inválida");
    }

    try {
      // Actualizar el avatar en la base de datos
      const companyUpdated = await CompanyModel.findByIdAndUpdate(
        companyId,
        { image: file.filename }, // Guardar solo el nombre de archivo
        { new: true }
      );

      if (!companyUpdated) {
        throw new Error("Error en la subida del avatar");
      }

      return {
        status: "success",
        company: companyUpdated,
        file,
      };
    } catch (error) {
      console.error("Error al subir el avatar:", error);
      throw new Error("Error al subir el avatar");
    }
  }

  static async getCompanyImg(file) {
    const db = Database.getInstance(); // Esto llama al constructor y, a su vez, al método connect()
    console.log("Intentando conectarse a bbdd");
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

  // Obtener todas las empresas
  static async getAllCompanies() {
    try {
      const db = Database.getInstance(); // Esto llama al constructor y, a su vez, al método connect()
      console.log("Intentando conectarse a bbdd");
      // Aquí podemos filtrar y seleccionar solo los campos necesarios
      const companies = await CompanyModel.find().select("name sectors");
      return companies;
    } catch (error) {
      console.error("Error al obtener la lista de empresas:", error);
      throw new Error("Error al obtener las empresas");
    }
  }

  // Obtener empresas segun el sector
  static async getCompaniesBySector(sector) {
    try {
      // Buscar empresas que tengan el sector solicitado
      const companies = await CompanyModel.find({ sectors: sector }).select(
        "name location sectors size website phone description image"
      ); // Puedes ajustar los campos que quieres devolver
      return companies;
    } catch (error) {
      console.error("Error al obtener empresas por sector:", error);
      throw new Error("Error al obtener empresas por sector");
    }
  }
  
}

export default Company;
