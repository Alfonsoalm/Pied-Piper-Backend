import mongoose from "mongoose";
import MessageModel from "../models/message.js";
import Database from "./database.js";

class Message {
  constructor({ sender, recipient, content }) {
    this.sender = sender;
    this.recipient = recipient;
    this.content = content;
  }

  // Método para enviar un mensaje
  async send() {
    const db = Database.getInstance();
    const message = new MessageModel({
      sender: this.sender,
      recipient: this.recipient,
      content: this.content,
    });
    return await message.save();
  }

  // Método estático para obtener conversación entre dos usuarios
  static async getConversation(userId1, userId2) {
    return await MessageModel.find({
      $or: [
        { sender: userId1, recipient: userId2 },
        { sender: userId2, recipient: userId1 },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name email")
      .populate("recipient", "name email");
  }

  static async getConversations(userId) {
    return await MessageModel.aggregate([
      {
        $match: {
          $or: [
            { sender: mongoose.Types.ObjectId(userId) },
            { recipient: mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $group: {
          _id: {
            conversationId: {
              $concat: [
                { $cond: [{ $lt: ["$sender", "$recipient"] }, { $toString: "$sender" }, { $toString: "$recipient" }] },
                "-",
                { $cond: [{ $lt: ["$sender", "$recipient"] }, { $toString: "$recipient" }, { $toString: "$sender" }] },
              ],
            },
          },
          lastMessage: { $last: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$lastMessage" },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "senderDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "recipient",
          foreignField: "_id",
          as: "recipientDetails",
        },
      },
      {
        $project: {
          _id: 1,
          sender: 1,
          recipient: 1,
          content: 1,
          createdAt: 1,
          updatedAt: 1,
          senderDetails: { $arrayElemAt: ["$senderDetails", 0] },
          recipientDetails: { $arrayElemAt: ["$recipientDetails", 0] },
        },
      },
    ]);
  }

  // Método estático para marcar un mensaje como leído
  static async markAsRead(messageId) {
    return await MessageModel.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true }
    );
  }
}

export default Message;
