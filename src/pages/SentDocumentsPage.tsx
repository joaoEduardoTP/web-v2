import React, { useState } from 'react';
import { FileText, Truck, Bus, Mail, Calendar, Search, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '../services/localStorage';
import type { Protocol } from '../types';

export function SentDocumentsPage() {
  const [protocolSearch, setProtocolSearch] = useState('');
  const [currentProtocol, setCurrentProtocol] = useState<Protocol | null>(null);
  const [showProtocol, setShowProtocol] = useState(false);

  const queryClient = useQueryClient();

  const { data: documents = [] } = useQuery({
    queryKey: ['sent-documents'],
    queryFn: documentService.getSentDocuments
  });

  const { data: protocols = [] } = useQuery({
    queryKey: ['protocols'],
    queryFn: documentService.getProtocols
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: documentService.deleteSentDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sent-documents'] });
    }
  });

  const handleProtocolSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const protocol = protocols.find((p: Protocol) => p.id === protocolSearch);
    
    if (protocol) {
      setCurrentProtocol(protocol);
      setShowProtocol(true);
    } else {
      alert('Protocolo não encontrado');
    }
    
    setProtocolSearch('');
  };

  const handleDelete = (documentId: string) => {
    if (confirm('Tem certeza que deseja excluir este documento?')) {
      deleteDocumentMutation.mutate(documentId);
    }
  };

  // ... (keep the rest of the component's JSX unchanged)
}