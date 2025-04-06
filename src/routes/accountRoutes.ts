import { Hono } from "hono";
import { uploadProfilePicture, updateUsername, updatePassword, getProfilePicture } from "../controllers/accountController";
import { authenticate } from "../middleware/auth";

const accountRoutes = new Hono();

accountRoutes.use("*", authenticate);

accountRoutes.post("/upload", uploadProfilePicture);

accountRoutes.get("/profile-picture", getProfilePicture);

accountRoutes.post("/update-username", updateUsername);

accountRoutes.post("/update-password", updatePassword);

export default accountRoutes;