import { Box, Flex } from "@chakra-ui/react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Headers from "../components/Admin/Header";
import Sidebar from "../components/Admin/Sidebar";

export const metadata: Metadata = {
  title: "FLX Transporte",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <>
      <Box position={"relative"} zIndex={10} shadow={"md"}>
        <Headers username="Bruno Santos" />
      </Box>
      <Flex alignItems={"stretch"}>
        <Sidebar />
        <Box flexGrow={1} p={3} background={"gray.100"}>
          {children}
        </Box>
      </Flex>
    </>
  );
}
