import { useQuery } from "@tanstack/react-query";

const checkCpf = async (cpf: string): Promise<boolean> => {
  const res = await fetch(`http://localhost:8080/api/usuarios/check-cpf/${cpf}`);
  if (!res.ok) {
    throw new Error("Erro ao verificar CPF");
  }
  return res.json();
};

export const useCheckCpfQuery = (cpf: string) => {
  return useQuery<boolean, Error>({
    queryKey: ["checkCpf", cpf],
    queryFn: () => checkCpf(cpf),
    enabled: cpf.length == 11,
  });
};
