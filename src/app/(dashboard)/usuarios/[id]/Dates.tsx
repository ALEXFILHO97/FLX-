"use client";

import CreatedUpdated from "@/app/components/CreatedUpdated";
import { trpc } from "@/utils/trpc";

export type DatesProps = { userId: number };

export default function Dates({ userId }: DatesProps) {
  const { data: userInfo } = trpc.users.get.useQuery(userId);

  return <CreatedUpdated {...userInfo} />;
}
