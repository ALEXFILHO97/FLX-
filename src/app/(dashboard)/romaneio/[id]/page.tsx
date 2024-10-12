import BackButton from "@/app/components/Admin/BackButton";
import { proxyClient } from "@/utils/trpcProxyClient";
import { Container, HStack } from "@chakra-ui/react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { notFound } from "next/navigation";
import Dates from "./Dates";
import Properties from "./Properties";

export default async function Course({ params }: { params: { id: string } }) {
  const waybillId = +params.id;
  const helpers = createServerSideHelpers({ client: proxyClient });
  await helpers.waybill.get.fetch(+waybillId).catch((e) => {
    if (e instanceof TRPCClientError) {
      if (e.message === "NOT_FOUND") notFound();
    }
  });
  helpers.waybill.count.prefetch();

  return (
    <HydrationBoundary state={dehydrate(helpers.queryClient)}>
      <Container maxW="container.xl">
        <HStack justifyContent={"space-between"}>
          <BackButton href="/" />
        </HStack>
        <Properties courseId={waybillId} />
        <Dates courseId={waybillId} />
      </Container>
    </HydrationBoundary>
  );
}
