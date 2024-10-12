import {
  Textarea as ChakraTextArea,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  TextareaProps as ITextAreaProps,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { nameToLabel } from "./helpers";

export type TextAreaProps = {
  label?: string | boolean;
  helper?: string;
  error?: string;
} & ITextAreaProps;

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ label, error, helper, isDisabled, ...props }, ref) {
    return (
      <FormControl isInvalid={!!error} isDisabled={isDisabled}>
        {label ? (
          <FormLabel>
            {typeof label === "string" ? label : nameToLabel(props.name || "")}
          </FormLabel>
        ) : null}
        <ChakraTextArea ref={ref} {...props} />
        {!error ? (
          helper ? (
            <FormHelperText>{helper}</FormHelperText>
          ) : null
        ) : (
          <FormErrorMessage>{error}</FormErrorMessage>
        )}
      </FormControl>
    );
  }
);

export default TextArea;
