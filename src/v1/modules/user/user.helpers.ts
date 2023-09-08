import { UserDocument } from "./user.types";

const USER_SENSITIVE_FIELDS = ["password", "disabled", "__v"] as const;

export class UserHelpers {
  /** removes sensitive fields from a user object */
  filter(user: UserDocument) {
    let filtered: Omit<UserDocument, keyof typeof USER_SENSITIVE_FIELDS> = {
      ...user.toObject(),
    };

    USER_SENSITIVE_FIELDS.forEach((field) => {
      if (filtered[field] !== undefined) {
        delete filtered[field];
      }
    });

    return filtered;
  }
}

const userHelpers = new UserHelpers();
export default userHelpers;
