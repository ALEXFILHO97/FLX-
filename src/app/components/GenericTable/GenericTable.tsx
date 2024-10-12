"use client";

import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  DarkMode,
  HStack,
  Icon,
  IconButton,
  IconButtonProps,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Select,
  Spinner,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { UseQueryResult } from "@tanstack/react-query";
import { isDate } from "date-fns";
import { ReactNode, forwardRef, useState } from "react";
import {
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import DateTime from "../DateTime";
import ErrorMessage from "../ErrorMessage";
import TablePlaceholder from "../TablePlaceholder";
import {
  FilterProps,
  MultiSelectFilterProps,
  RowProps,
  SelectFilterProps,
  StringFilterProps,
} from "./GenericTableTypes";

export type GenericTableProps<TRow extends {}, C, Err> = {
  result: UseQueryResult<{ items: TRow[]; nextCursor: C | undefined }, Err>;
  rows: RowProps<TRow>[];
  total?: number;
  onClickRow?: (row: TRow) => void;
  caption?: string;
  nextPage?: () => void;
  previousPage?: () => void;
  viewedCount?: number;
  keyExtractor?: (item: TRow) => string | number;
};

export default function GenericTable<
  T extends {},
  C,
  Err extends { message: string } = Error,
>({
  total,
  rows,
  onClickRow,
  caption,
  nextPage,
  previousPage,
  viewedCount,
  keyExtractor,
  result: { data, isPending, isError, error, isFetching, isPlaceholderData },
}: GenericTableProps<T, C, Err>) {
  if (isPending) {
    return (
      <TablePlaceholder titles={rows.map(({ title }) => title)} rows={5} />
    );
  }

  if (isError) {
    return <Text color="red.500">Error: {error?.message}</Text>;
  }
  if (data == null) {
    return <Text color="red.500">Unexpected Error: no data</Text>;
  }

  function renderValue(value: unknown) {
    if (isDate(value)) return <DateTime date={value as Date} />;
    if (typeof value === "boolean") {
      return (
        <HStack color={value ? "green.500" : "red.500"}>
          {value ? <Icon as={FaCheck} /> : <Icon as={FaTimes} />}
          <Text>{value ? "Ativo" : "Desativado"}</Text>
        </HStack>
      );
    }

    if (!value) {
      return <>-</>;
    }

    return <>{value}</>;
  }

  function getRowValue(rowProps: RowProps<T>, row: T) {
    if (typeof rowProps.value === "function")
      return renderValue(rowProps.value(row));

    const key = rowProps.value;
    const value = row[key];

    return renderValue(value);
  }

  function defaultKeyExtractor(item: T) {
    if ("id" in item) {
      return "" + item.id;
    }

    return undefined;
  }

  return (
    <Box pos="relative">
      {isFetching ? (
        <Spinner
          position={"absolute"}
          top={0}
          right={5}
          color="flx.500"
          zIndex={100}
        />
      ) : null}
      <TableContainer borderTopRadius={"lg"}>
        <Table mb={3} colorScheme="gray">
          {caption ? <TableCaption>{caption}</TableCaption> : null}
          <Thead background={"flx.500"}>
            <Tr>
              {rows?.map(({ title, filter }, index) => (
                <Th key={index}>
                  <Text color="white" as="span">
                    {title}
                  </Text>{" "}
                  {filter ? (
                    <GenericTableFilter filter={filter} title={title} />
                  ) : null}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.items.map((row) => (
              <Tr
                _hover={{
                  background: "gray.100",
                }}
                key={
                  keyExtractor ? keyExtractor(row) : defaultKeyExtractor(row)
                }
                cursor={onClickRow ? "pointer" : undefined}
                onClick={onClickRow ? () => onClickRow(row) : undefined}
              >
                {rows?.map((rowProps, index) => (
                  <Td key={index}>{getRowValue(rowProps, row)}</Td>
                ))}
              </Tr>
            ))}
          </Tbody>
          {data.items.length === 0 ? (
            <TableCaption>Não existe dados para apresentar</TableCaption>
          ) : null}
        </Table>
      </TableContainer>
      <HStack justifyContent={"space-between"}>
        <Box>
          {total != null && data.items.length > 0 ? (
            <Text color={"gray.500"} fontSize={"sm"}>
              {viewedCount != null
                ? `${viewedCount + 1} - ${viewedCount + data.items.length} de`
                : ""}{" "}
              {total} itens
            </Text>
          ) : null}
        </Box>
        <ButtonGroup isAttached variant={"ghost"}>
          <IconButton
            aria-label="previous page"
            isDisabled={previousPage == null}
            onClick={previousPage}
            icon={<FaChevronLeft />}
          />
          <IconButton
            aria-label="next page"
            isDisabled={isPlaceholderData || nextPage == null}
            onClick={nextPage}
            icon={<FaChevronRight />}
          />
        </ButtonGroup>
      </HStack>
    </Box>
  );
}

type FilterButtonProps = {
  isActive?: boolean;
} & Omit<IconButtonProps, "aria-label">;
const FilterButton = forwardRef<"button", FilterButtonProps>(
  function FilterButton({ isActive, ...props }, ref) {
    return (
      <DarkMode>
        <IconButton
          icon={<FaFilter />}
          size="xs"
          colorScheme="gray"
          aria-label="filter"
          variant={"ghost"}
          isRound
          opacity={isActive ? 1 : 0.3}
          ref={ref}
          {...props}
        />
      </DarkMode>
    );
  },
);

type GenericTableFilterProps = {
  filter: FilterProps;
  title: string;
};
function GenericTableFilter({ filter }: GenericTableFilterProps) {
  switch (filter.type) {
    case "multi-select":
      return <MultiSelectFilter {...filter} />;

    case "select":
      return <SelectFilter {...filter} />;

    case "string":
      return <StringFilter {...filter} />;

    default:
      return <ErrorMessage message={`unknown filter`} />;
  }
}

function SelectFilter({ onChange, value, options }: SelectFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FilterLayout
      onClear={() => {
        onChange("");
        setIsOpen(false);
      }}
      isOpen={isOpen}
      onDismiss={() => {
        setIsOpen(false);
      }}
      trigger={
        <FilterButton isActive={!!value} onClick={() => setIsOpen(true)} />
      }
    >
      <Select
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(false);
        }}
        placeholder="Selecione"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </FilterLayout>
  );
}

