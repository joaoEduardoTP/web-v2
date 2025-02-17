import { Alert } from '@/components/alert';
import DataTable from '@/components/data-table';
import { DeliveryModal, FormValues } from '@/components/delivery-modal';
import { documentColumns } from '@/components/document-columns';
import SuccessModal from '@/components/success-modal';
import { Button } from "@/components/ui/button";
import { documentService as apiDocumentService } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { DeliveryData, TravelDocument } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Loader2, RefreshCw } from 'lucide-react';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';

export function SendDocumentsPage() {
  const queryClient = useQueryClient();
  const credentials = useAuthStore((state) => state.user);
  if (!credentials) {
    return null;
  }
  const { user, bases } = credentials;
  const baseId = String(bases[0]?.id);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<TravelDocument[]>([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [deliveryMethodData, setDeliveryMethodData] = useState<FormValues | null>();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [parentRowSelection, setParentRowSelection] = useState({});
  const navigate = useNavigate();

  const { data: registeredDocuments = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["registered-documents", baseId],
    queryFn: async () => {
      if (!baseId) throw new Error("BaseId não encontrado.");
      const response = await apiDocumentService.getRegisteredDocumentsByBase(baseId);
      return response;
    },
    enabled: !!baseId,
  });


  useEffect(() => {
    refetch();
  }, []);


  const onSubmitDeliveryMethod = async (data: FormValues) => {
    setDeliveryMethodData(data);
    setIsDeliveryModalOpen(false);
    setIsConfirmationOpen(true);
  };

  const dispatchDocumentsMutation = useMutation({
    mutationFn: async (data: DeliveryData) => {
      const response = await apiDocumentService.dispatchDocuments(data);
      return response;
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["registered-documents", baseId] });
      setIsSuccessModalOpen(true);
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
    setIsDeliveryModalOpen(true);
  };

  const handleConfirmSendDocuments = async () => {
    if (!baseId || !deliveryMethodData) return;
    // console.log('Dados de entrega:', selectedDocuments);
    const documentsToSend = selectedDocuments.map((doc) => doc.identifier);

    const deliveryData: DeliveryData = {
      identifiers: documentsToSend,
      sendMethod: deliveryMethodData.sendMethod,
      baseId: baseId,
      tracking: deliveryMethodData.tracking,
      vehiclePlate: deliveryMethodData.vehiclePlate,
      sendEmail: user.email_login,
      sendDate: DateTime.now().setZone("America/Sao_Paulo").toISO() || '', 
    };

    try {
      await dispatchDocumentsMutation.mutateAsync(deliveryData);

    } catch (error) {
      console.error("Erro ao enviar dados de entrega:", error);
    } finally {
      refetch();
      setParentRowSelection({});
      setIsConfirmationOpen(false);
      setDeliveryMethodData(null);
    }
  };

  const handleCancelConfirmation = () => {
    setIsConfirmationOpen(false);
    setDeliveryMethodData(null);
  };

  const handleConfirmMoreDocuments = () => {
    setIsSuccessModalOpen(false);
    setSelectedDocuments([]);
    window.location.reload()
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSelectedDocuments([]);
    window.location.href = "/";
    // navigate({ to: "/" });
  };

  function handleCancelDeliveryModal(): void {
    setIsDeliveryModalOpen(false);
  }

  return (
    user &&
    baseId && (
      <div className="max-w-[92vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">
              Documentos Registrados
            </h1>
          </div>
          <Button
            variant="secondary"
            className='flex items-center gap-2'
            size="sm"
            onClick={ () => refetch() }
            disabled={ isLoading }
          >
            { isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" /> }
            Atualizar
          </Button>
        </div>

        <div className="mb-8">
          { isLoading && <div>Carregando documentos registrados...</div> }
          { isError && <div>Erro ao carregar documentos registrados.</div> }
          <DataTable<TravelDocument>
            key="registered-documents"
            columns={ documentColumns }
            data={ registeredDocuments }
            onRowSelectionChangeParent={ handleSelectionChange }
            parentRowSelection={ parentRowSelection }
            setParentRowSelection={ setParentRowSelection }
          />
        </div>

        <div className="flex justify-end mb-8">
          <Button
            variant="default"
            onClick={ handleSendSelected }
            disabled={ selectedDocuments.length === 0 }
          >
            { isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" /> }
            Enviar Selecionados ({ selectedDocuments.length })
          </Button>
        </div>

        <Alert
          isOpen={ isConfirmationOpen }
          onOpenChange={ setIsConfirmationOpen }
          title="Confirmar Envio"
          desc={ `Tem certeza que deseja enviar ${ Object.keys(parentRowSelection).length } documento(s)?` }
          onConfirm={ handleConfirmSendDocuments }
          onCancel={ handleCancelConfirmation }
          confirmButtonText="Confirmar Envio"
          cancelButtonText="Cancelar"
        />

        <DeliveryModal
          isOpen={ isDeliveryModalOpen }
          onClose={ handleCancelDeliveryModal }
          onSubmit={ onSubmitDeliveryMethod }
        />

        <SuccessModal
          title="Documentos Enviados com sucesso!"
          description="Deseja enviar mais documentos?"
          isOpen={ isSuccessModalOpen }
          onClose={ handleCloseSuccessModal }
          onConfirm={ handleConfirmMoreDocuments }
        />
      </div>
    )
  );
}