export type RowGeneric = {
  id: string | number;
  [key: string]: unknown;
};

export type MultiSelectFilterProps = {
  type: "multi-select";
  options: {
    label: string;
    value: string | number;
  }[];
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
};

export type SelectFilterProps = {
  type: "select";
  options: {
    label: string;
    value: string;
  }[];
  value: string;
  onChange: (value: string) => void;
};

export type StringFilterProps = {
  type: "string";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
};

export type FilterProps =
  | MultiSelectFilterProps
  | SelectFilterProps
  | StringFilterProps;

export type RowProps<TRow> = {
  title: string;
  value: keyof TRow | ((values: TRow) => unknown);
  filter?: FilterProps;
};
