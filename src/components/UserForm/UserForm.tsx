import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useUsersMutation } from "@/api/mutations/useUserMutation";
import { useCepQuery } from "@/api/queries/useCepQuery";
import { useCheckCpfQuery } from "@/api/queries/useCheckCpfQuery";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import IUsuarios from "@/interfaces/IUsuarios.interface";
import { useEffect, useState } from "react";

const FormSchema = z.object({
  id: z.number().optional(),
  nome: z.string().nonempty("NOME é obrigatório"),
  cpf: z
    .string()
    .min(1, { message: "CPF é obrigatório" })
    .max(11, { message: "O CPF deve ter até 11 dígitos" })
    .regex(/^\d*$/, { message: "CPF deve conter apenas números" }),
  cep: z
    .string()
    .min(1, { message: "CEP é obrigatório" })
    .max(8, {
      message: "CEP inválido.",
    })
    .nonempty("CEP é obrigatório")
    .regex(/^\d{5}-?\d{3}$/, "CEP inválido. Use apenas os números."),
  logradouro: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
});

const UserForm = ({
  userToEdit,
  isEdit,
}: {
  userToEdit?: IUsuarios;
  isEdit: boolean;
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      nome: "",
      cpf: "",
      cep: "",
      logradouro: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
  });

  const cepValue = form.watch("cep"); // Monitorando o valor do CEP
  const cpfValue = form.watch("cpf"); // Monitorando o CPF digitado

  const { data } = useCepQuery(cepValue);
  const { data: isCpfTaken, isLoading: isCheckingCpf } =
    useCheckCpfQuery(cpfValue);

  const [txtBtnSalvar, setTxtBtnSalvar] = useState("Salvar");

  const [isLoadingSalvar, setLoadingSalvar] = useState(false);

  const { mutate } = useUsersMutation();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      form.reset(userToEdit);
      setTxtBtnSalvar("Atualizar");
      setIsOpen(true);
    }
  }, [userToEdit]);

  useEffect(() => {
    if (cepValue.length >= 8) {
      handleValidCEP();
    }
  }, [data, cepValue, form]);

  // Função para buscar endereço pelo CEP
  const handleValidCEP = async () => {
    if (data) {
      form.setValue("logradouro", data.logradouro);
      form.setValue("bairro", data.bairro);
      form.setValue("cidade", data.localidade);
      form.setValue("estado", data.estado);
    } else {
      console.error("CEP não encontrado.");
    }
  };

  const handleCpfValidation = () => {
    if (!isEdit) {
      if (isCpfTaken) {
        toast({
          title: "Erro",
          description: "O CPF já está registrado",
          variant: "destructive",
        });
      }
    }
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setTxtBtnSalvar("Carregando...");
    setLoadingSalvar(true);

    if (userToEdit) {
      data = { ...data, id: userToEdit.id };
    } else {
      if (isCpfTaken) {
        toast({
          title: "Erro",
          description: "O CPF já está registrado",
          variant: "destructive",
        });
        return;
      }
    }

    mutate(data, {
      onSuccess: () => {
        toast({
          title: userToEdit ? "Atualizado com sucesso" : "Salvo com sucesso",
          description: "",
        });
        form.reset();

        setTxtBtnSalvar("Salvar");
        setLoadingSalvar(false);
        setIsOpen(!isOpen);
      },
      onError: () => {
        toast({
          title:
            "Erro ao " + (userToEdit ? "atualizar" : "salvar") + " o usuário",
          description: "",
        });
        form.reset();
        setTxtBtnSalvar("Salvar");
        setLoadingSalvar(false);
      },
    });
  }

  return (
    <Sheet key="right" open={isOpen} onOpenChange={setIsOpen}>
      {!isEdit ? (
        <Button
          title="Novo"
          style={{
            marginTop: "5px",
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          Novo
        </Button>
      ) : (
        <></>
      )}

      <SheetContent side={"right"}>
        <SheetHeader>
          <SheetTitle>Cadastro de Usuário</SheetTitle>
          <SheetDescription>Preencha o formulário</SheetDescription>
        </SheetHeader>

        {/** FORM */}
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* NOME */}
              <FormField
                className="grid grid-cols-4 items-center gap-4"
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CPF */}
              <FormField
                className="grid grid-cols-4 items-center gap-4"
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="seu cpf"
                        {...field}
                        maxLength={11}
                        onInput={(e) => {
                          const input = e.target as HTMLInputElement;
                          input.value = input.value.replace(/\D/g, "");
                          field.onChange(input.value);
                        }}
                        onBlur={handleCpfValidation}
                        disabled={isEdit}
                      />
                    </FormControl>
                    {!isEdit ? (
                      <>
                        {isCheckingCpf ? (
                          <FormMessage>Verificando CPF...</FormMessage>
                        ) : isCpfTaken ? (
                          <FormMessage>CPF já está registrado</FormMessage>
                        ) : (
                          <FormMessage />
                        )}{" "}
                      </>
                    ) : (
                      <></>
                    )}
                  </FormItem>
                )}
              />

              {/* CEP */}
              <FormField
                className="grid grid-cols-4 items-center gap-4"
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="seu cep"
                        {...field}
                        maxLength={8}
                        onInput={(e) => {
                          const input = e.target as HTMLInputElement;
                          input.value = input.value.replace(/\D/g, "");
                          field.onChange(input.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* LOGRADOURO */}
              <FormField
                className="grid grid-cols-4 items-center gap-4"
                control={form.control}
                name="logradouro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logradouro</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} disabled={!isEdit} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* BAIRRO */}
              <FormField
                className="grid grid-cols-4 items-center gap-4"
                control={form.control}
                name="bairro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} disabled={!isEdit} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CIDADE */}
              <FormField
                className="grid grid-cols-4 items-center gap-4"
                control={form.control}
                name="cidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} disabled={!isEdit} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ESTADO */}
              <FormField
                className="grid grid-cols-4 items-center gap-4"
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} disabled={!isEdit} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SheetFooter style={{ marginTop: "15px" }}>
                <Button
                  style={{ width: "100%" }}
                  type="submit"
                  disabled={isLoadingSalvar}
                >
                  {txtBtnSalvar}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserForm;
