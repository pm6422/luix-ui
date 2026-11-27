import { z } from "zod";

type HttpErrorWithResponse = Error & {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export function getErrorMessage(err: unknown): string {
  const unknownError = "Something went wrong, please try again later.";

  if (err instanceof z.ZodError) {
    return err.issues.map((issue) => issue.message).join("\n");
  }

  if (err instanceof Error) {
    const responseMessage = (err as HttpErrorWithResponse).response?.data?.message;
    return responseMessage ?? err.message;
  }

  return unknownError;
}
