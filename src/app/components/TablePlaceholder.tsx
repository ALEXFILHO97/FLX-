import {
  Box,
  ButtonGroup,
  HStack,
  IconButton,
  Skeleton,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export type TablePlaceholderProps = {
  caption?: boolean;
  rows: number;
  titles: string[];
  count?: boolean;
};

export default function TablePlaceholder({
  caption,
  rows,
  count,
  titles,
}: TablePlaceholderProps) {
  return (
    <Box pos="relative">
      <TableContainer borderRadius={"lg"}>
        <Table mb={3} variant="striped" colorScheme="gray">
          {caption ? (
            <TableCaption>
              <Skeleton>Caption text</Skeleton>
            </TableCaption>
          ) : null}
          <Thead background={"flx.500"}>
            <Tr>
              {titles.map((title, index) => (
                <Th key={index} color={"white"}>
                  {title}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {new Array(rows).fill(true).map((_, i) => (
              <Tr key={i}>
                {titles.map((_, index) => (
                  <Td key={index}>
                    <Skeleton>value</Skeleton>
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <HStack justifyContent={"space-between"}>
        <Box>{count ? <Skeleton>0 - 10 of 10</Skeleton> : null}</Box>
        <ButtonGroup isAttached variant={"ghost"}>
          <IconButton
            aria-label="previous page"
            isDisabled
            icon={<FaChevronLeft />}
          />
          <IconButton
            aria-label="next page"
            isDisabled
            icon={<FaChevronRight />}
          />
        </ButtonGroup>
      </HStack>
    </Box>
  );
}
