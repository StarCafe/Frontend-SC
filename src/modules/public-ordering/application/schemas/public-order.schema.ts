import { z } from "zod";

export const publicOrderSchema = z.object({
  customerName: z.string().min(2, "Ingresa tu nombre"),
});

export type PublicOrderFormValues = z.infer<typeof publicOrderSchema>;