function MultiSelectFilter({
  onChange,
  value,
  options,
}: MultiSelectFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState<(string | number)[]>([]);

  return (
    <FilterLayout
      onClear={() => {
        onChange([]);
        setCurrent([]);
        setIsOpen(false);
      }}
      onConfirm={() => {
        onChange(current);
        setIsOpen(false);
      }}
      isOpen={isOpen}
      onDismiss={() => {
        setCurrent(value);
        setIsOpen(false);
      }}
      trigger={
        <FilterButton isActive={!!value} onClick={() => setIsOpen(true)} />
      }
    >
      <CheckboxGroup value={current} onChange={(v) => setCurrent(v)}>
        <Stack>
          {options.map(({ label, value }) => (
            <Checkbox colorScheme="flx" key={value} value={value}>
              {label}
            </Checkbox>
          ))}
        </Stack>
      </CheckboxGroup>
    </FilterLayout>
  );
}

function StringFilter({ onChange, value, placeholder }: StringFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState("");

  return (
    <FilterLayout
      onClear={() => {
        onChange("");
        setCurrent("");
        setIsOpen(false);
      }}
      onConfirm={() => {
        onChange(current);
        setIsOpen(false);
      }}
      isOpen={isOpen}
      onDismiss={() => {
        setCurrent(value);
        setIsOpen(false);
      }}
      trigger={
        <FilterButton isActive={!!value} onClick={() => setIsOpen(true)} />
      }
    >
      <Input
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        placeholder={placeholder ? `${placeholder}...` : undefined}
        onSubmit={() => {
          onChange(current);
          setIsOpen(false);
        }}
      />
    </FilterLayout>
  );
}

function FilterLayout({
  children,
  trigger,
  isOpen,
  onClear,
  onDismiss,
  onConfirm,
}: {
  children: ReactNode | ReactNode[];
  trigger: ReactNode | ReactNode[];
  isOpen: boolean;
  onDismiss: () => void;
  onClear?: () => void;
  onConfirm?: () => void;
}) {
  return (
    <Popover isOpen={isOpen} onClose={onDismiss}>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverHeader fontWeight="semibold">Filtro</PopoverHeader>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>{children}</PopoverBody>
          <PopoverFooter display="flex" justifyContent="flex-end">
            <ButtonGroup size="sm">
              {onClear ? (
                <Button colorScheme="gray" onClick={() => onClear()}>
                  Limpar
                </Button>
              ) : null}
              {onConfirm ? (
                <Button
                  size="sm"
                  colorScheme="green"
                  onClick={() => onConfirm()}
                >
                  Confirmar
                </Button>
              ) : null}
            </ButtonGroup>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
