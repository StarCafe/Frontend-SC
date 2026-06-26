import { z } from "zod";

export const createTableSchema = z.object({
  tableNumber: z.coerce.number().int().positive("Ingresa un numero de mesa valido"),
});

export type CreateTableFormValues = z.infer<typeof createTableSchema>;
