import { Activity, Package, PackageCheck, Send } from "lucide-react";

export const screens = [
  {
    path: '/entrega',
    icon: Package,
    title: 'Entrega de Documentos',
  },
  {
    path: '/envio',
    icon: Send,
    title: 'Envio de Documentos',
  },
  {
    path: '/baixa',
    icon: PackageCheck,
    title: 'Baixa de Documentos',
  },
  {
    path: '/acompanhamento',
    icon: Activity,
    title: 'Acompanhamento de Entregas',
  }
];