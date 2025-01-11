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
      },
    });
  };

  return (
    <>
      <UserForm userToEdit={userToEdit} isEdit={true} />
      <Table className="w-full table-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] sm:w-auto">Nome</TableHead>
            <TableHead className="w-[120px] sm:w-auto">CPF</TableHead>
            <TableHead className="hidden sm:table-cell">Endereço</TableHead>
            <TableHead className="w-[100px] sm:w-auto">Ações</TableHead>
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
