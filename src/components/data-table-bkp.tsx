import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface DataTableProps<TData, TFilters> {
  columns: ColumnDef<TData>[];
  data: TData[];
  isLoading?: boolean;
  sendSelected?: (tableInstance: any) => void;
  storageKey: string;
}

export function DataTable<TData, TFilters>({
  columns,
  data,
  isLoading = false,
  sendSelected,
}: DataTableProps<TData, TFilters>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({});

  const [tableInstance, setTableInstance] = useState(null);

  const reactTableInstance = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: () => { },
    onGlobalFilterChange: () => { },
    onSortingChange: () => { },
    onPaginationChange: () => { },
    state: {
      rowSelection,
      columnVisibility,
    },
  });

  useEffect(() => {
    setTableInstance(reactTableInstance);
  }, [tableInstance, reactTableInstance]);

  return (
    <div>
      <div className="rounded-md border">
        <Table className="bg-background rounded-md border shadow-md">
          <TableHeader>
            { reactTableInstance.getHeaderGroups().map((headerGroup) => (
              <TableRow key={ headerGroup.id }>
                { headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="pr-2" key={ header.id }>
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
                <TableCell
                  colSpan={ columns.length }
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="ml-2">Carregando...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : reactTableInstance.getRowModel().rows?.length ? (
              reactTableInstance.getRowModel().rows.map((row) => (
                <TableRow
                  key={ row.id }
                  data-state={ row.getIsSelected() && "selected" }
                >
                  { row.getVisibleCells().map((cell) => (
                    <TableCell key={ cell.id } className="text-sm">
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
                <TableCell
                  colSpan={ columns.length }
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            ) }
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          { reactTableInstance.getPaginationRowModel().rows.length } de{ " " }
          { reactTableInstance.getCoreRowModel().rows.length } linhas
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={ () => reactTableInstance.previousPage() }
            disabled={ !reactTableInstance.getCanPreviousPage() }
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={ () => reactTableInstance.nextPage() }
            disabled={ !reactTableInstance.getCanNextPage() }
          >
            Próxima
          </Button>
        </div>
      </div>
      <div className="flex justify-end mt-2">
        { sendSelected && (
          <Button
            variant="outline"
            size="sm"
            onClick={ () => sendSelected(reactTableInstance) }
            disabled={ !reactTableInstance.getFilteredSelectedRowModel().rows.length }
          >
            Enviar Documentos
          </Button>
        ) }
      </div>
    </div>
  );
}