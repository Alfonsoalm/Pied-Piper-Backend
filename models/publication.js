import { Schema, model } from "mongoose";

const PublicationSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: "UserModel"  // Cambiado de "User" a "UserModel" para coincidir con el nombre del modelo exportado
    },
    text: {
        type: String,
        required: true
    },
    file: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});

export default model("PublicationModel", PublicationSchema, "publications");
