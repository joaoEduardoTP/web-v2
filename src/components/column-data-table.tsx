import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={ cn(className) }>{ title }</div>;
  }

  return (
    <div className={ cn("flex items-center space-x-1", className) }>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={ cn("-ml-3 data-[state=open]:bg-accent", "max-w-[120px]", "flex items-center justify-between") }
          >
            <span>{ title }</span>
            <div className="w-4">
              { column.getIsSorted() === "desc" ? (
                <ArrowDown />
              ) : column.getIsSorted() === "asc" ? (
                <ArrowUp />
              ) : (
                <ChevronsUpDown />
              ) }
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={ () => column.toggleSorting(false) }>
            <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70" />
            Mais recente
          </DropdownMenuItem>
          <DropdownMenuItem onClick={ () => column.toggleSorting(true) }>
            <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70" />
            Mais Antigo
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={ () => column.toggleVisibility(false) }>
            <EyeOff className="h-3.5 w-3.5 text-muted-foreground/70" />
            Esconder
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}