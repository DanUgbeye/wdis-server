import { ZodError } from "zod";
import { FormattedZodError } from "./error.types";

export class ErrorUtility {
  formatZodError(error: ZodError): FormattedZodError {
    return error.issues.map((issue) => ({
      path: issue.path[0] as string,
      message: issue.message.toLocaleLowerCase(),
    }));
  }

  getFirstErrorMessage(error: FormattedZodError) {
    let errorIssue = error[0];

    return errorIssue.message
      .toLocaleLowerCase()
      .includes(errorIssue.path as string)
      ? errorIssue.message
      : `${String(errorIssue.path)} is ${
          errorIssue.message
        }`.toLocaleLowerCase();
  }
}

const errorUtility = new ErrorUtility();
export default errorUtility;
