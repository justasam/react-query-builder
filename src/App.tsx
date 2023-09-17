import { ChakraProvider, Container, Spacer } from "@chakra-ui/react";
import { QueryBuilder, TableFlow, TableSelect } from "components";
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
        <TableFlow />
      </Container>
    </ChakraProvider>
  );
}

export default App;
