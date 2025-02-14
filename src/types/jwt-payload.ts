export interface Base {
  city: string;
  contact: string;
  description: string;
  id: number;
  name: string;
  state: string;
}

export interface Permission {
  group_name: string;
  has_access: boolean;
  level: number;
  module_name: string;
  screen_name: string;
}

export interface User {
  email_login: string;
  id_user: number;
  nome: string;
  sobrenome: string;
  status: string;
  tipo_conta: string;
  ultimo_acesso: string;
}

export interface DataPayload {
  bases: Base[];
  permissions: Permission[];
  user: User;
}

export interface Payload {
  data: DataPayload;
  status: string;
}