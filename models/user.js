import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"; // Importa el plugin

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: String,
    bio: String,
    nick: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
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
