import {
  Input as ChakraInput,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  InputProps as IInputProps,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { nameToLabel } from "./helpers";

export type InputProps = {
  label?: string | boolean;
  helper?: string;
  error?: string;
} & IInputProps;

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helper, isDisabled, ...props },
  ref
) {
  return (
    <FormControl isInvalid={!!error} isDisabled={isDisabled}>
      {label ? (
        <FormLabel>
          {typeof label === "string" ? label : nameToLabel(props.name || "")}
        </FormLabel>
      ) : null}
      <ChakraInput ref={ref} {...props} />
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

export default Input;
