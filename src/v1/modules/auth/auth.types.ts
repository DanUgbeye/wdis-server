import { z } from "zod";
import { userLoginSchema, userSignupSchema } from "./auth.validation";

// REQUEST DATA TYPES
// types with RB are for Request Body
// types with RP are for Request Params
// types with RQ are for Request Query

export type TUserLogin_RB = z.infer<typeof userLoginSchema.body>;
export type TUserSignup_RB = z.infer<typeof userSignupSchema.body>;
