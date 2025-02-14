import { Column } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, FilterIcon } from "lucide-react";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
  }[];
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex">
          <FilterIcon className="w-4 h-4 mr-2" />
          { title }
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={ title } />
          <CommandList>
            <CommandEmpty>Nenhum documento encontrado.</CommandEmpty>
            <CommandGroup>
              { options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={ option.value }
                    onSelect={ () => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    } }
                  >
                    <div className="mr-6 text-lg">
                      { isSelected && <Check /> }
                    </div>
                    <span>{ option.label }</span>
                    { facets?.get(option.value) && (
                      <span className="flex items-center justify-center w-4 h-4 ml-auto font-mono text-xs">
                        { facets.get(option.value) }
                      </span>
                    ) }
                  </CommandItem>
                );
              }) }
            </CommandGroup>
            { selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={ () => column?.setFilterValue(undefined) }
                    className="justify-center text-center"
                  >
                    Limpar Filtros
                  </CommandItem>
                </CommandGroup>
              </>
            ) }
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}