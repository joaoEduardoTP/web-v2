import React, { useState } from 'react';
import { Send, Truck, Bus, Mail } from 'lucide-react';
import { DispatchMethod, Envelope } from '../types';

interface DispatchFormProps {
  selectedEnvelopes: Envelope[];
  onDispatch: (method: DispatchMethod, plate?: string, trackingCode?: string) => void;
}

export function DispatchForm({ selectedEnvelopes, onDispatch }: DispatchFormProps) {
  const [dispatchMethod, setDispatchMethod] = useState<DispatchMethod | ''>('');
  const [plate, setPlate] = useState('');
  const [trackingCode, setTrackingCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchMethod) return;
    
    onDispatch(
      dispatchMethod,
      dispatchMethod === 'FROTA_PROPRIA' ? plate : undefined,
      dispatchMethod === 'CORREIOS' ? trackingCode : undefined
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-background p-6 rounded-lg shadow-md">
      <div>
        <h3 className="text-lg font-medium mb-4">
          Despachar {selectedEnvelopes.length} envelope(s)
        </h3>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="dispatchMethod"
                value="ONIBUS_TRANSPORTADORA"
                checked={dispatchMethod === 'ONIBUS_TRANSPORTADORA'}
                onChange={(e) => setDispatchMethod(e.target.value as DispatchMethod)}
                className="text-blue-600"
              />
              <Bus className="h-5 w-5" />
              Ônibus/Transportadora
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="dispatchMethod"
                value="FROTA_PROPRIA"
                checked={dispatchMethod === 'FROTA_PROPRIA'}
                onChange={(e) => setDispatchMethod(e.target.value as DispatchMethod)}
                className="text-blue-600"
              />
              <Truck className="h-5 w-5" />
              Frota Própria
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="dispatchMethod"
                value="CORREIOS"
                checked={dispatchMethod === 'CORREIOS'}
                onChange={(e) => setDispatchMethod(e.target.value as DispatchMethod)}
                className="text-blue-600"
              />
              <Mail className="h-5 w-5" />
              Correios
            </label>
          </div>

          {dispatchMethod === 'FROTA_PROPRIA' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Placa do Veículo
              </label>
              <input
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                className="mt-1 block w-full rounded-md border-input shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="ABC1234"
                pattern="[A-Z]{3}[0-9]{4}"
                required={dispatchMethod === 'FROTA_PROPRIA'}
              />
            </div>
          )}

          {dispatchMethod === 'CORREIOS' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Código de Rastreio
              </label>
              <input
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                className="mt-1 block w-full rounded-md border-input shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="XX123456789BR"
                required={dispatchMethod === 'CORREIOS'}
              />
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={!dispatchMethod}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        <Send className="h-5 w-5" />
        Despachar Envelopes
      </button>
    </form>
  );
}