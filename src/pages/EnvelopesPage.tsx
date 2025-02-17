import React, { useState, useEffect } from 'react';
import { EnvelopeList } from '../components/EnvelopeList';
import { DispatchForm } from '../components/DispatchForm';
import { Envelope, DispatchMethod } from '../types';
import { Search } from 'lucide-react';
import { DateTime } from 'luxon';

export function EnvelopesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [selectedEnvelopes, setSelectedEnvelopes] = useState<Envelope[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get received documents from cache
    const receivedDocs = JSON.parse(localStorage.getItem('travel-documents') || '[]');
    const receivedCTEs = new Set(receivedDocs.map((doc: any) => doc.cteNumber));

    // Mock data - only show if CTE is in received documents
    if (receivedCTEs.has(searchTerm)) {
      const mockEnvelope: Envelope = {
        id: crypto.randomUUID(), // Gerar ID único
        cteNumber: searchTerm,
        nfNumber: 'NF123456',
        origin: 'São Paulo',
        destination: 'Rio de Janeiro',
        client: 'Cliente Exemplo',
        tractionPlate: 'ABC1234',
        trailerPlate: 'XYZ5678',
        driverName: 'João Silva',
        status: 'MOTORISTA_TRANSITO_FILIAL',
        dispatchDate: String(DateTime.now().setZone("America/Sao_Paulo").toISO()),
      };
      
      setEnvelopes([mockEnvelope]);
    } else {
      setEnvelopes([]);
      alert('CT-e não encontrado nos documentos recebidos');
    }
    
    setSearchTerm('');
  };

  const handleEnvelopeSelect = (envelope: Envelope) => {
    setSelectedEnvelopes(prev => {
      const isSelected = prev.some(e => e.id === envelope.id);
      if (isSelected) {
        return prev.filter(e => e.id !== envelope.id);
      }
      return [...prev, envelope];
    });
  };

  const handleDispatch = (method: DispatchMethod, plate?: string, trackingCode?: string) => {
    // Update selected envelopes with dispatch information
    const dispatchedEnvelopes = selectedEnvelopes.map(envelope => ({
      ...envelope,
      status: 'ENVIADO_MATRIZ' as const,
      dispatchMethod: method,
      dispatchPlate: plate,
      trackingCode: trackingCode,
      dispatchDate: new Date().toISOString()
    }));

    // Get existing sent documents or initialize empty array
    const existingSentDocs = JSON.parse(localStorage.getItem('sent-documents') || '[]');
    
    // Add new dispatched envelopes
    const updatedSentDocs = [...existingSentDocs, ...dispatchedEnvelopes];
    
    // Save to localStorage
    localStorage.setItem('sent-documents', JSON.stringify(updatedSentDocs));

    // Clear selections and update UI
    setSelectedEnvelopes([]);
    setEnvelopes(prev => prev.filter(env => !selectedEnvelopes.some(selected => selected.id === env.id)));

    // Show success message
    alert('Envelopes despachados com sucesso!');
  };

  return (
    <div className="max-w-[92vw] mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-foreground mb-8">
        Envio de Envelopes
      </h1>

      <div className="space-y-8">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-xl">
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Número do Romaneio (CT-e)
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-input shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Digite o número do CT-e"
              />
            </div>
            <button
              type="submit"
              className="self-end px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Search className="h-5 w-5" />
              Pesquisar
            </button>
          </div>
        </form>

        {/* Envelope List */}
        {envelopes.length > 0 && (
          <EnvelopeList
            envelopes={envelopes}
            onSelect={handleEnvelopeSelect}
            selectedEnvelopes={selectedEnvelopes}
          />
        )}

        {/* Dispatch Form */}
        {selectedEnvelopes.length > 0 && (
          <DispatchForm
            selectedEnvelopes={selectedEnvelopes}
            onDispatch={handleDispatch}
          />
        )}
      </div>
    </div>
  );
}