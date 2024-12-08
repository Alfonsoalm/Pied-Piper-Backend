import express from "express";
import check from "../middlewares/auth.js";
import Message from "../DAO/message.js"; // Importa el modelo o clase DAO de mensajes

const router = express.Router();

// Controlador: Enviar mensaje
const sendMessage = async (req, res) => {
  const { recipient, content } = req.body;

  try {
    console.log("Enviando mensaje con id:",req.user.id)
    const sender = req.user.id; // ID del usuario autenticado

    const message = new Message({
      sender,
      recipient,
      content,
    });

    const result = await message.send();
    return res.status(201).json({
      status: "success",
      message: "Mensaje enviado con éxito",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al enviar el mensaje",
      error: error.message,
    });
  }
};

// Controlador: Obtener conversación entre dos usuarios
const getConversation = async (req, res) => {
  const { userId } = req.params; // ID del otro usuario en la conversación
  const sender = req.user.id; // ID del usuario autenticado

  try {
    const messages = await Message.getConversation(sender, userId);
    return res.status(200).json({
      status: "success",
      data: messages,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener la conversación",
      error: error.message,
    });
  }
};

// Controlador: Obtener lista de conversaciones del usuario
const getConversations = async (req, res) => {
  const userId = req.user.id; // ID del usuario autenticado

  try {
    const conversations = await Message.getConversations(userId);
    return res.status(200).json({
      status: "success",
      data: conversations,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener las conversaciones",
      error: error.message,
    });
  }
};

// Controlador: Marcar un mensaje como leído
const markAsRead = async (req, res) => {
  const { messageId } = req.params;

  try {
    const updatedMessage = await Message.markAsRead(messageId);
    return res.status(200).json({
      status: "success",
      message: "Mensaje marcado como leído",
      data: updatedMessage,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al marcar el mensaje como leído",
      error: error.message,
    });
  }
};

// Ruta para enviar un mensaje
router.post("/send", check.auth, sendMessage);
// Ruta para obtener los mensajes con un usuario
router.get("/conversation/:userId", check.auth, getConversation); 
// Ruta para obtener todas las conversaciones de un usuario
router.get("/conversations", check.auth, getConversations); 
// Ruta para mercar un mensaje como leido
router.put("/read/:messageId", check.auth, markAsRead);

export default router;
