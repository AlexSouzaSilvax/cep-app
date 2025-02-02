import {
  Sheet,
  SheetClose,
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
import IUsuarios from "@/interfaces/IUsuarios.interface";
import { callToast } from "@/services/callToast";
import { formatarCPF } from "@/services/formatarCPF";
import { isMobile } from "@/services/isMobile";
import { isValidCPF } from "@/services/validarCPF";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";

const FormSchema = z.object({
  id: z.number().optional(),
  nome: z
    .string()
    .nonempty("NOME é obrigatório")
    .regex(
      /^(?! )[a-zA-Z\u00C0-\u00FF]{2,}(?: [a-zA-Z\u00C0-\u00FF]+)*$/,
      "NOME está inválido."
    ),
  cpf: z
    .string()
    .nonempty("CPF é obrigatório")
    .min(11, { message: "CPF deve conter 11 dígitos" })
    .regex(/^\d*$/, { message: "CPF deve conter apenas números" })
    .refine(isValidCPF, { message: "CPF está inválido" }),
  cep: z
    .string()
    .nonempty("CEP é obrigatório")
    .min(8, {
      message: "CEP deve conter 8 dígitos.",
    })
    .regex(
      /^(?!0{8})([0-9]{5}-?[0-9]{3})$/,
      "CEP inválido. Use apenas os números."
    ),
  logradouro: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
});

const UserForm = ({
  userToEdit,
  isEdit,
  onCloseForm,
}: {
  userToEdit?: IUsuarios;
  isEdit: boolean;
  onCloseForm: () => void;
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

  const {
    data: endereco,
    isSuccess: isSuccessCep,
    isError: isErrorCep,
    isLoading: isLoadingCep,
  } = useCepQuery(cepValue, form.getValues("logradouro"));

  const { data: isCpfTaken, isLoading: isCheckingCpf } =
    useCheckCpfQuery(cpfValue);

  const [txtBtnSalvar, setTxtBtnSalvar] = useState("Salvar");

  const [isLoadingSalvar, setLoadingSalvar] = useState(false);

  const { mutate } = useUsersMutation();

  const [isOpen, setIsOpen] = useState(false);

  const [isCepEncontrado, setIsCepEncontrado] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      form.reset(userToEdit);
      setTxtBtnSalvar("Atualizar");
      setIsOpen(true);
    }
  }, [form, userToEdit]);

  useEffect(() => {
    setIsCepEncontrado(false);
    if (isSuccessCep) {
      handleValidCEP();
    } else if (isErrorCep) {
      setIsCepEncontrado(!isCepEncontrado);
      callToast("CEP", "CEP não encontrado.", "destructive");
    }
    if (cepValue.length < 8) {
      limpaEnderecoForm();
    }
  }, [isSuccessCep, isErrorCep, endereco, cepValue, form]);

  useEffect(() => {
    if (cpfValue.length == 11) {
      if (!isValidCPF(cpfValue)) {
        callToast("CPF", "CPF está inválido.", "destructive");
      }
    }
  }, [endereco, cpfValue, form]);

  const handleValidCEP = () => {
    if (endereco?.cep) {
      form.setValue("logradouro", endereco.logradouro);
      form.setValue("bairro", endereco.bairro);
      form.setValue("cidade", endereco.localidade);
      form.setValue("estado", endereco.estado);
    } else {
      setIsCepEncontrado(!isCepEncontrado);
      callToast("CEP", "CEP não encontrado.", "destructive");
      changeBtnSalvar();
      limpaEnderecoForm();
    }
  };

  const handleCpfValidation = () => {
    if (!isEdit) {
      if (isCpfTaken) {
        callToast("CPF", "CPF já está registrado.", "destructive");
      }
    }
  };

  function onSubmit(endereco: z.infer<typeof FormSchema>) {
    setTxtBtnSalvar("Carregando...");
    setLoadingSalvar(true);

    if (userToEdit) {
      endereco = { ...endereco, id: userToEdit.id };
    } else {
      if (isCpfTaken) {
        callToast("CPF", "O CPF já está registrado.", "destructive");
        changeBtnSalvar();
        return;
      }
    }
    if (isCepEncontrado) {
      callToast("CEP", "Por favor, informe um cep válido.", "destructive");
      changeBtnSalvar();
      return;
    }

    mutate(endereco, {
      onSuccess: () => {
        callToast(
          (userToEdit ? "Atualizado" : "Salvo") + " com sucesso",
          endereco.nome + " " + formatarCPF(endereco.cpf),
          "default"
        );
        form.reset();
        changeBtnSalvar();
        setIsOpen(!isOpen);
      },
      onError: () => {
        callToast(
          "Usuário",
          "Problema ao " + (userToEdit ? "atualizar" : "salvar") + " o usuário",
          "destructive"
        );
        form.reset();
        changeBtnSalvar();
        setIsOpen(!isOpen);
      },
    });
  }

  const changeBtnSalvar = () => {
    setTxtBtnSalvar("Salvar");
    setLoadingSalvar(false);
  };

  const limpaEnderecoForm = () => {
    form.setValue("logradouro", "");
    form.setValue("bairro", "");
    form.setValue("cidade", "");
    form.setValue("estado", "");
  };

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

      <SheetContent
        className={`flex flex-col overflow-y-auto ${
          isMobile ? "h-screen w-screen overflow-y-auto" : "max-h-screen"
        }`}
        side={isMobile ? "top" : "right"}
        onCloseAutoFocus={() => {
          form.reset();
          onCloseForm();
        }}
      >
        <SheetClose asChild></SheetClose>

        <SheetHeader className="flex justify-center items-center">
          <div className="flex flex-row">
            <FaUser className="h-4 w-4 text-black-500" />
            <SheetTitle className="text-xl ml-2 txtComum">
              Cadastro de Usuário
            </SheetTitle>
          </div>
          <SheetDescription>Preencha o formulário</SheetDescription>
        </SheetHeader>

        {/** FORM */}
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* NOME */}
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem className="marginTopItemForm">
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="seu nome"
                        {...field}
                        autoFocus={!isEdit}
                        onInput={(e) => {
                          const input = e.target as HTMLInputElement;

                          input.value = input.value.replace(
                            /[^a-zA-Z\u00C0-\u00FF ]/g,
                            ""
                          );
                          input.value = input.value.replace(/\b\w/g, (letra) =>
                            letra.toUpperCase()
                          );

                          field.onChange(input.value.trimStart());
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CPF */}
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem className="marginTopItemForm">
                    <FormLabel>CPF *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="seu cpf"
                        {...field}
                        value={isEdit ? formatarCPF(field.value) : field.value}
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
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem className="marginTopItemForm">
                    <FormLabel>CEP *</FormLabel>
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
                    <>
                      {isLoadingCep ? (
                        <FormMessage>Consultando CEP...</FormMessage>
                      ) : isCepEncontrado ? (
                        <FormMessage>CEP não encontrado.</FormMessage>
                      ) : (
                        <FormMessage />
                      )}
                    </>
                  </FormItem>
                )}
              />

              {/* LOGRADOURO */}
              <FormField
                control={form.control}
                name="logradouro"
                render={({ field }) => (
                  <FormItem className="marginTopItemForm">
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
                control={form.control}
                name="bairro"
                render={({ field }) => (
                  <FormItem className="marginTopItemForm">
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
                control={form.control}
                name="cidade"
                render={({ field }) => (
                  <FormItem className="marginTopItemForm">
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
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem className="marginTopItemForm">
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} disabled={!isEdit} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SheetFooter
                style={{ marginTop: "20px" }}
                className={`${isMobile ? "mb-60" : ""}`}
              >
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
