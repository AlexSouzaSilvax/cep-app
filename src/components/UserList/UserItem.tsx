import IUsuarios from "@/interfaces/IUsuarios.interface";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatarCPF } from "@/services/formatarCPF";
import ApagarUsuarioDialog from "../ApagarUsuarioDialog/ApagarUsuarioDialog";
import { Skeleton } from "../ui/skeleton";

const UserItem = ({
  usuario,
  onEdit,
  onDelete,
  isLoadingDelete,
}: {
  usuario: IUsuarios;
  onEdit: () => void;
  onDelete: () => void;
  isLoadingDelete: boolean;
}) => {
  return (
    <TableRow>
      <TableCell className="font-medium">
        {isLoadingDelete ? (
          <Skeleton className="w-20 h-3 rounded-full" />
        ) : (
          usuario.nome
        )}
      </TableCell>
      <TableCell className="whitespace-nowrap">
        {isLoadingDelete ? (
          <Skeleton className="w-20 h-3 rounded-full" />
        ) : (
          formatarCPF(usuario.cpf)
        )}
      </TableCell>
      <TableCell className="hidden sm:table-cell break-words whitespace-normal">
        {isLoadingDelete ? (
          <Skeleton className="w-35 h-3 rounded-full" />
        ) : (
          `${usuario.logradouro}, ${usuario.bairro} - ${usuario.cidade}, ${usuario.estado} - ${usuario.cep}`
        )}
      </TableCell>
      <TableCell>
        {isLoadingDelete ? (
          <Skeleton className="w-15 h-3 rounded-full" />
        ) : (
          <Button onClick={onEdit} title="Editar">
            Editar
          </Button>
        )}
      </TableCell>
      <TableCell>
        {isLoadingDelete ? (
          <Skeleton className="w-15 h-3 rounded-full" />
        ) : (
          <ApagarUsuarioDialog onDelete={onDelete} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default UserItem;
