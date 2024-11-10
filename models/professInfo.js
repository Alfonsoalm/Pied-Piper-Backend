import { Schema } from "mongoose";

const ProfessionalInfoSchema = new Schema({
    experience_years: {
        type: Number,
        default: 0
    },
    knowledge_areas: {
        type: Map,
        of: Number,
        default: {}
    },
    salary_range: {
        type: [Number],
        validate: {
            validator: function (arr) {
                return arr.length === 2;
            },
            message: 'El rango salarial debe tener exactamente dos valores [min, max]'
        },
        default: [0, 0]
    },
    schedule_preference: {
        type: String,
        enum: ["full-time", "part-time", "any", "custom"],
        default: "any"
    },
    custom_schedule: {
        type: {
            hours_per_week: { type: Number, default: 0 },
            details: { type: String, default: "" }
        },
        default: null
    },
    titles: {
        type: [String],
        default: []
    },
    courses: {
        type: [String],
        default: []
    },
    preferred_locations: {
        type: [String],
        default: []
    },
    distance_range_km: {
        type: Number,
        default: 0
    },
    work_preference: {
        type: String,
        enum: ["remote", "onsite", "hybrid"],
        default: "remote"
    }
});

export default ProfessionalInfoSchema;
