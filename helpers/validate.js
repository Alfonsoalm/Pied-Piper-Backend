import validator from "validator";

// Función para validar usuarios
export const validateUser = (params) => {
    if (!params.name || !params.email || !params.password || !params.professions) {
        throw new Error("Faltan datos por enviar");
    }
    let name = !validator.isEmpty(params.name) &&
        validator.isLength(params.name, { min: 3 }) &&
        validator.matches(params.name, /^[a-zA-Z\sÀ-ÿ]+$/);

    let surname = !validator.isEmpty(params.surname) &&
        validator.isLength(params.surname, { min: 3 }) &&
        validator.matches(params.surname, /^[a-zA-Z\sÀ-ÿ]+$/);

    let email = !validator.isEmpty(params.email) &&
        validator.isEmail(params.email);

    let password = !validator.isEmpty(params.password);

    let professions = Array.isArray(params.professions) && params.professions.length > 0;

    if (params.bio) {
        let bio = validator.isLength(params.bio, { max: 255 });
        if (!bio) {
            throw new Error("La biografía no debe superar los 255 caracteres");
        }
    }

    // Validación de la fecha de nacimiento (birth_date)
    if (params.birth_date) {
        let birthDate = validator.isDate(params.birth_date);
        if (!birthDate) {
            throw new Error("La fecha de nacimiento no es válida");
        }
    }

    // Validación de residencia habitual (location)
    if (params.location) {
        let location = !validator.isEmpty(params.location) &&
            validator.isLength(params.location, { min: 2 });
        if (!location) {
            throw new Error("La residencia habitual no es válida");
        }
    }

    if (!name || !surname || !email || !password || !professions) {
        throw new Error("No se ha superado la validación");
    }

    console.log("Validación de usuario superada");
};

// Función para validar empresas
export const validateCompany = (params) => {
    if (!params.name || !params.email || !params.password || !params.sectors) {
        throw new Error("Faltan datos por enviar");
    }
    let name = !validator.isEmpty(params.name) &&
        validator.isLength(params.name, { min: 3, max: undefined });

    let email = !validator.isEmpty(params.email) &&
        validator.isEmail(params.email);

    let password = !validator.isEmpty(params.password);

    let sectors = Array.isArray(params.sectors) && params.sectors.length > 0;

    if (!name || !email || !password || !sectors) {
        throw new Error("No se ha superado la validación");
    } else {
        console.log("Validación de empresa superada");
    }
};
