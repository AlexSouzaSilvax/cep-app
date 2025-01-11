import ICep from "@/interfaces/ICep.interface";
import { useQuery } from "@tanstack/react-query";

const getCep = async (cep: string): Promise<ICep> => {
  const res = await fetch(
    `http://localhost:8080/api/cep/find-by-cep?cep=${cep}`
  );
  if (!res.ok) {
    throw new Error("Erro ao buscar os dados");
  }
  return res.json();
};

export const useCepQuery = (cep: string) => {
  return useQuery<ICep, Error>({
    queryKey: ["cep", cep],
    queryFn: () => getCep(cep),
    enabled: cep.length == 8,
  });
};
