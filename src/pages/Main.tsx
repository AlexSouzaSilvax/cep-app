import { useUsersQuery } from "@/api/queries/useUsersQuery";
import ListaVazia from "@/components/ListaVazia/ListaVazia";
import Spinner from "@/components/Load/Load";
import { Separator } from "@/components/ui/separator";
import UserForm from "@/components/UserForm/UserForm";
import UserList from "@/components/UserList/UserList";
import { isMobile } from "@/services/isMobile";
import { FaUser } from "react-icons/fa"; // FaUser é o ícone de usuário do FontAwesome

const MainPage = () => {
  const { data, isLoading, error } = useUsersQuery();

  return (
    <div className="w-full max-w-[850px] mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex flex-row items-center">
          <FaUser className="h-4 w-4 text-black-500" />
          <p className="text-xl ml-2 txtComum">Gerenciamento de Usuários</p>
        </div>
        <UserForm
          userToEdit={undefined}
          isEdit={false}
          onCloseForm={() => {}}
        />
      </div>
      <Separator className="my-4" />
      {error instanceof Error ? (
        <div>Erro: {error.message}</div>
      ) : (
        <div
          className={`flex justify-center items-center ${
            isMobile ? "min-w-[344px]" : "w-[850px]"
          }`}
        >
          {isLoading ? (
            <div className="marginTopScreen">
              <Spinner />
            </div>
          ) : data?.length == 0 ? (
            <div className="marginTopScreen">
              <ListaVazia />
            </div>
          ) : (
            <UserList data={data ?? []} />
          )}
        </div>
      )}
    </div>
  );
};

export default MainPage;
