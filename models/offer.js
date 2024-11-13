import mongoose, { Schema, model } from "mongoose";

const OfferSchema = new Schema({
    // Titulo del puesto ofrecido
    title: {
      type: String,
      required: true,
    },
    // Descripcion de las tareas
    description: {
      type: [String],
    },
    // Empresa que realiza la oferta
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyModel",
      required: true,
    },
    // Localizacion del puesto
    location: {
      type: String,
      required: true,
    },
    // Rango salarial ofrecido
    salaryRange: {
      min: { type: Number, required: false },
      max: { type: Number, required: false },
    },
    // Tipo de trabajo ofrecido
    workType: {
      type: String,
      enum: ["onsite", "remote", "hybrid", "custom"],
      required: true,
    },
    // Horario de trabajo
    schedule: {
      min: { type: Number },
      max: { type: Number },
    },
    // Funciones del trabajo
    jobFunctions: {
      type: [String],
    },
    // Tipo de contrato ofrecido
    contractType: {
      type: String,
      enum: ["temporary", "permanent", "rotational", "internship", "other"],
      required: true,
    },
    // Usuario al que se ofrece la oferta
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    // Limite de tiempo
    timeLimit: {
      type: Number,
    },
    // Estado de la solicitud
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    // Fecha de envio de oferta
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  export default model("OfferModel", OfferSchema, "offers");
