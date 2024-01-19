import { schemas } from "../shared/schema";
import { z } from "zod";

export const inferData = <T extends keyof typeof schemas>(
  action: T,
  data: unknown
): z.infer<typeof schemas[T]> => {
  const schema = schemas[action];
  const validationResult = schema.safeParse(data);
  if (!validationResult.success) {
    throw new Error("Validation error");
  }
  return validationResult.data;
};
