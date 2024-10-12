import { Box, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import DateTime from "./DateTime";

export type CreatedUpdatedProps = {
  created_at?: Date;
  updated_at?: Date;
};

export default function CreatedUpdated({
  created_at,
  updated_at,
}: CreatedUpdatedProps) {
  return (
    <Box p={5} bg="white" borderRadius={"lg"} mb={3}>
      <Grid templateColumns={"repeat(2, 1fr)"}>
        <GridItem>
          <Heading as="h3" size="md" mb={1}>
            Criado em
          </Heading>
          {created_at ? <DateTime date={created_at} /> : <Text>Unknown</Text>}
        </GridItem>
        <GridItem>
          <Heading as="h3" size="md" mb={1}>
            Ultima atualização
          </Heading>
          {updated_at ? <DateTime date={updated_at} /> : <Text>Unknown</Text>}
        </GridItem>
      </Grid>
    </Box>
  );
}
