import {
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { DataTablePagination } from "./pagination-data-table";
import { Input } from "./ui/input";
import { DataTableViewOptions } from "./visibility-data-table";
import { DataTableFacetedFilter } from "./faceted-filter";
import { getDropDownValues } from "@/lib/utils";
import { AlertCircle, Loader2 } from "lucide-react"; // Changed import to Loader2 from lucide-react

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  isError?: boolean;
}

const initialColumnsVisibility: VisibilityState = {
  loadingStartDate: false,
  unloadingEndDate: false,
  receiptEmail: false,
  receiptDate: false,
  dischargeEmail: false,
  dischargeDate: false,
  sendEmail: false,
  sendDate: false,
};

export function MonitoringDataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  isError,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnsVisibility
  );
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedRowModel: getFacetedRowModel(),
    onColumnOrderChange: setColumnOrder,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      columnOrder,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <div className=" flex items-center space-x-2 ">
          <Input
            placeholder="Filtrar Documentos"
            value={
              (table.getColumn("identifier")?.getFilterValue() as string) ?? ""
            }
            onChange={ (event) =>
              table.getColumn("identifier")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-4 ">
          { table.getColumn("grid") && (
            <DataTableFacetedFilter
              column={ table.getColumn("grid") }
              title="Grid"
              options={ getDropDownValues(data, "grid") }
            />
          ) }

          { table.getColumn("modality") && (
            <DataTableFacetedFilter
              column={ table.getColumn("modality") }
              title="Modalidade"
              options={ getDropDownValues(data, "modality") }
            />
          ) }

          { table.getColumn("status") && (
            <DataTableFacetedFilter
              column={ table.getColumn("status") }
              title="Status"
              options={ getDropDownValues(data, "status") }
            />
          ) }
          <DataTableViewOptions table={ table } />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            { table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={ headerGroup.id }>
                { headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="h-20" key={ header.id }>
                      { header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        ) }
                    </TableHead>
                  );
                }) }
              </TableRow>
            )) }
          </TableHeader>
          <TableBody>
            { isLoading ? (
              <TableRow>
                <TableCell colSpan={ columns.length } className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Carregando Documentos...
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={ columns.length } className="h-24 text-center">
                  <div className="flex justify-center items-center text-red-500">
                    <AlertCircle className="mr-2 h-4 w-4" /> Erro ao Buscar Documentos.
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={ row.id }
                  data-state={ row.getIsSelected() && "selected" }
                >
                  { row.getVisibleCells().map((cell) => (
                    <TableCell key={ cell.id }>
                      { flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      ) }
                    </TableCell>
                  )) }
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={ columns.length } className="h-24 text-center">
                  Sem resultados.
                </TableCell>
              </TableRow>
            ) }
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={ table } />
    </div>
  );
}