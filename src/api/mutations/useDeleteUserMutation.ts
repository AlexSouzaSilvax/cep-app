import { useMutation, useQueryClient } from "@tanstack/react-query";

import api from "../axiosInstance";

const deleteUser = async (id: number): Promise<void> => {
  try {
    await api.post("usuarios/delete", `${id}`);
  } catch (error) {
    throw new Error("Erro ao deletar usuário");
  }
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Erro ao deletar usuário:", error);
    },
  });
};
