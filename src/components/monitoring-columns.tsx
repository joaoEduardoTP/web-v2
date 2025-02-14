import { DeliveryMethod } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { MapPin, TruckIcon } from "lucide-react";
import { DataTableColumnHeader } from "./column-data-table";
import { formatRelativeTime, formatTimeBetweenDates } from "@/lib/utils";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";

export type DocumentColumn = {
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
  endDate: string;
  loadingStartDate: string;
  unloadingEndDate: string;
  receiptDate: string;
  receiptEmail: string;
  status: string;
  baseId: number;
  sendDate: string;
  sendEmail: string;
  dischargeDate: string;
  dischargeEmail: string;
  tracking: string | null;
  sendPlate: string | null;
  sendMethod: string;
};

export const monitoringColumn: ColumnDef<DocumentColumn>[] = [
  {
    accessorKey: "identifier",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Identificador (Romaneio)" />,
    meta: {
      title: "Identificador (Romaneio)",
    },
  },
  {
    accessorKey: "grid",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Grid" />,
    meta: {
      title: "Grid",
    },
  },
  {
    accessorKey: "modality",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Modal." />,
    meta: {
      title: "Modalidade",
    },
  },
  {
    accessorKey: "docFisType",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Doc Fiscal" />,
    meta: {
      title: "Doc Fiscal",
    },
  },
  {
    accessorKey: "docFisNumber",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Cte/NFe" />,
    meta: {
      title: "Cte/NFe",
    },
  },
  {
    accessorKey: "cteIssueDate",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Data Emissão" />,
    meta: {
      title: "Data Emissão",
    },
  },
  {
    accessorKey: "vehiclePlate",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Placa" />,
    meta: {
      title: "Placa",
    },
  },
  {
    accessorKey: "driverName",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Motorista" />,
    meta: {
      title: "Motorista",
    },
  },
  {
    id: "origin/destination",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Origem/Destino" />,
    cell: ({ row }) => {
      const origin = row.original.origin;
      const destination = row.original.destination;

      return (
        <div className="flex flex-col">
          <span>{ origin }</span>
          <span>{ destination }</span>
        </div>
      );
    },
    meta: {
      title: "Origem/Destino",
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Data Inicio" />,
    meta: {
      title: "Data Inicio",
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Data Fim" />,
    meta: {
      title: "Data Fim",
    },
  },
  {
    accessorKey: "loadingStartDate",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Data Inicio Carreg." />,
    meta: {
      title: "Data Inicio Carreg.",
    },
  },
  {
    accessorKey: "unloadingEndDate",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Data Fim Descarreg." />,
    meta: {
      title: "Data Fim Descarreg.",
    },
  },
  {
    accessorKey: "receiptDate",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Data Recebimento" />,
    meta: {
      title: "Data Recebimento",
    },
  },
  {
    accessorKey: "receiptEmail",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Email Recebimento" />,
    meta: {
      title: "Email Recebimento",
    },
  },
  {
    id: "dataStatus",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Status Data" />,
    cell: ({ row }) => {
      const { receiptDate, sendDate, dischargeDate } = row.original;

      if (dischargeDate) {
        return `Baixado em: ${ format(new Date(dischargeDate), 'dd/MM/yyyy') }`;
      } else if (sendDate && receiptDate) {
        const tempoParaEnvio = formatTimeBetweenDates(receiptDate, sendDate);
        const enviadoHa = formatRelativeTime(sendDate);
        return (
          <div>
            <div>Tempo para Envio: { tempoParaEnvio }</div>
            <div>Enviado há: { enviadoHa }</div>
          </div>
        );
      } else if (receiptDate) {
        return `Recebido há ${ formatRelativeTime(receiptDate) }`;
      } else {
        return "Pendente";
      }
    },
    enableSorting: false,
    meta: {
      title: "Status Data",
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Status" />,
    meta: {
      title: "Status",
    },
  },
  {
    accessorKey: "sendMethod",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Método Envio" />,
  },
  {
    accessorKey: "sendDate",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Data Envio" />,
    meta: {
      title: "Data Envio",
    },
  },
  {
    accessorKey: "sendEmail",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Email Envio" />,
    meta: {
      title: "Email Envio",
    },
  },
  {
    accessorKey: "dischargeDate",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Data Baixa" />,
    meta: {
      title: "Data Baixa",
    },
  },
  {
    accessorKey: "dischargeEmail",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Email Baixa" />,
    meta: {
      title: "Email Baixa",
    },
  },
  {
    accessorKey: "tracking",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Cod. Rastreio" />,
    meta: {
      title: "Cod. Rastreio",
    },
  },
  {
    accessorKey: "sendPlate",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Placa Envio" />,
    meta: {
      title: "Placa Envio",
    },
  },
  {
    id: "actions",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Ações" />,
    cell: ({ row }) => {
      if (row.original.sendMethod === DeliveryMethod.FROTA_PROPRIA) {
        return (
          <Link to="/">
            <MapPin className="w-7 h-7 text-destructive" />
          </Link>
        );
      }
      return null;
    },
    enableSorting: false,
    enableHiding: false,
    meta: {
      title: "Ações",
    },
  },
];
