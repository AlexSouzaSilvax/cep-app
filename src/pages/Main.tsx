import { useUsersQuery } from "@/api/queries/useUsersQuery";
import { Separator } from "@/components/ui/separator";
import UserForm from "@/components/UserForm/UserForm";
import UserList from "@/components/UserList/UserList";

const MainPage = () => {
  const { data, isLoading, error } = useUsersQuery();

  return (
    <div className="w-full min-w-[320px] max-w-[850px] mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <p className="text-xl">Gerenciamento de Usuários</p>
        <UserForm />
      </div>
      <Separator className="my-4" />
      {error instanceof Error ? (
        <div>Erro: {error.message}</div>
      ) : (
        <>{isLoading ? <p>loading...</p> : <UserList data={data ?? []} />}</>
      )}
    </div>
  );
};

export default MainPage;
