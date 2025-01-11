import IUsuarios from "@/interfaces/IUsuarios.interface";
import { useQuery } from "@tanstack/react-query";
import api from "../axiosInstance";

const fetchUsers = async (): Promise<IUsuarios[]> => {
  try {
    const res = await api.get("usuarios/find-all");
    return res.data;
  } catch (error) {
    throw new Error("Erro ao buscar usuarios");
  }
};

export const useUsersQuery = () => {
  return useQuery<IUsuarios[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};
