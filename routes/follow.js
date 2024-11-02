// Backend/routes/follow.js
import express from "express";
import check from "../middlewares/auth.js";
import Follow from "../DAO/follow.js";

const router = express.Router();

// Controlador para guardar un follow
const saveFollow = async (req, res) => {
  const params = req.body;
  const identity = req.user;

  try {
    const response = await Follow.save({ user: identity.id, followed: params.followed });
    return res.status(200).json({
      status: "success",
      identity,
      follow: response.follow,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Controlador para eliminar un follow
const unfollow = async (req, res) => {
  const userId = req.user.id;
  const followedId = req.params.id;

  try {
    const response = await Follow.unfollow(userId, followedId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Controlador para listar usuarios que un usuario sigue
const getFollowing = async (req, res) => {
  let userId = req.user.id;
  if (req.params.id) userId = req.params.id;
  const page = req.params.page || 1;

  try {
    const response = await Follow.following(userId, page);
    return res.status(200).json({
      status: "success",
      message: "Listado de usuarios que sigo",
      ...response,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Controlador para listar seguidores de un usuario
const getFollowers = async (req, res) => {
  let userId = req.user.id;
  if (req.params.id) userId = req.params.id;
  const page = req.params.page || 1;

  try {
    const response = await Follow.followers(userId, page);
    return res.status(200).json({
      status: "success",
      message: "Listado de seguidores",
      ...response,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Ruta para seguir a un usuario
router.post("/save", check.auth, saveFollow);
// Ruta para dejar de seguir a un usuario
router.delete("/unfollow/:id", check.auth, unfollow);
// Ruta para listar los usuarios seguidos por un usuario, con paginación opcional
router.get("/following/:id?/:page?", check.auth, getFollowing);
// Ruta para listar los seguidores de un usuario, con paginación opcional
router.get("/followers/:id?/:page?", check.auth, getFollowers);

export default router;
