import React, { useState } from "react";
import { TrashBin2BoldDuotone } from "solar-icon-set";
import { type CrudRow } from "@/lib/table-features";
import { Button } from "@/components/ui/button";
import { ConfirmPopover } from "@/components/custom/confirm-popover";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/handle-error";

interface DataTableRowActionsProps<TData> {
  children: React.ReactNode;
  moreActions?: React.ReactNode;
  entityName?: string;
  row: CrudRow<TData>;
  deleteRow?: (row: TData) => Promise<void>;
  getDeleteConfirmMessage?: (row: TData) => Promise<string | null>;
}

export function DataTableRowActions<TData>({
  children,
  moreActions,
  entityName = "item",
  row,
  deleteRow,
  getDeleteConfirmMessage,
}: DataTableRowActionsProps<TData>) {
  const [delConfirmPopoverOpen, setDelConfirmPopoverOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState<string>(
    "Are you sure to delete it?",
  );
  const [isFetchingMsg, setIsFetchingMsg] = useState(false);

  async function handleOpenChange(open: boolean) {
    if (open && getDeleteConfirmMessage) {
      setIsFetchingMsg(true);
      try {
        const msg = await getDeleteConfirmMessage(row.original);
        if (msg) {
          setConfirmMessage(msg);
        } else {
          setConfirmMessage("Are you sure to delete it?");
        }
      } catch (e) {
        console.error("Failed to fetch delete confirmation message", e);
      } finally {
        setIsFetchingMsg(false);
      }
    } else if (!open) {
      // Reset message when closing
      setConfirmMessage("Are you sure to delete it?");
    }
    setDelConfirmPopoverOpen(open);
  }

  function clickDeleteYes(): void {
    if (!deleteRow) return;
    toast.promise(deleteRow(row.original), {
      loading: "Deleting " + entityName + "...",
      success: () => {
        setDelConfirmPopoverOpen(false);
        return "Deleted " + entityName;
      },
      error: (error) => {
        setDelConfirmPopoverOpen(false);
        return getErrorMessage(error);
      },
    });
  }

  function clickDeleteNo(): void {
    setDelConfirmPopoverOpen(false);
  }

  return (
    <div className="flex items-center space-x-2">
      {children}
      {moreActions}
      {deleteRow && (
        <ConfirmPopover
          message={isFetchingMsg ? "Checking usage..." : confirmMessage}
          onClickYes={clickDeleteYes}
          onClickNo={clickDeleteNo}
          open={delConfirmPopoverOpen}
          onOpenChange={handleOpenChange}
        >
          <Button variant="secondary" className="flex size-8 p-0 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer">
            <TrashBin2BoldDuotone size={16} />
            <span className="sr-only">Delete</span>
          </Button>
        </ConfirmPopover>
      )}
    </div>
  );
}
