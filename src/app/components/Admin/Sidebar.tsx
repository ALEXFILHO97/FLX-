"use client";

import { Box, HStack, Icon, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
import { FaTruck, FaUser, FaWrench } from "react-icons/fa";

type SidebarLink = {
  icon: IconType;
  label: string;
  href: string;
};

const sidebarLinks: SidebarLink[] = [
  {
    icon: FaTruck,
    label: "Romaneios",
    href: "/",
  },
  {
    icon: FaWrench,
    label: "Configurações",
    href: "/configuracoes",
  },
  {
    icon: FaUser,
    label: "Usuários",
    href: "/usuarios",
  },
];

export type SidebarProps = {};

export default function Sidebar({}: SidebarProps) {
  const pathname = usePathname();

  return (
    <Box bg={"flx.600"}>
      <Box
        w="280px"
        p={3}
        top={0}
        position={"sticky"}
        h="calc(100vh - var(--chakra-sizes-24))"
      >
        {sidebarLinks.map(({ icon, href, label }) => {
          const isFocused =
            href !== "/" ? pathname.startsWith(href) : pathname === href;

          return (
            <Link
              key={href}
              as={NextLink}
              href={href}
              mb={1}
              display={"block"}
              _hover={{
                textDecoration: "none",
              }}
            >
              <HStack
                bg={isFocused ? "flx.500" : undefined}
                color={isFocused ? "flx.600" : "gray.400"}
                _hover={{
                  bg: "flx.500",
                  color: "white",
                }}
                px={5}
                py={3}
                borderRadius={"lg"}
                spacing={3}
              >
                <Icon as={icon} />
                <Text>{label}</Text>
              </HStack>
            </Link>
          );
        })}
      </Box>
    </Box>
  );
}
