"use client";

import Input from "@/app/components/Admin/Form/Input";
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
  courseId: number;
};

const schema = z.object({
  license_plate: z.string(),
});

type courseData = {
  id: number;
  license_plate: string;
  user_id: number;
  driver_id: number | null;
  created_at: Date;
  updated_at: Date;
};

type FormValues = z.infer<typeof schema>;

export default function Properties({ courseId }: PropertiesProps) {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: courseData } = trpc.waybill.get.useQuery(courseId);

  if (courseData == null) return <ErrorMessage />;

  const { mutateAsync } = trpc.waybill.update.useMutation({
    onSuccess: (res) => {
      toast({
        title: "Success",
        description: "Curso atualizado com sucesso",
        colorScheme: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["course"] });
      router.replace(`/admin/course/${res}`);
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
        licence_place: "",
      },
      id: courseId,
    });
  };

  return (
    <Box p={5} bg="white" borderRadius={"lg"} mb={3}>
      <Heading mb={3} size={"md"}>
        Informações do processo
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
        courseData={courseData}
        onCancel={() => setIsEditing(false)}
        values={{
          ...courseData,
        }}
      />
    </Box>
  );
}

type FormProps = {
  values: FormValues;
  onSubmit: (values: FormValues) => Promise<void> | void;
  onCancel?: () => void;
  courseData: courseData;
  isEditing?: boolean;
};

function Form({
  values,
  onSubmit,
  isEditing,
  onCancel,
  courseData,
}: FormProps) {
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
            {...register("license_plate")}
            label="Placa do cavalo"
            isReadOnly={!isEditing}
            error={errors.license_plate?.message}
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
