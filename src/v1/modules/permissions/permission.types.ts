export type PermissionEntities = "user" | "inventory";

export type PermissionScope = "read" | "create" | "update" | "delete";

export type AppPermissions = {
  [key in PermissionEntities]?: PermissionScope[];
};
