import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import ProfessionalInfoSchema from "./professInfo.js"; // Importar el submodelo

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
    professions: {
        type: [String],
        required: true,
        default: []
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
    },
    birth_date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        default: ""
    },
    professional_info: {
        type: ProfessionalInfoSchema,
        default: {}
    }
});

// Aplicar el plugin de paginación al esquema
UserSchema.plugin(mongoosePaginate);

export default model("UserModel", UserSchema, "users");
