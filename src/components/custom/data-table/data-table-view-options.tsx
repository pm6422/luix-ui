import { Tuning2BoldDuotone } from "solar-icon-set";
import { type CrudColumn } from "@/lib/table-features";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";

interface DataTableViewOptionsProps<TData> {
  columns: Array<CrudColumn<TData, unknown>>;
  className?: string;
}

export function DataTableViewOptions<TData>({
  columns,
  className,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "hidden h-8 md:flex px-2.5 gap-1.5 text-xs font-medium rounded-lg bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground active:scale-95 transition-all cursor-pointer",
            className,
          )}
        >
          <Tuning2BoldDuotone size={16} />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-fit">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide(),
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
