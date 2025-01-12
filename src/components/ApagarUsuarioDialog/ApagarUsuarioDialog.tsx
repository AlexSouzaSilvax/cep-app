import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ApagarUsuarioDialog = ({ onDelete }: { onDelete: () => void }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="button">Excluir</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação é irreversivel e apagará para sempre este usuário.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel style={{ color: "#1a1a1a" }}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            autoFocus={true}
            onClick={onDelete}
            style={{ backgroundColor: "red" }}
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ApagarUsuarioDialog;
