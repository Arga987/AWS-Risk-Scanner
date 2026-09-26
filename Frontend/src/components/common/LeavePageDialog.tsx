import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Blocker } from "react-router-dom";
import { Button } from "../ui/button";

type Props = {
  blocker: Blocker;
  title?: string;
  message?: string;
};

const LeavePageDialog = ({
  blocker,
  title = "Security Group Dialog",
  message = "Are you sure you want to leave this page?",
}: Props) => {
  const isOpen = blocker.state === "blocked";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          blocker.reset();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">{message}</p>

        <div className="flex justify-end gap-3">
          <Button onClick={() => blocker.reset()} className="cursor-pointer">
            Stay
          </Button>

          <Button
            onClick={() => blocker.proceed()}
            className="cursor-pointer bg-red-500 text-white hover:bg-red-600"
          >
            Leave
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeavePageDialog;
