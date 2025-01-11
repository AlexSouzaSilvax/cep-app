import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import IUsuarios from "@/interfaces/IUsuarios.interface";
import { useState } from "react";
import { useUsersQuery } from "../../api/queries/useUsersQuery";
import UserForm from "../UserForm/UserForm";
import UserItem from "./UserItem";

const UserList = () => {
  const { data, isLoading, error } = useUsersQuery();
  const [userToEdit, setUserToEdit] = useState<IUsuarios>();

  if (isLoading) return <div>Carregando...</div>;
  if (error instanceof Error) return <div>Erro: {error.message}</div>;

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
              onEdit={() => {
                setUserToEdit(usuario);
                console.log(JSON.stringify(usuario));
              }}
              onDelete={() => alert("delete")}
            />
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default UserList;
