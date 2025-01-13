import { useDeleteUserMutation } from "@/api/mutations/useDeleteUserMutation";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import IUsuarios from "@/interfaces/IUsuarios.interface";
import { callToast } from "@/services/callToast";
import { useState } from "react";
import UserForm from "../UserForm/UserForm";
import UserItem from "./UserItem";

const UserList = ({ data }: { data: IUsuarios[] }) => {
  const [userToEdit, setUserToEdit] = useState<IUsuarios>();

  const { mutate } = useDeleteUserMutation();

  const [idUsuarioDelete, setIdUsuarioDelete] = useState<number>();

  const handleDelete = (id: number | undefined) => {
    if (id === undefined) {
      callToast(
        "Usuário",
        "Usuário não encontrado para ser excluído.",
        "destructive"
      );
      return;
    }

    setIdUsuarioDelete(id);

    mutate(id, {
      onSuccess: () => {
        callToast("Usuário apagado com sucesso", "", "default");
      },
      onError: () => {
        callToast("Usuário", "Problema ao apagar o usuário.", "destructive");
      },
    });

    setIdUsuarioDelete(undefined);
  };

  return (
    <>
      <UserForm
        userToEdit={userToEdit}
        isEdit={true}
        onCloseForm={() => setUserToEdit(undefined)}
      />
      <Table className="w-full table-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="sm:w-auto">Nome</TableHead>
            <TableHead className="sm:w-auto">CPF</TableHead>
            <TableHead className="hidden sm:table-cell w-[383px] break-words whitespace-normal">
              Endereço
            </TableHead>
            <TableHead className="w-[10px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((usuario) => (
            <UserItem
              key={usuario.id}
              usuario={usuario}
              onEdit={() => setUserToEdit(usuario)}
              onDelete={() => handleDelete(usuario.id)}
              isLoadingDelete={usuario.id == idUsuarioDelete ? true : false}
            />
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default UserList;
