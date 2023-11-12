export type RequestValidationSchemas = {
  body?: Zod.Schema;
  query?: Zod.Schema;
  params?: Zod.Schema;
};
