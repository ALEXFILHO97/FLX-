"use client";

import { HStack, Icon, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export type BackButtonProps = {
  href: string;
  text?: string;
};

export default function BackButton({ href, text }: BackButtonProps) {
  return (
    <Link my={5} as={NextLink} href={href} display={"block"}>
      <HStack>
        <Icon as={FaArrowLeft} />
        <Text>{text || "Voltar"}</Text>
      </HStack>
    </Link>
  );
}
