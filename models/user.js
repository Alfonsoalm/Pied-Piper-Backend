import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"; // Importa el plugin

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    // Cambiado a un array para permitir múltiples profesiones
    professions: {
        type: [String], // Array de strings para múltiples profesiones
        required: true,
        default: [] // Opción de inicialización
    },
    role: {
        type: String,
        default: "role_user"
    },
    image: {
        type: String,
        default: "default.png"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Aplicar el plugin de paginación al esquema
UserSchema.plugin(mongoosePaginate);

export default model("UserModel", UserSchema, "users");
