

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import { useRef } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

const Modal = (modalProps: ModalProps) => {
  const ref = useRef(null);
  const { open, onClose, title, description, children, footer } = modalProps;
  return (
    <Dialog open={ open } onOpenChange={ onClose }>
      <DialogContent ref={ ref } className="sm:max-w-[680px] bg-card">
        { title || description ? (
          <DialogHeader>
            { title && <DialogTitle>{ title }</DialogTitle> }
            { description && <DialogDescription>
              { description }
            </DialogDescription> }
          </DialogHeader>
        ) : null }
        <div className="pb-4 pt-2">{ children }</div>
        { footer ? (
          <DialogFooter>
            { footer }
          </DialogFooter>
        ) : null }
      </DialogContent>
    </Dialog>
  );
};

export default Modal;