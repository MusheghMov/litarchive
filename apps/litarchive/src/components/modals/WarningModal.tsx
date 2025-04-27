import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function WarningModal({
  title,
  description,
  onContinue,
  setIsOpen,
}: {
  title: string;
  description: string;
  onContinue: () => void;
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <DialogContent
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="w-max p-8"
    >
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div className="flex w-full justify-end gap-2">
        <Button
          className="text-foreground cursor-pointer"
          variant="secondary"
          onClick={() => {
            onContinue();
            setIsOpen(false);
          }}
        >
          Continue
        </Button>
        <Button
          className="text-background cursor-pointer"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          Cancel
        </Button>
      </div>
    </DialogContent>
  );
}
