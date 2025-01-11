import IUsuarios from "@/interfaces/IUsuarios.interface";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatarCPF } from "@/services/formatarCPF";
import ApagarUsuarioDialog from "../ApagarUsuarioDialog/ApagarUsuarioDialog";

const UserItem = ({
  usuario,
  onEdit,
  onDelete,
}: {
  usuario: IUsuarios;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{usuario.nome}</TableCell>
      <TableCell>{formatarCPF(usuario.cpf)}</TableCell>
      <TableCell>
        {usuario.logradouro}, {usuario.bairro} - {usuario.cidade},{" "}
        {usuario.estado} - {usuario.cep}
      </TableCell>
      <TableCell>
        <Button onClick={onEdit} title="Editar">
          Editar
        </Button>
      </TableCell>
      <TableCell>
        <ApagarUsuarioDialog onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
};

export default UserItem;
