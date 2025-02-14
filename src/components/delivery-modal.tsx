import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { deliveryFormSchema as formSchema } from "@/schemas/delivery.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DeliveryMethod } from "@/types";

export type FormValues = z.infer<typeof formSchema>;

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => Promise<void>;
}

export function DeliveryModal({ isOpen, onClose, onSubmit }: DeliveryModalProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sendMethod: undefined,
      tracking: "",
      vehiclePlate: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const sendMethodValue = form.watch("sendMethod");
  const { setValue } = form;

  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para lidar com a mudança no Select de sendMethod
  const handleDeliveryMethodChange = useCallback((value: DeliveryMethod) => {
    setValue("sendMethod", value);
    if (value === DeliveryMethod.ONIBUS || value === DeliveryMethod.CORREIOS) {
      setValue("vehiclePlate", "");
    } else if (value === DeliveryMethod.FROTA_PROPRIA) {
      setValue("tracking", "");
    } else {
      setValue("tracking", "");
      setValue("vehiclePlate", "");
    }
  }, [setValue]);


  return (
    <Modal open={ isOpen } onClose={ onClose } title="Método de Envio">
      <Form { ...form }>
        <form onSubmit={ form.handleSubmit(handleSubmit) } className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={ form.control }
              name="sendMethod"
              render={ ({ field }) => (
                <FormItem>
                  <FormLabel>Método de Envio</FormLabel>
                  <Select
                    onValueChange={ (value: DeliveryMethod) => {
                      field.onChange(value); // Mantém a atualização normal do campo do react-hook-form
                      handleDeliveryMethodChange(value); // Chama a função para limpar outros campos
                    } }
                    defaultValue={ field.value }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o método de envio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ DeliveryMethod.ONIBUS }>Ônibus</SelectItem>
                      <SelectItem value={ DeliveryMethod.CORREIOS }>Correios</SelectItem>
                      <SelectItem value={ DeliveryMethod.FROTA_PROPRIA }>Frota Própria</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              ) }
            />

            {
              sendMethodValue === DeliveryMethod.ONIBUS && (
                <FormField
                  control={ form.control }
                  name="tracking"
                  render={ ({ field }) => (
                    <FormItem>
                      <FormLabel>Código de Rastreio</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o Código de rastreio (se houver) " { ...field } />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  ) }
                />
              )
            }

            { sendMethodValue === DeliveryMethod.CORREIOS && (
              <FormField
                control={ form.control }
                name="tracking"
                render={ ({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Rastreio (Correios)</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o código de rastreio" { ...field } />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) }
              />
            ) }

            { sendMethodValue === DeliveryMethod.FROTA_PROPRIA && (
              <FormField
                control={ form.control }
                name="vehiclePlate"
                render={ ({ field }) => (
                  <FormItem>
                    <FormLabel>Placa do Veículo (Frota Própria)</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a placa do veículo" { ...field } />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) } />
            )
            }
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <Button type="button" variant="outline" onClick={ onClose }>
              Cancelar
            </Button>
            <Button type="submit" disabled={ isLoading }>
              { isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" /> }
              Confirmar Método de Envio
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}