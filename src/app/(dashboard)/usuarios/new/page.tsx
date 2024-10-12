import BackButton from "@/app/components/Admin/BackButton";
import { Container } from "@chakra-ui/react";
import Properties from "./Properties";

export default async function NewCategory() {
  return (
    <Container maxW="container.xl">
      <BackButton href="/usuarios" />
      <Properties />
    </Container>
  );
}
