import { useQuery } from "@tanstack/react-query";

import api from "../axiosInstance";

const checkCpf = async (cpf: string): Promise<boolean> => {
  try {
    const res = await api.get(`usuarios/check-cpf/${cpf}`);
    return res.data;
  } catch (error) {
    throw new Error("Erro ao verificar cpf");
  }
};

export const useCheckCpfQuery = (cpf: string) => {
  return useQuery<boolean, Error>({
    queryKey: ["checkCpf", cpf],
    queryFn: () => checkCpf(cpf),
    enabled: cpf.length == 11,
  });
};
