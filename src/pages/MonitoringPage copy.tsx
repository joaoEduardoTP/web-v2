import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Search, FileText, Building2, Send, CheckCircle, Clock } from 'lucide-react';
import { Envelope } from '../types';

type DocumentStatus = 'ENTREGUE_BASE' | 'ENVIADO_MATRIZ' | 'RECEBIDO_MATRIZ';

interface MonitoringDocument {
  id: string;
  cteNumber: string;
  nfNumber: string;
  client: string;
  origin: string;
  destination: string;
  status: DocumentStatus;
  date: string;
  vehiclePlate?: string;
  branchName?: string;
  dispatchMethod?: string;
  dispatchPlate?: string;
  trackingCode?: string;
  transitTimes?: {
    baseToMatrix?: number;
    matrixToReceipt?: number;
    totalTime?: number;
    pendingTime?: number;
  };
}

export function MonitoringPage() {
  const [documents, setDocuments] = useState<MonitoringDocument[]>([]);
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'ALL'>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadDocuments();
  }, []);

  const calculateTransitTimes = (docs: MonitoringDocument[]) => {
    const now = new Date().getTime();

    const docsByCtE = docs.reduce((acc, doc) => {
      if (!acc[doc.cteNumber]) {
        acc[doc.cteNumber] = [];
      }
      acc[doc.cteNumber].push(doc);
      return acc;
    }, {} as Record<string, MonitoringDocument[]>);

    return docs.map(doc => {
      const docsForCtE = docsByCtE[doc.cteNumber].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const baseDoc = docsForCtE.find(d => d.status === 'ENTREGUE_BASE');
      const matrixDoc = docsForCtE.find(d => d.status === 'ENVIADO_MATRIZ');
      const receiptDoc = docsForCtE.find(d => d.status === 'RECEBIDO_MATRIZ');

      const transitTimes: MonitoringDocument['transitTimes'] = {};

      if (baseDoc) {
        const baseTime = new Date(baseDoc.date).getTime();
        
        if (matrixDoc) {
          const matrixTime = new Date(matrixDoc.date).getTime();
          transitTimes.baseToMatrix = Math.round((matrixTime - baseTime) / (1000 * 60));
        } else if (doc.status === 'ENTREGUE_BASE') {
          transitTimes.pendingTime = Math.round((now - baseTime) / (1000 * 60));
        }
      }

      if (matrixDoc) {
        const matrixTime = new Date(matrixDoc.date).getTime();
        
        if (receiptDoc) {
          const receiptTime = new Date(receiptDoc.date).getTime();
          transitTimes.matrixToReceipt = Math.round((receiptTime - matrixTime) / (1000 * 60));
        } else if (doc.status === 'ENVIADO_MATRIZ') {
          transitTimes.pendingTime = Math.round((now - matrixTime) / (1000 * 60));
        }
      }

      if (baseDoc && receiptDoc && doc.status === 'RECEBIDO_MATRIZ') {
        const baseTime = new Date(baseDoc.date).getTime();
        const receiptTime = new Date(receiptDoc.date).getTime();
        transitTimes.totalTime = Math.round((receiptTime - baseTime) / (1000 * 60));
      }

      return {
        ...doc,
        transitTimes
      };
    });
  };

  const loadDocuments = () => {
    const travelDocs = JSON.parse(localStorage.getItem('travel-documents') || '[]');
    const travelMonitoringDocs = travelDocs.map((doc: any) => ({
      id: doc.id,
      cteNumber: doc.cteNumber,
      nfNumber: '-',
      client: '-',
      origin: '-',
      destination: doc.branchName,
      status: 'ENTREGUE_BASE' as DocumentStatus,
      date: doc.receiptDate,
      vehiclePlate: doc.vehiclePlate,
      branchName: doc.branchName
    }));

    const sentDocs = JSON.parse(localStorage.getItem('sent-documents') || '[]');
    const sentMonitoringDocs = sentDocs.map((doc: Envelope) => ({
      id: doc.id,
      cteNumber: doc.cteNumber,
      nfNumber: doc.nfNumber,
      client: doc.client,
      origin: doc.origin,
      destination: doc.destination,
      status: 'ENVIADO_MATRIZ' as DocumentStatus,
      date: doc.dispatchDate,
      dispatchMethod: doc.dispatchMethod,
      dispatchPlate: doc.dispatchPlate,
      trackingCode: doc.trackingCode
    }));

    const protocols = JSON.parse(localStorage.getItem('protocols') || '[]');
    const receivedDocs = protocols.flatMap((protocol: any) => 
      protocol.items.map((item: any) => ({
        id: crypto.randomUUID(),
        cteNumber: item.cteNumber,
        nfNumber: item.nfNumber,
        client: item.client,
        origin: '-',
        destination: '-',
        status: 'RECEBIDO_MATRIZ' as DocumentStatus,
        date: protocol.createdAt,
        dispatchMethod: item.dispatchMethod,
        dispatchPlate: item.dispatchPlate,
        trackingCode: item.trackingCode
      }))
    );

    const allDocs = [...travelMonitoringDocs, ...sentMonitoringDocs, ...receivedDocs];
    const docsWithTransitTimes = calculateTransitTimes(allDocs);
    setDocuments(docsWithTransitTimes);
  };

  const formatTransitTime = (minutes: number | undefined) => {
    if (minutes === undefined) return '-';
    
    const days = Math.floor(minutes / (24 * 60));
    const hours = Math.floor((minutes % (24 * 60)) / 60);
    const remainingMinutes = minutes % 60;
    
    const parts = [];
    
    if (days > 0) {
      parts.push(`${days}d`);
    }
    if (hours > 0 || days > 0) {
      parts.push(`${hours}h`);
    }
    if (remainingMinutes > 0 || (days === 0 && hours === 0)) {
      parts.push(`${remainingMinutes}m`);
    }
    
    return parts.join(' ');
  };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case 'ENTREGUE_BASE':
        return <Building2 className="h-5 w-5 text-green-500" />;
      case 'ENVIADO_MATRIZ':
        return <Send className="h-5 w-5 text-blue-500" />;
      case 'RECEBIDO_MATRIZ':
        return <CheckCircle className="h-5 w-5 text-purple-500" />;
    }
  };

  const getStatusLabel = (status: DocumentStatus) => {
    switch (status) {
      case 'ENTREGUE_BASE':
        return 'Entregue na Base';
      case 'ENVIADO_MATRIZ':
        return 'Enviado para Matriz';
      case 'RECEBIDO_MATRIZ':
        return 'Recebido na Matriz';
    }
  };

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case 'ENTREGUE_BASE':
        return 'bg-green-100 text-green-800';
      case 'ENVIADO_MATRIZ':
        return 'bg-blue-100 text-blue-800';
      case 'RECEBIDO_MATRIZ':
        return 'bg-purple-100 text-purple-800';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesStatus = statusFilter === 'ALL' || doc.status === statusFilter;
    const docDate = new Date(doc.date);
    const matchesStartDate = !startDate || docDate >= new Date(startDate);
    const matchesEndDate = !endDate || docDate <= new Date(endDate);
    return matchesStatus && matchesStartDate && matchesEndDate;
  });

  const renderTransitTimes = (doc: MonitoringDocument) => {
    const { transitTimes, status } = doc;
    if (!transitTimes) return null;

    return (
      <div className="space-y-1">
        {status === 'ENTREGUE_BASE' && transitTimes.pendingTime !== undefined && (
          <div className="flex items-center gap-1 text-sm text-amber-600 font-medium">
            <Clock className="h-4 w-4" />
            <span>Tempo na Base: {formatTransitTime(transitTimes.pendingTime)}</span>
          </div>
        )}

        {status === 'ENVIADO_MATRIZ' && (
          <>
            {transitTimes.baseToMatrix !== undefined && (
              <div className="flex items-center gap-1 text-sm text-secondary-foreground">
                <Clock className="h-4 w-4" />
                <span>Base → Matriz: {formatTransitTime(transitTimes.baseToMatrix)}</span>
              </div>
            )}
            {transitTimes.pendingTime !== undefined && (
              <div className="flex items-center gap-1 text-sm text-amber-600 font-medium">
                <Clock className="h-4 w-4" />
                <span>Em Trânsito: {formatTransitTime(transitTimes.pendingTime)}</span>
              </div>
            )}
          </>
        )}

        {status === 'RECEBIDO_MATRIZ' && (
          <>
            {transitTimes.baseToMatrix !== undefined && (
              <div className="flex items-center gap-1 text-sm text-secondary-foreground">
                <Clock className="h-4 w-4" />
                <span>Base → Matriz: {formatTransitTime(transitTimes.baseToMatrix)}</span>
              </div>
            )}
            {transitTimes.matrixToReceipt !== undefined && (
              <div className="flex items-center gap-1 text-sm text-secondary-foreground">
                <Clock className="h-4 w-4" />
                <span>Matriz → Recebimento: {formatTransitTime(transitTimes.matrixToReceipt)}</span>
              </div>
            )}
            {transitTimes.totalTime !== undefined && (
              <div className="flex items-center gap-1 text-sm font-medium text-foreground">
                <Clock className="h-4 w-4" />
                <span>Tempo Total: {formatTransitTime(transitTimes.totalTime)}</span>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 mb-8">
        <Activity className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-foreground">
          Monitoramento de Documentos
        </h1>
      </div>

      <div className="bg-background p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | 'ALL')}
              className="block w-full rounded-md border-input shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="ALL">Todos</option>
              <option value="ENTREGUE_BASE">Entregue na Base</option>
              <option value="ENVIADO_MATRIZ">Enviado para Matriz</option>
              <option value="RECEBIDO_MATRIZ">Recebido na Matriz</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Inicial
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="block w-full rounded-md border-input shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Final
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="block w-full rounded-md border-input shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-background shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-secondary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                CT-e / NF
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Origem/Destino
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Detalhes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Tempo de Trânsito
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDocuments.map((doc) => (
              <tr key={doc.id} className="hover:bg-accent">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(doc.status)}
                    <span className={`inline-flex text-xs font-semibold rounded-full px-2 py-1 ${getStatusColor(doc.status)}`}>
                      {getStatusLabel(doc.status)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-foreground">{doc.cteNumber}</div>
                  <div className="text-sm text-muted-foreground">{doc.nfNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-foreground">{doc.client}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">{doc.origin}</div>
                  <div className="text-sm text-muted-foreground">{doc.destination}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-foreground">
                    {doc.vehiclePlate && `Veículo: ${doc.vehiclePlate}`}
                    {doc.branchName && `Base: ${doc.branchName}`}
                    {doc.dispatchPlate && `Placa: ${doc.dispatchPlate}`}
                    {doc.trackingCode && `Rastreio: ${doc.trackingCode}`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-foreground">
                    {new Date(doc.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(doc.date).toLocaleTimeString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderTransitTimes(doc)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}