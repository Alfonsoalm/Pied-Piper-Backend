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
    image: { 
        type: String,
        default: "default.png", // Puedes establecer un valor predeterminado si deseas
    },
    // Token de verificación
    verificationToken: { 
        type: String, 
        default: null 
    }, 
    // Estado de verificación
    verified: { 
        type: Boolean, 
        default: false 
    }, 
    created_at: { 
        type: Date, 
        default: Date.now, 
    },
    reset_token: {
        type: String,
        default: null, // El token es nulo por defecto
    },
    reset_expires: {
        type: Date,
        default: null, // La expiración es nula por defecto
    },
});

export default model('CompanyModel', CompanySchema, 'companies');
