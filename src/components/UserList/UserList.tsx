import { useDeleteUserMutation } from "@/api/mutations/useDeleteUserMutation";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import IUsuarios from "@/interfaces/IUsuarios.interface";
import { useState } from "react";
import UserForm from "../UserForm/UserForm";
import UserItem from "./UserItem";

const UserList = ({ data }: { data: IUsuarios[] }) => {
  const [userToEdit, setUserToEdit] = useState<IUsuarios>();

  const { mutate } = useDeleteUserMutation();

  const handleDelete = (id: string) => {
    mutate(id, {
      onSuccess: () => {
        toast({
          title: "Usuário apagado com sucesso",
          description: "",
        });
      },
      onError: (error: any) => {
        console.error("Erro ao apagar usuário:", error);
        toast({
          title: "Erro ao apagar o usuário",
          description: "",
        });
      },
    });
  };

  return (
    <>
      <UserForm userToEdit={userToEdit} isEdit={true} />
      <Table className="w-full table-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="sm:w-auto">Nome</TableHead>
            <TableHead className="sm:w-auto">CPF</TableHead>
            <TableHead className="hidden sm:table-cell w-[383px] break-words whitespace-normal">
              Endereço
            </TableHead>
            <TableHead className="sm:w-auto">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((usuario) => (
            <UserItem
              key={usuario.id}
              usuario={usuario}
              onEdit={() => setUserToEdit(usuario)}
              onDelete={() => handleDelete(usuario.id)}
            />
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default UserList;
