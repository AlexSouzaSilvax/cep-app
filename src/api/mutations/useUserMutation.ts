import IUsuarios from "@/interfaces/IUsuarios.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import api from "../axiosInstance";

const createUser = async (user: IUsuarios): Promise<IUsuarios> => {
  try {
    const res = await api.post("usuarios/create", user);
    return res.data;
  } catch (error) {
    throw new Error("Erro ao criar usuário ");
  }
};

export const useUsersMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<IUsuarios, Error, IUsuarios>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Erro ao criar usuário:", error);
    },
  });
};
