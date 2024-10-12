import {
  Select as ChakraSelect,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  SelectProps as ISelectProps,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { formatEnumValue, nameToLabel } from "./helpers";

export type SelectProps = {
  label?: string | boolean;
  helper?: string;
  error?: string;
  options: {
    text: string;
    value: string | number;
  }[];
} & ISelectProps;

const Select = forwardRef<HTMLInputElement, SelectProps>(function Input(
  { label, error, helper, isDisabled, options, ...props },
  ref
) {
  return (
    <FormControl isInvalid={!!error} isDisabled={isDisabled}>
      {label ? (
        <FormLabel>
          {typeof label === "string" ? label : nameToLabel(props.name || "")}
        </FormLabel>
      ) : null}
      <ChakraSelect ref={ref} {...props}>
        {options.map(({ text, value }, index) => (
          <option key={index} value={value}>
            {formatEnumValue(text)}
          </option>
        ))}
      </ChakraSelect>
      {!error ? (
        helper ? (
          <FormHelperText>{helper}</FormHelperText>
        ) : null
      ) : (
        <FormErrorMessage>{error}</FormErrorMessage>
      )}
    </FormControl>
  );
});

export default Select;
