import { Alert } from '@/components/alert';
import DataTable from '@/components/data-table';
import { FormValues } from '@/components/delivery-modal';
import { documentColumns } from '@/components/document-columns';
import SuccessModal from '@/components/success-modal';
import { Button } from "@/components/ui/button";
import { documentService as apiDocumentService } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { ReceivedDocumentData, ReceivedDocumentsPayload, TravelDocument } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Loader2, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export function DischargeDocumentsPage() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const baseId = user?.baseId;
  const [selectedDocuments, setSelectedDocuments] = useState<TravelDocument[]>([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [parentRowSelection, setParentRowSelection] = useState({});
  const navigate = useNavigate();

  const { data: arrivedDocuments = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["arrived-documents", baseId],
    queryFn: async () => {
      if (!baseId) throw new Error("BaseId não encontrado.");
      const response = await apiDocumentService.getArrivedDocuments(baseId);
      return response;
    },
    enabled: !!baseId,
  });


  useEffect(() => {
    refetch();
  }, []);


  const setAsReceivedMutation = useMutation({
    mutationFn: async (data: ReceivedDocumentData) => {
      const response = await apiDocumentService.setDocumentsAsReceived(data);
      return response;
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["arrived-documents", baseId] });
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
    setIsConfirmationOpen(true);
  };

  const handleConfirmSendDocuments = async () => {
    if (!baseId) return;
    console.log('Dados de entrega:', selectedDocuments);
    const documentsToSend = selectedDocuments.map((doc) => doc.identifier);

    const receivedDocumentData: ReceivedDocumentData = {
      identifiers: documentsToSend,
      baseId: baseId,
      dischargeDate: new Date().toISOString(),
      dischargeEmail: user.email,
    };


    try {
      await setAsReceivedMutation.mutateAsync(receivedDocumentData);

    } catch (error) {
      console.error("Erro ao enviar dados de entrega:", error);
    } finally {
      refetch();
      setParentRowSelection({});
      setIsConfirmationOpen(false);
    }
  };

  const handleCancelConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  const handleConfirmMoreDocuments = () => {
    setIsSuccessModalOpen(false);

    setSelectedDocuments([]);
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSelectedDocuments([]);
    navigate({ to: "/" });
  };



  return (
    user &&
    baseId && (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">
              Baixa de Documentos
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
          <DataTable
            key="registered-documents"
            columns={ documentColumns }
            data={ arrivedDocuments }
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

        <SuccessModal
          isOpen={ isSuccessModalOpen }
          onClose={ handleCloseSuccessModal }
          onConfirm={ handleConfirmMoreDocuments }
        />
      </div>
    )
  );
}