import { Context } from "hono";
import { changeUsername, changePassword } from "../services/accountService";
import { uploadToCloudinary } from "../utils/cloudinary";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const uploadProfilePicture = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    const formData = await c.req.formData();
    const fileField = formData.get("file");

    if (!fileField || !(fileField instanceof File)) {
      return c.json({ error: "No valid file uploaded" }, 400);
    }

    if (fileField.type !== "image/jpeg" && fileField.type !== "image/png") {
      return c.json({ error: "Only JPEG and PNG files are allowed" }, 400);
    }

    const arrayBuffer = await fileField.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const result: any = await uploadToCloudinary(fileBuffer);
    if (!result || !result.secure_url) {
      return c.json({ error: "Failed to upload to Cloudinary" }, 500);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id }, // user.id from JWT
      data: { profilePicture: result.secure_url },
    });

    return c.json({
      message: "Mynd hlaðið upp",
      data: {
        cloudinaryUrl: result.secure_url,
        user: updatedUser,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Óþekkt villa";
    return c.json({ error: message }, 400);
  }
};

export const getProfilePicture = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    if (user.profilePicture) {
      return c.json({ url: user.profilePicture });
    } else {
      return c.json({
        message: "No profile picture found; using default.",
        url: "👤",
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ error: message }, 500);
  }
};

export const updateUsername = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    const { newUsername } = await c.req.json<{ newUsername: string }>();
    if (!newUsername) {
      return c.json({ error: "New username is required" }, 400);
    }

    const updatedUser = await changeUsername(user.id, newUsername);

    return c.json({
      message: "Notendanafni hefur verið breytt",
      data: updatedUser,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "óþekkt villa";
    return c.json({ error: message }, 400);
  }
};

export const updatePassword = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    const { currentPassword, newPassword } = await c.req.json<{
      currentPassword: string;
      newPassword: string;
    }>();

    if (!currentPassword || !newPassword) {
      return c.json({ error: "Current and new passwords are required" }, 400);
    }

    const updatedUser = await changePassword(user.id, currentPassword, newPassword);
    return c.json({ message: "Lykilorði hefur verið breytt", data: updatedUser });
  } catch (error) {
    const message = error instanceof Error ? error.message : "óþekkt villa";
    return c.json({ error: message }, 400);
  }
};
