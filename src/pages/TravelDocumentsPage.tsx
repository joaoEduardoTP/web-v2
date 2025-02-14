import { Alert } from '@/components/alert';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, FileText, Loader2 } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { documentService as apiDocumentService } from '@/services/api';

import DataTable from '@/components/data-table';
import { documentColumns } from '@/components/document-columns';
import SuccessModal from '@/components/success-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import { SendDocumentFilters, TravelDocument } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo, useState } from 'react'; // Import useCallback aqui
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from '@tanstack/react-router';

const REGEX_MERCOSUL = /^[a-zA-Z]{3}[0-9][A-Za-z0-9][0-9]{2}$/;

const formSchema = z.object({
  identifier: z.string().optional(),
  vehiclePlate: z
    .string()
    .optional().refine(
      (value) => {
        return value ? REGEX_MERCOSUL.test(value) : true;
      },
      {
        message: "Placa do veículo deve ter 7 caracteres.",
      }
    ),
  baseId: z.string({
    required_error: "Selecione uma base de entrega.",
  }).min(1, {
    message: "Selecione uma base de entrega.",
  }),
});

export function TravelDocumentsPage() {

  const credentials = useAuthStore((state) => state.user);
  if (!credentials) return null;

  const { user, bases } = credentials;

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      vehiclePlate: "",
      baseId: String(bases[0]?.id) || "",
    },
  });

  const queryClient = useQueryClient();

  const [currentFilters, setCurrentFilters] = useState<SendDocumentFilters>({
    identifier: "",
    vehiclePlate: "",
    baseId: String(bases[0]?.id) || "",
  });

  const [selectedDocuments, setSelectedDocuments] = useState<TravelDocument[]>([]);
  const [parentRowSelection, setParentRowSelection] = useState({});
  const [isDataTableLoading, setIsDataTableLoading] = useState(false);
  // const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false); // New loading modal state

  const {
    data: documents = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<TravelDocument[], Error>({
    queryKey: ["travel-documents", currentFilters],
    queryFn: async () => {
      console.log("Query travel-documents queryFn executando com filtros:", currentFilters);
      setIsDataTableLoading(true);
      try {
        return await apiDocumentService.getTravelDocuments(currentFilters);
      } finally {
        setIsDataTableLoading(false);
      }
    },
    enabled: false,
  });

  const searchDocuments = useMutation({
    mutationFn: (filters: SendDocumentFilters) =>
      apiDocumentService.getTravelDocuments(filters),
    onSuccess: (data) => {
      queryClient.setQueryData(["travel-documents"], data);
      refetch();
    },
  });

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [documentsToConfirm, setDocumentsToConfirm] = useState<TravelDocument[]>([]);
  const documentColumnsMemoized = useMemo(() => documentColumns, []);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const isValid = form.trigger();

    if (!isValid) return;

    const filtersToSend: SendDocumentFilters = {
      identifier: data.identifier || "",
      vehiclePlate: data.vehiclePlate?.toUpperCase() || "",
      baseId: String(bases[0]?.id) || "",
    };

    setCurrentFilters(filtersToSend);
    searchDocuments.mutate(filtersToSend);
  };

  const { watch } = form;
  const vehiclePlateValue = watch("vehiclePlate");
  const identifierValue = watch("identifier");

  const sendDocumentsMutation = useMutation({
    mutationFn: apiDocumentService.sendDocuments,
    onSuccess: async () => {
      console.log("Mutation sendDocuments onSuccess chamado!");

      await queryClient.invalidateQueries({ queryKey: ["travel-documents", currentFilters] });
      console.log("InvalidateQueries travel-documents com filtros:", currentFilters);

      // setTimeout(() => { // Introduce a delay of 5 seconds
      //   setIsLoadingModalOpen(false); // Close loading modal after delay
      //   setIsSuccessModalOpen(true); // Open success modal
      //   setSelectedDocuments([]);
      // }, 5000); // 5000 milliseconds = 5 seconds

    },
    onError: (error) => {
      // setTimeout(() => { // Introduce a delay of 5 seconds even on error
      //   setIsLoadingModalOpen(false); // Ensure loading modal is closed after delay even on error
      // }, 5000);
      console.error("Erro ao enviar documentos Mutation:", error);
    },
  });

  const handleSelectionChange = useCallback((selectedItems: TravelDocument[]) => {
    setSelectedDocuments(selectedItems);
  }, [setSelectedDocuments]);


  const handleSendSelected = () => {
    if (selectedDocuments.length === 0) {
      alert("Selecione ao menos um documento para enviar.");
      return;
    }
    setDocumentsToConfirm(selectedDocuments);
    setIsConfirmationOpen(true);
  };

  const handleConfirmSendDocuments = async () => {
    setIsConfirmationOpen(false); // Close confirmation modal immediately
    // setIsLoadingModalOpen(true); // Open loading modal

    try {
      console.log("Enviando documentos...", documentsToConfirm);
      const payload = {
        documents: documentsToConfirm,
        receiptDate: new Date().toISOString(),
        baseId: String(bases[0]?.id) || "",
        receiptEmail: user.email_login,
      };

      await sendDocumentsMutation.mutateAsync(payload);

      console.log("Enviado! ...");
    } catch (error) {

      console.error("Erro ao enviar os documentos:", error);
    } finally {
      // refetch is awaited in onSuccess of mutation
      setParentRowSelection({});
      console.log("Documentos enviados com sucesso!", documentsToConfirm);
      form.reset();
    }
  };

  const handleCancelConfirmation = () => {
    console.log("Cancelar envio de documentos");
    setIsConfirmationOpen(false);
    setDocumentsToConfirm([]);
  };

  const handleConfirmMoreDocuments = () => {
    console.log('Confirmar mais documentos');
    setIsSuccessModalOpen(false);
    form.reset();
    // setSelectedDocuments([]);
  };

  const handleCloseSuccessModal = () => {
    console.log('Fechar modal de sucesso');
    setIsSuccessModalOpen(false);
    // setSelectedDocuments([]);
    navigate({ to: "/" });
  };

  return (
    user && bases && (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <FileText className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-foreground">
            Recebimento de Documentos de Viagem
          </h1>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <Form { ...form }>
            <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Identifier (Romaneio) Number Field */ }
                <FormField
                  control={ form.control }
                  name="identifier"
                  render={ ({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Número do Identificador (Romaneio)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o número do Identificador (Romaneio)"
                          { ...field }
                          disabled={ !!vehiclePlateValue }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  ) }
                />

                {/* Vehicle Plate Field */ }
                <FormField
                  control={ form.control }
                  name="vehiclePlate"
                  render={ ({ field }) => (
                    <FormItem>
                      <FormLabel>Placa do Veículo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ABC1234"
                          { ...field }
                          disabled={ !!identifierValue }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  ) }
                />
              </div>

              {/* Submit Button */ }
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={ searchDocuments.isPending }
                >
                  { searchDocuments.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) }
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Buscar Documentos
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Data Table */ }
        <div className="mb-8">
          { isLoading && <div>Carregando documentos...</div> }
          { isError && <div>Erro ao buscar.</div> }
          <DataTable
            columns={ documentColumnsMemoized }
            data={ documents }
            onRowSelectionChangeParent={ handleSelectionChange }
            parentRowSelection={ parentRowSelection }
            setParentRowSelection={ setParentRowSelection }
          // tableLoading={ isDataTableLoading }
          />
        </div>

        {/* Send Selected Button (Outside DataTable) */ }
        <div className="flex justify-end mb-8">
          <Button
            variant="default"
            onClick={ handleSendSelected }
            disabled={ selectedDocuments.length === 0 || sendDocumentsMutation.isPending || isDataTableLoading  }
          >
            { sendDocumentsMutation.isPending || isDataTableLoading  && <Loader2 className="mr-2 h-4 w-4 animate-spin" /> }
            Enviar Selecionados ({ selectedDocuments.length })
          </Button>
        </div>

        {/* Success Modal */ }
        <SuccessModal
          isOpen={ isSuccessModalOpen }
          onClose={ handleCloseSuccessModal }
          onConfirm={ handleConfirmMoreDocuments }
        />

        {/* Confirmation / Loading Modal */ }
        {/* <Alert
          isOpen={ isLoadingModalOpen } // Show only when loading modal is open
          onOpenChange={ setIsLoadingModalOpen } // Control isOpen with setIsLoadingModalOpen
          title={ "Enviando Documentos..." } // Title for loading state
          desc={ "Aguarde enquanto os documentos são enviados e a lista é atualizada." } // Description for loading state
          onConfirm={ handleConfirmSendDocuments } // Keep the handlers, but they might not be used in loading state
          onCancel={ handleCancelConfirmation }
          confirmButtonText="Confirmar Envio"
          cancelButtonText="Cancelar"
          loading={ sendDocumentsMutation.isPending && isLoadingModalOpen } // Indicate loading state to Alert
          disabledConfirm={ sendDocumentsMutation.isPending || isLoadingModalOpen } // Disable confirm button
          disabledCancel={ sendDocumentsMutation.isPending || isLoadingModalOpen } // Disable cancel button
          showCancelButton={ false } // Hide Cancel button during loading
          showConfirmButton={ false } // Hide Confirm button during loading
        /> */}

        {/* Confirmation Modal (Shown before Loading) */ }
        <Alert
          isOpen={ isConfirmationOpen  } // Show only when confirmation is open and NOT loading
          onOpenChange={ setIsConfirmationOpen } // Control isOpen with setIsConfirmationOpen
          title="Confirmar Envio"
          desc={ `Deseja enviar ${ documentsToConfirm.length } documento(s)?` }
          onConfirm={ handleConfirmSendDocuments }
          onCancel={ handleCancelConfirmation }
          confirmButtonText="Confirmar Envio"
          cancelButtonText="Cancelar"
          showCancelButton={ true } // Show Cancel button for confirmation
          showConfirmButton={ true } // Show Confirm button for confirmation
        />
      </div>
    )
  );
}