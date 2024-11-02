// models/company.js
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const CompanySchema = new Schema({
    company_Id: { 
        type: String, 
        unique: true, 
    },
    legal_Id: { 
        type: String, 
        required: true, 
        unique: true, 
    },
    name: { 
        type: String, 
        required: true,
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
    },
    password: { 
        type: String, 
        required: true, 
    },
    industry: {
         type: String 
        },
    size: { 
        type: String 
    },
    location: { 
        type: String,
        required: true, 
    },
    created_at: { 
        type: Date, 
        default: Date.now, 
    }
});

export default model('Company', CompanySchema);