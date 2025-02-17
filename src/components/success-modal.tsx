import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type SuccessModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function SuccessModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}: SuccessModalProps) {
  return (
    <Dialog open={ isOpen } onOpenChange={ onClose }>
      <DialogContent className=" bg-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{ title }</DialogTitle>
          <DialogDescription>
            { description }
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={ onClose }>
            Não
          </Button>
          <Button type="button" onClick={ onConfirm }>
            Sim
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}