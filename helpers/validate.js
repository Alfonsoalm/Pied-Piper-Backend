// Backend/helpers/validate.js
import validator from "validator";

const validate = (params) => {
    // Validación inicial de campos requeridos
    if (!params.name || !params.email || !params.password || !params.nick) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar",
        });
    }

    let name = !validator.isEmpty(params.name) &&
        validator.isLength(params.name, { min: 3, max: undefined }) &&
        validator.isAlpha(params.name, "es-ES");

    let surname = !validator.isEmpty(params.surname) &&
        validator.isLength(params.surname, { min: 3, max: undefined }) &&
        validator.isAlpha(params.surname, "es-ES");

    let nick = !validator.isEmpty(params.nick) &&
        validator.isLength(params.nick, { min: 2, max: undefined });

    let email = !validator.isEmpty(params.email) &&
        validator.isEmail(params.email);

    let password = !validator.isEmpty(params.password);

    if(params.bio){
        let bio = validator.isLength(params.bio, { min: undefined, max: 255 });
        if (!bio) {
            throw new Error("No se ha superado la validación");
        } else {
            console.log("validacion superada");
        }
    }
   
    if (!name || !surname || !nick || !email || !password) {
        throw new Error("No se ha superado la validación");
    } else {
        console.log("validacion superada");
    }
}

export default validate;
