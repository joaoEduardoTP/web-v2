export enum DocumentStatus {
  ENTREGUE = "Entregue na Base",
  ENVIADO = "Enviado para a Matriz",
  RECEBIDO = "Recebido na Matriz",
}


export enum DeliveryMethod {
  ONIBUS = "onibus",
  CORREIOS = "correios",
  FROTA_PROPRIA = "frota_propria"
}

export interface DeliveryData {
  identifiers: string[];
  sendMethod: DeliveryMethod;
  baseId: string;
  tracking?: string;
  vehiclePlate?: string;
  sendEmail: string;
  sendDate: string;
}

export interface ReceivedDocumentData {
  identifiers: string[];
  baseId: string;
  dischargeDate: string;
  dischargeEmail: string;
}
export interface SendDocumentsPayload {
  documents: TravelDocument[];
  baseId: string;
  receiptDate: string;
  receiptEmail: string;
};
export interface ReceivedDocumentsPayload {
  identifers: string[];
  baseId: string;
  dischargeDate: string;
  dischargeEmail: string;
}
export interface SendDocumentFilters {
  identifier?: string;
  vehiclePlate?: string;
  baseId: string;
}



















export interface User {
  id: string;
  username: string;
  name: string;
  password: string;
  role: UserRole;
  permissions: UserPermissions;
  active: boolean;
}

export interface Base {
  id: string;
  name: string;
  city: string;
  state: string;
  contact: string;
  description: string;
  // createdAt: string;
  // updatedAt: string;
}

export interface TravelDocument {
  id: any;
  identifier: string;
  grid: string;
  modality: string;

  docFisType: string;
  docFisNumber: string;
  cteIssueDate: string;
  vehiclePlate: string;
  driverName: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate?: string;
  loadingStartDate: string;
  unloadingEndDate?: string;
}



