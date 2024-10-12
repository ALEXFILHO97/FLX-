"use client";

import { trpc } from "@/utils/trpc";
import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";

export type DeleteUserButtonProps = {
  userId: number;
};

export default function DeleteUserButton({ userId }: DeleteUserButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending } = trpc.users.delete.useMutation({
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        colorScheme: "red",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Usuario apagado com sucesso",
        colorScheme: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.replace("/usuarios");
    },
  });

  return (
    <>
      <IconButton
        title="Deletar categoria"
        aria-label="delete"
        colorScheme="red"
        icon={<FaTrash />}
        onClick={() => setIsOpen(true)}
      />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Você tem certeza?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Essa ação não tem reversão, deseja realmente deletar esse usuário?
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button
              colorScheme="red"
              onClick={() => mutate(userId)}
              isLoading={isPending}
            >
              Apagar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
