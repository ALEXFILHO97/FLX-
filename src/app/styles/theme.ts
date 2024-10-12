import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { MultiSelectTheme } from "chakra-multiselect";
import colors from "./colors";
import FormLabel from "./components/FormLabel";
import Input from "./components/Input";
import Textarea from "./components/TextArea";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
  components: {
    FormLabel,
    Input,
    Textarea,
  },
  colors,

  styles: {
    global: {
      body: {
        bg: "gray.50",
      },
    },
  },
};

const theme = extendTheme(
  config,
  withDefaultColorScheme({ colorScheme: "cyan" }),
  {
    components: {
      MultiSelect: MultiSelectTheme,
    },
  }
);

export default theme;
