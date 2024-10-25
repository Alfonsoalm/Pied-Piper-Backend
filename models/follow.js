// const {Schema, model} = require("mongoose");

// const FollowSchema = Schema({
//     user: {
//         type: Schema.ObjectId,
//         ref: "User"
//     },
//     followed: {
//         type: Schema.ObjectId,
//         ref: "User"
//     },
//     created_at: {
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = model("Follow", FollowSchema, "follows");

import { Schema, model } from "mongoose";

const FollowSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    followed: {
        type: Schema.ObjectId,
        ref: "User"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export default model("Follow", FollowSchema, "follows");