"use client";

import CreatedUpdated from "@/app/components/CreatedUpdated";
import { trpc } from "@/utils/trpc";

export type DatesProps = { courseId: number };

export default function Dates({ courseId }: DatesProps) {
  const { data: courseInfo } = trpc.waybill.get.useQuery(courseId);

  return <CreatedUpdated {...courseInfo} />;
}
