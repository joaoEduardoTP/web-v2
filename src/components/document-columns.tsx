import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { TravelDocument } from "@/types";


// export type TravelDocumentColumnDef = ColumnDef<TravelDocument>;



export const documentColumns: ColumnDef<TravelDocument>[] = [
  {
    id: "select",
    alias: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={ (value) => table.toggleAllPageRowsSelected(!!value) }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={ row.getIsSelected() }
        onCheckedChange={ (value) => row.toggleSelected(!!value) }
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "identifier",
    header: "Identicador (Romaneio)",
  },
  {
    accessorKey: "grid",
    header: "Grid",
  },
  {
    accessorKey: "modality",
    header: "Modal.",
  },
  {
    accessorKey: "docFisType",
    header: "Doc Fiscal",
  },
  {
    accessorKey: "docFisNumber",
    header: "Cte/NFe",
  },
  {
    accessorKey: "cteIssueDate",
    header: "Data Emissão",
  },
  {
    accessorKey: "vehiclePlate",
    header: "Placa",
  },
  {
    accessorKey: "driverName",
    header: "Motorista",
  },
  {
    id: "origin/destination",
    header: "Origem/Destino",
    cell: ({ row }) => {
      const origin = row.original.origin;
      const destination = row.original.destination; // Adicione a propriedade destination ao seu tipo TravelDocument

      return (
        <div className="flex flex-col">
          <span>{ origin }</span>
          <span>{ destination }</span>
        </div>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "Data Inicio",
  },
  {
    accessorKey: "endDate",
    header: "Data Fim",
  },
  {
    accessorKey: "loadingStartDate",
    header: "Data Inicio Carreg.",
  },
  {
    accessorKey: "unloadingEndDate",
    header: "Data Fim Descarreg.",
  },
];