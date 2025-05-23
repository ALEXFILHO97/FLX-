"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CreateWaybillPage() {
  const { register, handleSubmit } = useForm();
  const toast = useToast();
  const router = useRouter();
  const { data: session } = useSession();

  const { data: drivers = [] } = trpc.drivers.getMany.useQuery(); // ajuste se necessário
  const createWaybill = trpc.waybills.create.useMutation();

  const onSubmit = async (data: any) => {
    if (!session?.user?.id) {
      toast({ title: "Usuário não logado", status: "error" });
      return;
    }

    try {
      await createWaybill.mutateAsync({
        license_plate: data.plate,
        driver_id: parseInt(data.driver_id),
        user_id: session.user.id,
      });

      toast({ title: "Romaneio criado com sucesso", status: "success" });
      router.push("/romaneio");
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, status: "error" });
    }
  };

  return (
    <Box bg="white" p={6} rounded="md" shadow="md" maxW="lg" mx="auto" mt={8}>
      <Heading size="md" mb={4}>
        Novo Romaneio
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mb={3}>
          <FormLabel>Placa do veículo</FormLabel>
          <Input type="text" {...register("plate")} required />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Motorista</FormLabel>
          <Select placeholder="Selecione" {...register("driver_id")} required>
            {drivers.map((d: any) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" colorScheme="green">
          Salvar Romaneio
        </Button>
      </form>
    </Box>
  );
}
