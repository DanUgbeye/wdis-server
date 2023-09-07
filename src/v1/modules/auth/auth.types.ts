import { z } from "zod";
import { userLoginSchema, userSignupSchema } from "./auth.validation";

// REQUEST BODY TYPES
export type TUserLogin = z.infer<typeof userLoginSchema.body>;
export type TUserSignup = z.infer<typeof userSignupSchema.body>;

export type PermissionEntities = "user" | "inventory";

export type PermissionScope = "read" | "create" | "update" | "delete";

export type AppPermissions = {
  [key in PermissionEntities]?: PermissionScope[];
};
