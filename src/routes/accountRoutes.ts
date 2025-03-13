import { Hono } from "hono";
import { uploadProfilePicture, updateUsername, updatePassword } from "../controllers/accountController";

const accountRoutes = new Hono();

accountRoutes.post("/upload", uploadProfilePicture);

accountRoutes.post("/update-username", updateUsername);

accountRoutes.post("/update-password", updatePassword);

export default accountRoutes;