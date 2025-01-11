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
import { useUsersQuery } from "../../api/queries/useUsersQuery";
import UserForm from "../UserForm/UserForm";
import UserItem from "./UserItem";

const UserList = () => {
  const { data, isLoading, error } = useUsersQuery();
  const [userToEdit, setUserToEdit] = useState<IUsuarios>();

  const { mutate } = useDeleteUserMutation();

  if (isLoading) return <div>Carregando...</div>;
  if (error instanceof Error) return <div>Erro: {error.message}</div>;

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nome</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead>Ações</TableHead>
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
