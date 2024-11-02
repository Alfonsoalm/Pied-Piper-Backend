// models/jobOffer.js

// Por hacer
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const OfferSchema = new Schema({
    company: { 
        type: Schema.ObjectId, 
        ref: 'Company', 
        required: true
    },
    title: { 
        type: String, 
        required: true
    },
    description: String,
    salary: Number,
    required_skills: [{
         type: String 
        }],
    employment_type: { 
        type: String, 
        enum: ['Full-Time', 'Part-Time', 'Freelance', 'Contract'] 
    },
    location: String,
    applicants: [{ 
        type: Schema.ObjectId, 
        ref: 'User' 
    }],
    created_at: { 
        type: Date, 
        default: Date.now 
    }
});

export default model('Offer', OfferSchema);
