import mongoose, { Schema, model } from "mongoose";

const MessageSchema = new Schema(
  {
    sender: { type: Schema.ObjectId, ref: 'UserModel', required: true }, // ID del remitente
    recipient: { type: Schema.ObjectId, ref: 'UserModel', required: true }, // ID del destinatario
    content: { type: String, required: true }, // Contenido del mensaje
    isRead: { type: Boolean, default: false }, // Estado de lectura del mensaje
    sentAt: { type: Date, default: Date.now }, // Fecha de envío
  },
  {
    timestamps: true, // Crea automáticamente `createdAt` y `updatedAt`
  }
);

export default model("MessageModel", MessageSchema, "messages");
