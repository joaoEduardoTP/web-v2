import { DeliveryMethod } from "@/types";
import { z } from "zod";

export const deliveryFormSchema = z.object({
  sendMethod: z.nativeEnum(DeliveryMethod, {
    required_error: "Selecione um método de envio.",
  }),
  tracking: z.string().optional(),
  vehiclePlate: z
    .string()
    .optional()
    .refine(
      (value) => {
        return value ? value.length > 0 : true;
      },
      {
        message: "Placa do veículo inválida.",
      }
    ),
});