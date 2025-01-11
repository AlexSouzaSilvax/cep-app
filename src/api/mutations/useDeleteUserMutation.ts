import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteUser = async (id: string): Promise<void> => {
  const res = await fetch("http://localhost:8080/api/usuarios/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: id,
  });
  if (!res.ok) {
    throw new Error("Erro ao deletar usuário");
  }
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Erro ao deletar usuário:", error);
    },
  });
};
