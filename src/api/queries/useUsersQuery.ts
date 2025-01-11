import IUsuarios from "@/interfaces/IUsuarios.interface";
import { useQuery } from "@tanstack/react-query";

const fetchUsers = async (): Promise<IUsuarios[]> => {
  const res = await fetch("http://localhost:8080/api/usuarios/find-all");
  if (!res.ok) {
    throw new Error("Erro ao buscar os dados");
  }
  return res.json();
};

export const useUsersQuery = () => {
  return useQuery<IUsuarios[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};
