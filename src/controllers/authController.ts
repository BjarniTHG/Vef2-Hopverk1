import { Context } from "hono";
import { registerUser, loginUser } from "../services/authService";

export const register = async (c: Context) => {
  try {
    const { email, password } = await c.req.json<{ email: string; password: string }>();
    const user = await registerUser(email, password);
    return c.json({ message: "Aðgangur stofnaður", user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Óþekkt villa";
    return c.json({ error: message }, 400);
  }
};

export const login = async (c: Context) => {
  try {
    const { email, password } = await c.req.json<{ email: string; password: string }>();
    const user = await loginUser(email, password);
    return c.json({ message: "Notandi skráður inn", user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Óþekkt villa";
    return c.json({ error: message }, 400);
  }
};
