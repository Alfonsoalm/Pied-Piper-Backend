// Backend/DAO/follow.js
import FollowModel from "../models/follow.js";
import followService from "../services/followService.js";
import Database from "./database.js";
import UserModel from "../models/user.js";

class Follow {
  
  // Guardar un follow
  static async save(data) {
    try {
      const db = Database.getInstance();
      const follow = new FollowModel(data);
      const followStored = await follow.save();
      return {
        status: "success",
        follow: followStored,
      };
    } catch (error) {
      throw new Error("No se ha podido seguir al usuario");
    }
  }

  // Eliminar un follow
  static async unfollow(userId, followedId) {
    try {
      const db = Database.getInstance();
      const result = await FollowModel.deleteOne({ user: userId, followed: followedId });
      if (result.deletedCount === 0) throw new Error("No has dejado de seguir a nadie");
      return {
        status: "success",
        message: "Follow eliminado correctamente",
      };
    } catch (error) {
      throw new Error("Error al dejar de seguir al usuario");
    }
  }

  // Listado de usuarios que un usuario sigue
  static async following(userId, page = 1, itemsPerPage = 5) {
    try {
      const db = Database.getInstance();
      const follows = await FollowModel.find({ user: userId })
        .populate("user followed", "-password -role -__v -email")
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
      const total = await FollowModel.countDocuments({ user: userId });
      const followUserIds = await followService.followUserIds(userId);

      return {
        follows,
        total,
        pages: Math.ceil(total / itemsPerPage),
        user_following: followUserIds.following,
        user_follow_me: followUserIds.followers,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el listado de usuarios seguidos");
    }
  }

  // Listado de seguidores de un usuario
  static async followers(userId, page = 1, itemsPerPage = 5) {
    try {
      const db = Database.getInstance();
      const follows = await FollowModel.find({ followed: userId })
        .populate("user", "-password -role -__v -email")
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
      const total = await FollowModel.countDocuments({ followed: userId });
      const followUserIds = await followService.followUserIds(userId);

      return {
        follows,
        total,
        pages: Math.ceil(total / itemsPerPage),
        user_following: followUserIds.following,
        user_follow_me: followUserIds.followers,
      };
    } catch (error) {
      throw new Error("Error al obtener el listado de seguidores");
    }
  }
}

export default Follow;
