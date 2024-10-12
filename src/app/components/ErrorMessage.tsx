import { Text } from "@chakra-ui/react";

export type ErrorMessageProps = {
  message?: string;
};

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <Text color="red.500">Error: {message || "Something went wrong"}</Text>
  );
}
