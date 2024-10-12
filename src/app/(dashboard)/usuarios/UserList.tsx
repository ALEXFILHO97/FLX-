"use client";

import GenericTable from "@/app/components/GenericTable";
import { usePagination } from "@/hooks/usePagination";
import { trpc } from "@/utils/trpc";
import { keepPreviousData } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type UsersListProps = {};

export default function UsersList({}: UsersListProps) {
  const router = useRouter();
  const [cursor, setCursor] = useState<number>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const query = trpc.users.getMany.useQuery(
    { cursor, name, email },
    { placeholderData: keepPreviousData },
  );
  const { nextPage, previousPage, viewedCount } = usePagination(
    query.data,
    setCursor,
  );
  const { data: totalCount } = trpc.users.count.useQuery();

  return (
    <GenericTable
      nextPage={nextPage}
      previousPage={previousPage}
      result={query}
      rows={[
        {
          title: "Nome",
          value: "name",
          filter: {
            type: "string",
            value: name,
            onChange: setName,
            placeholder: "Digite o nome",
          },
        },
        {
          title: "E-mail",
          value: "email",
          filter: {
            type: "string",
            value: email,
            onChange: setEmail,
            placeholder: "Digite o e-mail",
          },
        },
        {
          title: "Status",
          value: "status",
        },
        {
          title: "Data de criação",
          value: "created_at",
        },
      ]}
      total={totalCount}
      viewedCount={viewedCount}
      onClickRow={(row) => router.push(`/usuarios/${row.id}`)}
    />
  );
}
