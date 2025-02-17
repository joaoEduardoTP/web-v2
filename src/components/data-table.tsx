/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState } from "react";

type DataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  onRowSelectionChangeParent: (selectedRows: TData[], selection: any) => void;
  parentRowSelection: any;
  setParentRowSelection: React.Dispatch<React.SetStateAction<any>>;
};


function DataTable<TData>({ columns, data, onRowSelectionChangeParent, parentRowSelection, setParentRowSelection }: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updaterOrValue) => {
      const newRowSelection =
        updaterOrValue instanceof Function
          ? updaterOrValue(parentRowSelection)
          : updaterOrValue;

      setParentRowSelection(newRowSelection);

      const selectedRowIds = Object.keys(newRowSelection);
      const selectedRows = table
        .getRowModel()
        .rows.filter(row => selectedRowIds.includes(row.id))
        .map(row => row.original as TData);

      onRowSelectionChangeParent(selectedRows, newRowSelection);
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: parentRowSelection,
    },
  });


  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar documentos"
          value={ (table.getColumn("identifier")?.getFilterValue() as string) ?? "" }
          onChange={ (event) =>
            table.getColumn("identifier")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="ml-auto hover: bg-accent ">
              Colunas <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            { table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={ column.id }
                    className="capitalize"
                    checked={ column.getIsVisible() }
                    onCheckedChange={ (value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    { column.columnDef.header }
                  </DropdownMenuCheckboxItem>
                );
              }) }
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md bg-card border">
        <Table>
          <TableHeader  >
            { table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={ headerGroup.id }>
                { headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={ header.id }>
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
            { table.getRowModel().rows?.length ? (
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
                <TableCell
                  colSpan={ columns.length }
                  className="h-24 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            ) }
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          { table.getFilteredSelectedRowModel().rows.length } de{ " " }
          { table.getFilteredRowModel().rows.length } linhas(s) selecionadas.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={ () => table.previousPage() }
            disabled={ !table.getCanPreviousPage() }
          >
            Voltar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={ () => table.nextPage() }
            disabled={ !table.getCanNextPage() }
          >
            Avançar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(DataTable);