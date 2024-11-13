import express from "express";
import Offer from "../DAO/offer.js";

const router = express.Router();

// Crear una oferta
const createOffer = async (req, res) => {
  try {
    const offerData = req.body;
    const offer = new Offer(offerData); // Crear una instancia de Offer
    const result = await offer.register(); // Llamar a register()

    // Responder basado en el resultado
    if (result.status === "success") {
      return res.status(201).json(result);
    } else {
      return res.status(result.statusCode || 500).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al crear la oferta",
      error: error.message,
    });
  }
};

// Obtener todas las ofertas
const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.getAllOffers();
    return res.status(200).json({
      status: "success",
      offerData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener las ofertas",
      error: error.message,
    });
  }
};

const updateOffer = async (req, res) => {
  const { id } = req.params; // ID de la oferta a actualizar
  const offerData = req.body; // Datos para actualizar

  try {
    const updateResult = await Offer.updateOffer(id, offerData);
    return res.status(200).json(updateResult);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Obtener una oferta específica por ID
const getOfferById = async (req, res) => {
  try {
    console.log("llega endpoint");
    const { id } = req.params;
    const offer = await Offer.getOfferById(id);
    if (!offer) {
      return res.status(404).json({
        status: "error",
        message: "Oferta no encontrada",
      });
    }
    return res.status(200).json({
      status: "success",
      offer,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener la oferta",
      error: error.message,
    });
  }
};

// Obtener ofertas para un usuario con base en su perfil (ej. profesión)
const getOffersForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const offers = await Offer.getOffersForUser(userId);
    return res.status(200).json({
      status: "success",
      offers,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener ofertas para el usuario",
      error: error.message,
    });
  }
};

// Eliminar una oferta (opcional)
const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOffer = await Offer.deleteOffer(id);
    if (!deletedOffer) {
      return res.status(404).json({
        status: "error",
        message: "Oferta no encontrada",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Oferta eliminada",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar la oferta",
      error: error.message,
    });
  }
};

// Actualizar el estado de una oferta (aceptar o rechazar)
const updateOfferStatus = async (req, res) => {
    try {
      const { id } = req.params; // ID de la oferta
      const { status } = req.body; // Nuevo estado proporcionado por el usuario
  
      // Validar que el estado proporcionado sea uno de los valores permitidos
      if (!["accepted", "rejected", "pending"].includes(status)) {
        return res.status(400).json({
          status: "error",
          message: "Estado no válido. Debe ser 'accepted', 'rejected' o 'pending'.",
        });
      }
  
      // Actualizar la oferta en la base de datos
      const updatedOffer = await Offer.updateOfferStatus(id, status);
  
      if (!updatedOffer) {
        return res.status(404).json({
          status: "error",
          message: "Oferta no encontrada.",
        });
      }
  
      return res.status(200).json({
        status: "success",
        message: "Estado de la oferta actualizado.",
        offer: updatedOffer,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Error al actualizar el estado de la oferta.",
        error: error.message,
      });
    }
  };

// Crear una oferta
router.post("/create", createOffer); // ok
// Obtener todas las ofertas
router.get("/list", getAllOffers); // ok
// Ruta para actualizar un usuario
router.put("/update/:id", updateOffer); // ok
// Obtener una oferta específica por ID  
router.get("/:id", getOfferById); // ok
// Obtener ofertas para un usuario con base en perfil y ubicación
router.get("/user/:userId", getOffersForUser); // ok
// Actualizar el estado de una oferta
router.patch("/status/:id", updateOfferStatus); // ok
// Eliminar una oferta (opcional)
router.delete("/:id", deleteOffer); // ok

export default router;