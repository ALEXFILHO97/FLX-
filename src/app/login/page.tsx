import Logo from "@/assets/logo.png";
import { Box, Container, Img } from "@chakra-ui/react";

export default function Login() {
  return (
    <Container maxW="container.xl">
      <Box
        bg={"flx.500"}
        flex={1}
        display={"flex"}
        alignItems={"center"}
        textAlign={"center"}
      >
        <Img src={Logo.src} margin={"auto"} maxW={"40%"} mt={"auto"} />
      </Box>
    </Container>
  );
}
