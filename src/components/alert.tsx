import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

type AlertProps = {
  title: string;
  desc: string;
  onConfirm?: () => void;
  onCancel: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean; // Nova prop para indicar estado de loading
  loadingText?: string; // Nova prop para texto de loading (opcional)
  disabledConfirm?: boolean; // Nova prop para desabilitar o botão Confirmar
  disabledCancel?: boolean; // Nova prop para desabilitar o botão Cancelar
  showCancelButton?: boolean; // Nova prop para controlar a visibilidade do botão Cancelar
  showConfirmButton?: boolean; // Nova prop para controlar a visibilidade do botão Confirmar
};

export function Alert({
  isOpen,
  onOpenChange,
  title,
  desc,
  onConfirm,
  onCancel,
  confirmButtonText = "Continuar",
  cancelButtonText = "Cancelar",
  loading = false, // Valor padrão para loading é false
  loadingText, // Texto de loading opcional
  disabledConfirm = false, // Valor padrão para disabledConfirm é false
  disabledCancel = false, // Valor padrão para disabledCancel é false
  showCancelButton = true, // Valor padrão para mostrar botão Cancelar é true
  showConfirmButton = true, // Valor padrão para mostrar botão Confirmar é true
}: AlertProps) {
  return (
    <AlertDialog open={ isOpen } onOpenChange={ onOpenChange }>
      <AlertDialogContent className="bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle>{ title }</AlertDialogTitle>
          <AlertDialogDescription>
            { loading ? ( // Renderização condicional para estado de loading
              <>
                { loadingText || desc } {/* Use loadingText se fornecido, senão use desc */ }
                <Loader2 className="ml-2 h-4 w-4 animate-spin inline-block" /> {/* Ícone de loading */ }
              </>
            ) : (
              desc // Renderização normal da descrição quando não está em loading
            ) }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          { showCancelButton && (
            <AlertDialogCancel
              onClick={ onCancel }
              disabled={ disabledCancel } // Desabilita o botão Cancelar quando disabledCancel for true
            >
              { cancelButtonText }
            </AlertDialogCancel>
          ) }
          { showConfirmButton && (
            <AlertDialogAction
              onClick={ onConfirm }
              disabled={ disabledConfirm } // Desabilita o botão Confirmar quando disabledConfirm for true
            >
              { confirmButtonText }
            </AlertDialogAction>
          ) }
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}