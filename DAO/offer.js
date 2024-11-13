import Database from "./database.js"; // Asegúrate de importar tu clase Database
import OfferModel from "../models/offer.js"; // Importa tu modelo de oferta

class Offer {
  constructor({
    title = "",
    description = [],
    company,
    location = "",
    salaryRange = { min: 0, max: 0 },
    workType = "onsite",
    schedule = { min: 0, max: 0 },
    jobFunctions = [],
    contractType = "temporary",
    targetUser,
    timeLimit = 0,
    status = "pending",
  } = {}) {
    this.title = title;
    this.description = description;
    this.company = company;
    this.location = location;
    this.salaryRange = salaryRange;
    this.workType = workType;
    this.schedule = schedule;
    this.jobFunctions = jobFunctions;
    this.contractType = contractType;
    this.targetUser = targetUser;
    this.timeLimit = timeLimit;
    this.status = status;
  }

  // Metodo para registrar una oferta
  async register() {
    try {
      const db = Database.getInstance();

      // Verificar si ya existe una oferta similar (opcional, según tu lógica de negocio)
      const existingOffer = await db.findOne(OfferModel, {
        title: this.title.toLowerCase(),
        company: this.company,
        targetUser: this.targetUser,
      });

      if (existingOffer) {
        return {
          status: "error",
          message: "La oferta ya existe para este usuario y empresa",
          statusCode: 409,
        };
      }

      // Registrar la oferta
      const offerStored = await db.registerOffer(this);
      return {
        status: "success",
        message: "Oferta registrada correctamente",
        offer: offerStored,
      };
    } catch (error) {
      console.error("Error al registrar la oferta:", error);
      return {
        status: "error",
        message: "Error en el registro de la oferta",
        statusCode: 500,
      };
    }
  }

  // Metodo para obtener la oferta por su Id
  static async getOfferById(id) {
    try {
      const db = Database.getInstance();
      const offer = await db.findById(OfferModel, id);
      return offer;
    } catch (error) {
      console.error("Error al obtener la oferta por ID:", error);
      throw new Error("Error al obtener la oferta");
    }
  }

  // Método para obtener todas las ofertas
  static async getAllOffers() {
    try {
      const db = Database.getInstance();
      const offers = await db.getAll(OfferModel);
      return offers;
    } catch (error) {
      console.error("Error al obtener todas las ofertas:", error);
      throw new Error("Error al obtener todas las ofertas");
    }
  }

  // Metodo para actualizar las ofertas
  static async updateOffer(offerId, offerData) {
    try {
      // Validaciones adicionales si es necesario
      // Puedes validar aquí si ciertos campos no deben cambiar, si es necesario
      if (offerData.company || offerData.targetUser) {
        delete offerData.company; // No permitimos cambiar la empresa
        delete offerData.targetUser; // No permitimos cambiar el usuario objetivo
      }

      // Instancia de base de datos
      const db = Database.getInstance();

      // Llamar al método genérico `update` de la base de datos
      const updatedOffer = await db.update(OfferModel, offerId, offerData);

      if (!updatedOffer) {
        return {
          status: "error",
          message: "Error al actualizar la oferta o la oferta no existe",
        };
      }
      return {
        status: "success",
        message: "Oferta actualizada correctamente",
        offer: updatedOffer,
      };
    } catch (error) {
      console.error("Error al actualizar la oferta:", error);
      throw new Error("Error en el proceso de actualización de la oferta");
    }
  }

  // Método para obtener ofertas dirigidas a un usuario específico
  static async getOffersForUser(userId) {
    try {
      const db = Database.getInstance();

      // Buscar ofertas donde el campo targetUser coincida con el userId proporcionado
      const offers = await db.findMany(OfferModel, { targetUser: userId });

      return offers;
    } catch (error) {
      console.error("Error al obtener ofertas para el usuario:", error);
      throw new Error("Error al obtener ofertas para el usuario");
    }
  }

  // Método para actualizar el estado de una oferta
  static async updateOfferStatus(offerId, status) {
    try {
      const db = Database.getInstance();

      // Validar si existe la oferta
      const existingOffer = await db.findById(OfferModel, offerId);
      if (!existingOffer) {
        return {
          status: "error",
          message: "Oferta no encontrada",
          statusCode: 404,
        };
      }

      // Actualizar solo el campo 'status'
      const updatedOffer = await db.update(OfferModel, offerId, { status });

      if (!updatedOffer) {
        return {
          status: "error",
          message: "Error al actualizar el estado de la oferta",
        };
      }

      return {
        status: "success",
        message: "Estado de la oferta actualizado correctamente",
        offer: updatedOffer,
      };
    } catch (error) {
      console.error("Error al actualizar el estado de la oferta:", error);
      throw new Error(
        "Error en el proceso de actualización del estado de la oferta"
      );
    }
  }
}

export default Offer;
