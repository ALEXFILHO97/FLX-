"use client";

import Input from "@/app/components/Admin/Form/Input";
import Select from "@/app/components/Admin/Form/Select";
import ErrorMessage from "@/app/components/ErrorMessage";
import { trpc } from "@/utils/trpc";
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  GridItem,
  Heading,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPencilAlt } from "react-icons/fa";
import z from "zod";

export type PropertiesProps = {
  userId: number;
};

const schema = z.object({
  name: z.string(),
  email: z.string(),
  status: z.boolean(),
  password_hash: z.string(),
});

type userData = {
  id: number;
  license_plate: string;
  user_id: number;
  driver_id: number | null;
  created_at: Date;
  updated_at: Date;
};

type FormValues = z.infer<typeof schema>;

export default function Properties({ userId }: PropertiesProps) {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: userData } = trpc.users.get.useQuery(userId);

  if (userData == null) return <ErrorMessage />;

  const { mutateAsync } = trpc.users.update.useMutation({
    onSuccess: (res) => {
      toast({
        title: "Success",
        description: "Usuario atualizado com sucesso",
        colorScheme: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.replace(`/usuarios/${res}`);
      setIsEditing(false);
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
      data: {
        ...values,
      },
      id: userId,
    });
  };

  return (
    <Box p={5} bg="white" borderRadius={"lg"} mb={3}>
      <Heading mb={3} size={"md"}>
        Informações do usuário
        <IconButton
          variant={"ghost"}
          colorScheme="gray"
          aria-label="edit"
          ml={`auto`}
          icon={<FaPencilAlt />}
          onClick={() => setIsEditing(true)}
          isDisabled={isEditing}
        />
      </Heading>
      <Form
        onSubmit={onSubmit}
        isEditing={isEditing}
        onCancel={() => setIsEditing(false)}
        values={{
          ...userData,
        }}
      />
    </Box>
  );
}

type FormProps = {
  values: FormValues;
  onSubmit: (values: FormValues) => Promise<void> | void;
  onCancel?: () => void;
  isEditing?: boolean;
};

function Form({ values, onSubmit, isEditing, onCancel }: FormProps) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid gap={3} templateColumns={"repeat(6, 1fr)"} mb={3}>
        <GridItem colSpan={3}>
          <Input
            {...register("name")}
            label="Nome"
            isReadOnly={!isEditing}
            error={errors.name?.message}
          />
        </GridItem>
        <GridItem colSpan={3}>
          <Input
            {...register("email")}
            label="E-mail"
            isReadOnly={!isEditing}
            error={errors.email?.message}
          />
        </GridItem>
        <GridItem colSpan={3}>
          <Input label="Nova senha" isReadOnly={!isEditing} />
        </GridItem>
        <GridItem colSpan={3}>
          <Select
            {...register("status")}
            label="Status"
            isReadOnly={!isEditing}
            options={[
              { value: "true", text: "Ativado" },
              { value: "false", text: "Desativado" },
            ]}
          />
        </GridItem>
      </Grid>

      {isEditing ? (
        <ButtonGroup variant={"solid"}>
          <Button
            colorScheme="gray"
            aria-label="cancel"
            type="button"
            onClick={() => {
              reset();
              onCancel?.();
            }}
          >
            Cancelar
          </Button>
          <Button colorScheme="green" aria-label="confirm" type="submit">
            Salvar
          </Button>
        </ButtonGroup>
      ) : null}
    </form>
  );
}
