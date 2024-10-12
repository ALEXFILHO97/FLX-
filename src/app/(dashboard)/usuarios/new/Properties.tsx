"use client";

import Input from "@/app/components/Admin/Form/Input";
import Select from "@/app/components/Admin/Form/Select";
import { trpc } from "@/utils/trpc";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Grid,
  GridItem,
  Heading,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

export type PropertiesProps = {};

const schema = z.object({
  name: z.string(),
  email: z.string(),
  status: z.boolean(),
  password: z.string(),
});

type FormValues = z.infer<typeof schema>;

export default function Properties({}: PropertiesProps) {
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = trpc.users.create.useMutation({
    onSuccess: (res) => {
      toast({
        title: "Success",
        description: "Usuario criado com sucesso",
        colorScheme: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.replace(`/usuarios/${res.id}`);
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        colorScheme: "red",
      });
    },
  });

  const onSubmit = async (values: FormValues) => {
    await mutateAsync({
      ...values,
    });
  };

  return (
    <Box p={5} bg="white" borderRadius={"lg"}>
      <Heading mb={3} size={"md"}>
        Criar usuário
      </Heading>
      <Form isLoading={isPending} onSubmit={onSubmit} />
    </Box>
  );
}

type FormProps = {
  isLoading?: boolean;
  onSubmit: (values: FormValues) => Promise<void> | void;
};

function Form({ onSubmit, isLoading }: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid gap={3} templateColumns={"repeat(6, 1fr)"} mb={3}>
        <GridItem colSpan={3}>
          <Input
            {...register("name")}
            label="Nome"
            error={errors.name?.message}
          />
        </GridItem>
        <GridItem colSpan={3}>
          <Input
            {...register("email")}
            label="E-mail"
            error={errors.email?.message}
          />
        </GridItem>
        <GridItem colSpan={3}>
          <Input
            label="Nova senha"
            {...register("password")}
            error={errors.password?.message}
          />
        </GridItem>
        <GridItem colSpan={3}>
          <Select
            {...register("status")}
            label="Status"
            error={errors.status?.message}
            options={[
              { value: "true", text: "Ativado" },
              { value: "false", text: "Desativado" },
            ]}
          />
        </GridItem>
      </Grid>
      <ButtonGroup variant={"solid"}>
        <Button colorScheme="green" aria-label="confirm" type="submit">
          Salvar
        </Button>
      </ButtonGroup>
    </form>
  );
}
