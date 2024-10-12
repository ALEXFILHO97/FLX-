import Logo from "@/assets/logo.png";
import { HStack, Img } from "@chakra-ui/react";

export type HeaderProps = {
  username?: string;
};

export default function Header({ username }: HeaderProps) {
  return (
    <HStack h={24} bg="flx.600" justifyContent={"space-between"}>
      <HStack p={5}>
        <Img src={Logo.src} maxW={"25%"} ml="auto" />
      </HStack>
    </HStack>
  );
}
