import { Schema, model } from "mongoose";

const FollowSchema = new Schema({
    user: { type: Schema.ObjectId, ref: "UserModel" }, // Cambiado a "UserModel"
    followed: { type: Schema.ObjectId, ref: "UserModel" }, // Cambiado a "UserModel"
    created_at: { type: Date, default: Date.now },
});

export default model("Follow", FollowSchema, "follows");