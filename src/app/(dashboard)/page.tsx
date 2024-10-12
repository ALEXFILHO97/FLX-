import { Box, Container, HStack, Heading } from "@chakra-ui/react";
import { HydrationBoundary } from "@tanstack/react-query";
import WaybillList from "./waybillList";

export default async function Page() {
  return (
    <HydrationBoundary>
      <Container maxW="container.xl">
        <Box p={5} bg="white" borderRadius={"lg"}>
          <HStack spacing={5} mb={3}>
            <Heading size={"md"}>Romaneios</Heading>
          </HStack>
          <WaybillList />
        </Box>
      </Container>
    </HydrationBoundary>
  );
}
