export function formatarCPF(cpf: string | number): string {
  const cpfNumerico = String(cpf).replace(/\D/g, "");

  if (cpfNumerico.length !== 11) {
    console.error("O CPF deve conter exatamente 11 dígitos.");
    return "";
  }

  return cpfNumerico.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
