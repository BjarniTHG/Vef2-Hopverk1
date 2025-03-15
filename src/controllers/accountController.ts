import { Context } from "hono";
import { changeUsername, changePassword } from "../services/accountService";
import { uploadToCloudinary } from "../utils/cloudinary";

export const uploadProfilePicture = async (c: Context) => {
    try {
      // Use Hono's formData() to parse the file upload
      const formData = await c.req.formData();
      const fileField = formData.get("file");
  
      if (!fileField || !(fileField instanceof File)) {
        return c.json({ error: "No valid file uploaded" }, 400);
      }
  
      // Validate file type: only allow JPEG and PNG
      if (fileField.type !== "image/jpeg" && fileField.type !== "image/png") {
        return c.json({ error: "Only JPEG and PNG files are allowed" }, 400);
      }
  
      // Convert the File to a Buffer
      const arrayBuffer = await fileField.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);
  
      // Upload the Buffer to Cloudinary using the upload stream
      const result = await uploadToCloudinary(fileBuffer);
  
      return c.json({ message: "Mynd hlaðið upp", data: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : "óþekkt villa";
      return c.json({ error: message }, 400);
    }
  };
  
export const updateUsername = async (c: Context) => {
    try {
        const { userId, newUsername } = await c.req.json<{ userId: number; newUsername: string }>();
        const updatedUser = await changeUsername(userId, newUsername);
        return c.json({ message: "Notendanafni hefur verið breytt", data: updatedUser });
    } catch (error) {
        const message = error instanceof Error ? error.message : "óþekkt villa";
        return c.json({ error: message }, 400);
    }
};

export const updatePassword = async (c: Context) => {
  try {
    const { userId, currentPassword, newPassword } = await c.req.json<{
      userId: number;
      currentPassword: string;
      newPassword: string;
    }>();
    const updatedUser = await changePassword(userId, currentPassword, newPassword);
    return c.json({ message: "Lykilorði hefur verið breytt", data: updatedUser });
  } catch (error) {
    const message = error instanceof Error ? error.message : "óþekkt villa";
    return c.json({ error: message }, 400);
  }
};