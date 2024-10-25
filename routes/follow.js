// const express = require("express");
// const router = express.Router();
// const FollowContoller = require("../controllers/follow");
// const check = require("../middlewares/auth");

import express from "express";
import FollowController from "../controllers/follow.js";
import check from "../middlewares/auth.js";
const router = express.Router();

// Definir rutas
router.get("/prueba-follow", FollowController.pruebaFollow);
router.post("/save", check.auth, FollowController.save);
router.delete("/unfollow/:id", check.auth, FollowController.unfollow);
router.get("/following/:id?/:page?", check.auth, FollowController.following);
router.get("/followers/:id?/:page?", check.auth, FollowController.followers);

// Exportar router
// module.exports = router;

// Exportar router
export default router;