import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const CompanySchema = new Schema({
    legal_id: { 
        type: String, 
        required: true, 
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
    sectors: {
        type: [String], // Array de strings que representarán los sectores de la empresa
        default: [], // Inicializa como un array vacío si no se proporcionan sectores
        required: true,
    },
    size: { 
        type: String,
    },
    location: { 
        type: String,
        required: true, 
    },
    website: { 
        type: String,
    },
    phone: { 
        type: String,
    },
    description: { 
        type: String,
    },
    created_at: { 
        type: Date, 
        default: Date.now, 
    }
});

export default model('CompanyModel', CompanySchema, 'companies');
