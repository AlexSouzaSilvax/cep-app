export default interface IUsuarios {
  id?: number;
  nome: string;
  cpf: string;
  cep: string;
  logradouro?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  data_criacao?: string;
  data_atualizacao?: string;
}
