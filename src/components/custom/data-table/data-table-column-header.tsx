import {
  AltArrowDownLinear,
  AltArrowUpLinear,
  EyeClosedBoldDuotone,
} from "solar-icon-set";
import { type CrudColumn } from "@/lib/table-features";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import React from "react";

interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends React.HTMLAttributes<HTMLDivElement> {
  column: CrudColumn<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className, "text-xs")}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent cursor-pointer"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <AltArrowDownLinear size={13} className="ml-1.5 stroke-[2.5]" />
            ) : column.getIsSorted() === "asc" ? (
              <AltArrowUpLinear size={13} className="ml-1.5 stroke-[2.5]" />
            ) : (
              <AltArrowDownLinear size={13} className="ml-1.5 opacity-30 stroke-[2]" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)} className="text-xs font-semibold">
            <AltArrowUpLinear size={14} className="mr-2 text-primary stroke-[2.5]" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)} className="text-xs font-semibold">
            <AltArrowDownLinear size={14} className="mr-2 text-primary stroke-[2.5]" />
            Desc
          </DropdownMenuItem>
          {column.getCanHide() && <DropdownMenuSeparator />}
          {column.getCanHide() && (
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)} className="text-xs font-semibold">
              <EyeClosedBoldDuotone size={14} className="mr-2 text-muted-foreground" />
              Hide
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
