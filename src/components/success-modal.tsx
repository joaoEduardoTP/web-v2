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
  onClose: () => void;
  onConfirm: () => void;
};

export default function SuccessModal({
  isOpen,
  onClose,
  onConfirm,
}: SuccessModalProps) {
  return (
    <Dialog open={ isOpen } onOpenChange={ onClose }>
      <DialogContent className=" bg-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Documentos Registrados com Sucesso!</DialogTitle>
          <DialogDescription>
            Deseja cadastrar mais documentos?
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