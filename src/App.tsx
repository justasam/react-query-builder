import { ChakraProvider, Container, Spacer } from "@chakra-ui/react";
import { QueryBuilder, TableSelect } from "components";
import { QueryBuilderProvider } from "containers";
import { initialQuery, queryDataset } from "mocks";

function App() {
  return (
    <ChakraProvider>
      <Container
        maxW="4xl"
        borderWidth="2px"
        borderRadius="lg"
        p="8"
        mt="8"
        mb="8"
      >
        <QueryBuilderProvider
          queryDataset={queryDataset}
          initialQuery={initialQuery}
        >
          <TableSelect />
          <Spacer mt="8" />
          <QueryBuilder />
        </QueryBuilderProvider>
      </Container>
    </ChakraProvider>
  );
}

export default App;
