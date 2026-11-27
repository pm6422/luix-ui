import { type CrudColumn } from "@/lib/table-features";
import {
  AddCircleLinear,
  CheckSquareBoldDuotone,
  CloseCircleBoldDuotone,
} from "solar-icon-set";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: CrudColumn<TData, TValue>;
  title?: string;
  options: Option[];
  multiple?: boolean;
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  multiple = true,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const [open, setOpen] = React.useState(false);

  const columnFilterValue = column?.getFilterValue();
  const selectedValues = new Set(
    Array.isArray(columnFilterValue)
      ? columnFilterValue
      : columnFilterValue !== undefined
        ? [columnFilterValue]
        : [],
  );

  const onItemSelect = React.useCallback(
    (option: Option, isSelected: boolean) => {
      if (!column) return;

      if (multiple) {
        const newSelectedValues = new Set(selectedValues);
        if (isSelected) {
          newSelectedValues.delete(option.value);
        } else {
          newSelectedValues.add(option.value);
        }
        const filterValues = Array.from(newSelectedValues);
        column.setFilterValue(filterValues.length ? filterValues : undefined);
      } else {
        column.setFilterValue(isSelected ? undefined : option.value);
        setOpen(false);
      }
    },
    [column, multiple, selectedValues],
  );

  const onReset = React.useCallback(
    (event?: React.MouseEvent) => {
      event?.stopPropagation();
      column?.setFilterValue(undefined);
    },
    [column],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-8 px-2.5 gap-1.5 text-xs font-medium rounded-lg active:scale-95 transition-all cursor-pointer",
            selectedValues?.size > 0
              ? "bg-muted/65 text-foreground hover:bg-muted/80"
              : "bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground",
          )}
        >
          {selectedValues?.size > 0 ? (
            <div
              role="button"
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              onClick={onReset}
            >
              <CloseCircleBoldDuotone size={16} className="text-foreground/75" />
            </div>
          ) : (
            <AddCircleLinear size={16} className="text-muted-foreground" />
          )}
          <span>{title}</span>
          {selectedValues?.size > 0 && (
            <>
              <Separator
                orientation="vertical"
                className="mx-1 h-4"
              />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden text-[10px]"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden items-center gap-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal text-[10px]"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal text-[10px] flex items-center gap-1"
                      >
                        {option.icon && <option.icon className="h-3 w-3" />}
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 p-0" align="start">
        <Command>
          <CommandInput placeholder={title} className="h-9 text-xs" />
          <CommandList className="max-h-full">
            <CommandEmpty className="text-xs py-2 text-center text-muted-foreground">No results found.</CommandEmpty>
            <CommandGroup className="max-h-[240px] scroll-py-1 overflow-y-auto overflow-x-hidden p-1">
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    className="text-xs cursor-pointer flex items-center gap-2 p-1.5 rounded-sm"
                    onSelect={() => onItemSelect(option, isSelected)}
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm border border-primary/40",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "opacity-50"
                      )}
                    >
                      {isSelected && <CheckSquareBoldDuotone size={13} />}
                    </div>
                    {option.icon && (
                      <option.icon className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup className="p-1">
                  <CommandItem
                    onSelect={() => {
                      column?.setFilterValue(undefined);
                      setOpen(false);
                    }}
                    className="text-xs justify-center text-center font-medium cursor-pointer p-1.5 rounded-sm"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
