import { useQuery } from "@tanstack/react-query";

type User = {
  id: number;
  nome: string;
};

const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch("http://192.168.0.100:8080/api/usuarios/find-all");
  if (!res.ok) {
    throw new Error("Erro ao buscar os dados");
  }
  return res.json();
};

const MainPage = () => {
  const { data, error, isLoading } = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) return <div>Carregando...</div>;
  if (error instanceof Error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      <h1>Usuários</h1>
      <ul>
        {data?.map((user) => (
          <li key={user.id}>{user.nome}</li>
        ))}
      </ul>
    </div>
  );
};

export default MainPage;
