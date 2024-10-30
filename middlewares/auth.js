// Importar modulos
import jwt from "jwt-simple";
import moment from "moment";
import libjwt from "../services/jwt.js";
const secret = libjwt.secret;

// MIDDLEWARE de autenticacion
// exports.auth = (req, res, next) => {
const auth = (req, res, next) => {
    // Comprobar si me llega la cabecera de auth
    if(!req.headers.authorization){
        return res.status(403).send({
            status: "error",
            message: "La petición no tiene la cabecera de autenticación"
        });
    }

    // limpiar el token
    let token = req.headers.authorization.replace(/['"]+/g, '');

    // Decodificar token
    try{
        let payload = jwt.decode(token, secret);

        // Comprobar expiracion del token
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                status: "error",
                message: "Token expirado",
            });
        }

        // Agregar datos de usuario a request
        req.user = payload;

    }catch(error){
        return res.status(404).send({
            status: "error",
            message: "Token invalido",
            error
        });
    }

    // Pasar a ejecucion de accion
    next();
}

export default { auth };

