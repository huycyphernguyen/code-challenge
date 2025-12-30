import { Router } from "express";
import { UserController } from "./user-controller";
import { ConsoleLogger } from "../../shared/logger/console-logger";

export const createUserRouter = async () => {
  const logger = new ConsoleLogger();
  const controller = await UserController.create({ logger });

  const router = Router();

  router.get("/", controller.getAllUsers);

  router.get("/search", (req, res) =>
    controller.findUser(req, res)
  );

  router.post("/", controller.createUser);

  router.get("/:id", controller.getUser);

  router.put("/:id", controller.updateUser);

  router.delete("/:id", controller.deleteUser);

  return router;
};
