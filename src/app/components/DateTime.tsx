import { HStack, Text } from "@chakra-ui/react";
import { intlFormat } from "date-fns";

export type DateTimeProps = { date: Date; short?: boolean };

export default function DateTime({ date, short }: DateTimeProps) {
  return (
    <HStack>
      <Text>
        {intlFormat(date, {
          day: short ? "numeric" : "2-digit",
          month: short ? "numeric" : "long",
          year: "numeric",
        })}
      </Text>
      <Text opacity={0.5} fontSize={"sm"}>
        {intlFormat(date, {
          hour: "numeric",
          minute: "numeric",
        })}
      </Text>
    </HStack>
  );
}
