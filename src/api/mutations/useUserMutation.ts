import IUsuarios from "@/interfaces/IUsuarios.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createUser = async (user: IUsuarios): Promise<IUsuarios> => {
  const res = await fetch("http://localhost:8080/api/usuarios/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  if (!res.ok) {
    throw new Error("Erro ao criar usuário");
  }
  return res.json();
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
