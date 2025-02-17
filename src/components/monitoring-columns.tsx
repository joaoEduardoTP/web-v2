import { DeliveryMethod } from "@/types";
import { Link } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircleIcon, ClockIcon, MapPin, PackageCheckIcon, TruckIcon } from "lucide-react";
import { DataTableColumnHeader } from "./column-data-table";
import { DateTime } from 'luxon';
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn, formatDeliveryMethod } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

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

const formatRelativeTime = (date: string | null | undefined): string => {
  if (!date) return "";
  try {
    const dt = DateTime.fromFormat(date, "dd/MM/yy HH:mm:ss");
    const now = DateTime.now();
    const diff = now.diff(dt, ['hours', 'minutes']);
    const hours = Math.floor(diff.hours); // Ensure hours is an integer
    const minutes = Math.floor(diff.minutes % 60); // Get minutes within the hour

    return `há ${ hours }h ${ String(minutes).padStart(2, '0') }m`;
  } catch (error) {
    console.error("Erro ao formatar data relativa:", error);
    return "Data Inválida";
  }
};


const formatTimeBetweenDates = (startDate: string | null | undefined, endDate: string | null | undefined) => {
  if (!startDate || !endDate) return "";
  try {
    const startDt = DateTime.fromFormat(startDate, "dd/MM/yy HH:mm:ss");
    const endDt = DateTime.fromFormat(endDate, "dd/MM/yy HH:mm:ss");
    const diff = endDt.diff(startDt, ['hours', 'minutes', 'seconds']);
    return diff.toFormat('hh:mm:ss');
  } catch (error) {
    console.error("Erro ao calcular diferença de tempo:", error);
    return "Tempo Indisponível"; // Ou outra mensagem de erro amigável
  }
};

const formatDate = (date: string | null | undefined) => {
  if (!date) return "";
  try {
    return DateTime.fromFormat(date, "dd/MM/yy HH:mm:ss").toLocaleString(DateTime.DATETIME_SHORT);
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "Data Inválida";
  }
};

export const monitoringColumn: ColumnDef<DocumentColumn>[] = [
  {
    accessorKey: "identifier",
    header: ({ column }) => <DataTableColumnHeader className="ml-1" column={ column } title="Romaneio" />,
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
    header: ({ column }) => <DataTableColumnHeader column={ column } title={ 'Origem Destino' } />,
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
    header: ({ column }) => <DataTableColumnHeader className="w-44" column={ column } title="Status Data" />,
    cell: ({ row }) => {
      const { receiptDate, sendDate, dischargeDate } = row.original;

      const isReceiptOverdue = receiptDate && !sendDate && !dischargeDate ? DateTime.fromFormat(receiptDate, "dd/MM/yy HH:mm:ss") < DateTime.now().minus({ days: 7 }) : false;


      return (
        <div className={ cn("space-y-2", isReceiptOverdue && 'text-destructive') } >
          { dischargeDate && (
            <div className="flex items-center gap-2"> {/* Flex container for icon and text */ }
              <div>
                <PackageCheckIcon className="w-4 h-4 text-green-500" /> {/* Icon for Discharge */ }
              </div>
              <div>Baixado { formatRelativeTime(dischargeDate) }</div>
            </div>
          ) }

          { sendDate && receiptDate && (
            <>
              <div className="flex items-center gap-2 pb-2 border-b  border-dashed border-foreground"> {/* Line separator and flex container */ }
                <div>
                  <TruckIcon className="w-4 h-4 text-blue-500" /> {/* Icon for Sent */ }
                </div>
                <div>Enviado { formatRelativeTime(sendDate) }</div>
              </div>
              <div className="flex items-center gap-2 pt-2"> {/* Flex container for icon and text */ }
                <div>
                  <CheckCircleIcon className="w-4 h-4 text-green-500" /> {/* Icon for Receipt */ }
                </div>
                <div>Entregue { formatRelativeTime(receiptDate) }</div>
              </div>
            </>
          ) }

          { receiptDate && !sendDate && !dischargeDate && ( //receiptDate only
            <div className="flex items-center gap-2"> {/* Flex container for icon and text */ }
              <div>
                <CheckCircleIcon className="w-4 h-4 text-green-500" /> {/* Icon for Receipt */ }
              </div>
              <div>Recebido { formatRelativeTime(receiptDate) }</div>
            </div>
          ) }

          { !receiptDate && !sendDate && !dischargeDate && ( // No dates
            <div className="flex items-center gap-2"> {/* Flex container for icon and text */ }
              <div>
                <ClockIcon className="w-4 h-4 text-gray-400" /> {/* Icon for Pending */ }
              </div>
              <div>Pendente</div>
            </div>
          ) }
        </div>
      );
    },
    enableSorting: false,
    meta: {
      title: "Status Data",
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader className="w-20" column={ column } title="Status" />,
    cell: ({ row }) => {
      const credentials = useAuthStore((state) => state.user);
      if (!credentials) return '';

      const { bases } = credentials;
      const baseId = row.original.baseId;

      const foundbase = bases.find((base) => base.id === baseId);

      const status = row.original.status;
      return (
        <div>
          <span>{ status }</span>
          <span>{ status === 'Entregue na Base' && ` de ${ foundbase?.city }` }</span>
        </div>
      );
    },

    meta: {
      title: "Status",
    },
  },
  {
    accessorKey: "sendMethod",
    header: ({ column }) => <DataTableColumnHeader column={ column } title="Método Envio" />,
    cell: ({ row }) => {
      const sendMethod = row.original.sendMethod;
      return (
        <span>{ sendMethod ? formatDeliveryMethod(sendMethod) : 'Não enviado' }</span>
      );
    }
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
          <a target="_blank" href={ `http://127.0.0.1:5000/tracker-docs?placa=${ row.original.sendPlate?.toUpperCase() }` } >
            <MapPin className="w-7 h-7 text-green-500" />
          </  a>
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