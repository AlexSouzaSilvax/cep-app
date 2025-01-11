import ICep from "@/interfaces/ICep.interface";
import { useQuery } from "@tanstack/react-query";

import api from '../axiosInstance';

const getCep = async (cep: string): Promise<ICep> => {
  try {
    const res = await api.get(`cep/find-by-cep?cep=${cep}`);
    return res.data;
  } catch (error) {
    throw new Error("Erro ao buscar os dados");
  }
};


export const useCepQuery = (cep: string) => {
  return useQuery<ICep, Error>({
    queryKey: ["cep", cep],
    queryFn: () => getCep(cep),
    enabled: cep.length == 8,
  });
};
