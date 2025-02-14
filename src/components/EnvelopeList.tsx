import React from 'react';
import { Truck, Package, Building2, CheckCircle } from 'lucide-react';
import { Envelope, EnvelopeStatus } from '../types';

interface EnvelopeListProps {
  envelopes: Envelope[];
  onSelect: (envelope: Envelope) => void;
  selectedEnvelopes: Envelope[];
}

const statusIcons = {
  MOTORISTA_TRANSITO_FILIAL: Truck,
  RECEBIDO_FILIAL: Building2,
  ENVIADO_MATRIZ: Package,
  RECEBIDO_MATRIZ: CheckCircle,
};

const statusLabels = {
  MOTORISTA_TRANSITO_FILIAL: 'Motorista - Trânsito Filial',
  RECEBIDO_FILIAL: 'Recebido Filial',
  ENVIADO_MATRIZ: 'Enviado para Matriz',
  RECEBIDO_MATRIZ: 'Recebido Matriz',
};

export function EnvelopeList({ envelopes, onSelect, selectedEnvelopes }: EnvelopeListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-background shadow-md rounded-lg">
        <thead className="bg-secondary">
          <tr>
            <th className="p-4">Selecionar</th>
            <th className="p-4">CT-e</th>
            <th className="p-4">NF</th>
            <th className="p-4">Origem</th>
            <th className="p-4">Destino</th>
            <th className="p-4">Cliente</th>
            <th className="p-4">Placa</th>
            <th className="p-4">Motorista</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {envelopes.map((envelope) => {
            const StatusIcon = statusIcons[envelope.status];
            const isSelected = selectedEnvelopes.some(e => e.id === envelope.id);
            
            return (
              <tr 
                key={envelope.id}
                className={`border-t hover:bg-accent ${isSelected ? 'bg-blue-50' : ''}`}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(envelope)}
                    className="h-4 w-4 text-blue-600 rounded border-input"
                  />
                </td>
                <td className="p-4">{envelope.cteNumber}</td>
                <td className="p-4">{envelope.nfNumber}</td>
                <td className="p-4">{envelope.origin}</td>
                <td className="p-4">{envelope.destination}</td>
                <td className="p-4">{envelope.client}</td>
                <td className="p-4">{envelope.tractionPlate}</td>
                <td className="p-4">{envelope.driverName}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <StatusIcon className="h-5 w-5" />
                    <span>{statusLabels[envelope.status]}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}