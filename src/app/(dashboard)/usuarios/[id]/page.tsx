import BackButton from "@/app/components/Admin/BackButton";
import { proxyClient } from "@/utils/trpcProxyClient";
import { Container, HStack } from "@chakra-ui/react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { notFound } from "next/navigation";
import Dates from "./Dates";
import Properties from "./Properties";
import DeleteUserButton from "./deleteUserButton";

export default async function Course({ params }: { params: { id: string } }) {
  const userId = +params.id;
  const helpers = createServerSideHelpers({ client: proxyClient });
  await helpers.users.get.fetch(+userId).catch((e) => {
    if (e instanceof TRPCClientError) {
      if (e.message === "NOT_FOUND") notFound();
    }
  });
  helpers.users.count.prefetch();

  return (
    <HydrationBoundary state={dehydrate(helpers.queryClient)}>
      <Container maxW="container.xl">
        <HStack justifyContent={"space-between"}>
          <BackButton href="/usuarios" />
          <DeleteUserButton userId={userId} />
        </HStack>
        <Properties userId={userId} />
        <Dates userId={userId} />
      </Container>
    </HydrationBoundary>
  );
}
