// Importar modelo
// const Follow = require("../models/follow");
// const User = require("../models/user");
import Follow from "../models/follow.js";
// Imprtar servicio
// const followService = require("../services/followService");
import followService from "../services/followService.js";
// Importar dependencias
// const mongoosePaginate = require("mongoose-pagination");
import mongoosePaginate from "mongoose-pagination";




// Acciones de prueba
const pruebaFollow = (req, res) => {

    document.querySelector()

    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/follow.js"
    });
}

// Accion de guardar un follow (accion seguir)
const save = (req, res) => {
    // Conseguir datos por body
    const params = req.body;

    // Sacar id del usuario identificado
    const identity = req.user;

    // Crear objeto con modelo follow
    let userToFollow = new Follow({
        user: identity.id,
        followed: params.followed
    });

    // Guardar objeto en bbdd
    userToFollow.save((error, followStored) => {

        if (error || !followStored) {
            return res.status(500).send({
                status: "error",
                message: "No se ha podido seguir al usuario"
            });
        }

        return res.status(200).send({
            status: "success",
            identity: req.user,
            follow: followStored
        });
    });
}

// Accion de borrar un follow (accion dejar de seguir)
const unfollow = (req, res) => {
    // Recoger el id del usuario identificado
    const userId = req.user.id;

    // Recoger el id del usuario que sigo y quiero dejar de seguir
    const followedId = req.params.id;

    // Find de las coincidencias y hacer remove
    Follow.find({
        "user": userId,
        "followed": followedId
    }).remove((error, followDeleted) => {

        if (error || !followDeleted) {
            return res.status(500).send({
                status: "error",
                message: "No has dejado de seguir a nadie"
            });
        }

        return res.status(200).send({
            status: "success",
            message: "Follow eliminado correctamente"
        });
    });


}

// Acción listado de usuarios que cualquier usuario está siguiendo (siguiendo)
const following = (req, res) => {
    // Sacar el id del usuario identificado
    let userId = req.user.id;

    // Comprobar si me llega el id por paramatro en url
    if (req.params.id) userId = req.params.id;

    // Comprobar si me llega la pagina, si no la pagina 1
    let page = 1;

    if (req.params.page) page = req.params.page;

    // Usuarios por pagina quiero mostrar
    const itemsPerPage = 5;

    // Find a follow, popular datos de los usuario y paginar con mongoose paginate
    Follow.find({user: userId})
        .populate("user followed", "-password -role -__v -email")
        .paginate(page, itemsPerPage, async (error, follows, total) => {

            // Listado de usuarios de trinity, y soy victor
            // Sacar un array de ids de los usuarios que me siguen y los que sigo como victor
            let followUserIds = await followService.followUserIds(req.user.id);

            return res.status(200).send({
                status: "success",
                message: "Listado de usuarios que estoy siguiendo",
                follows,
                total,
                pages: Math.ceil(total / itemsPerPage),
                user_following: followUserIds.following,
                user_follow_me: followUserIds.followers
            });
        })

}

// Acción listado de usuarios que siguen a cualquier otro usuario (soy seguido, mis seguidores)
const followers = (req, res) => {

    // Sacar el id del usuario identificado
    let userId = req.user.id;

    // Comprobar si me llega el id por paramatro en url
    if (req.params.id) userId = req.params.id;

    // Comprobar si me llega la pagina, si no la pagina 1
    let page = 1;

    if (req.params.page) page = req.params.page;

    // Usuarios por pagina quiero mostrar
    const itemsPerPage = 5;

    Follow.find({followed: userId})
        .populate("user", "-password -role -__v -email")
        .paginate(page, itemsPerPage, async (error, follows, total) => {

            let followUserIds = await followService.followUserIds(req.user.id);

            return res.status(200).send({
                status: "success",
                message: "Listado de usuarios que me siguen",
                follows,
                total,
                pages: Math.ceil(total / itemsPerPage),
                user_following: followUserIds.following,
                user_follow_me: followUserIds.followers
            });
        })
}

// Exportar acciones
// module.exports = {
export default {
    pruebaFollow,
    save,
    unfollow,
    following,
    followers
}