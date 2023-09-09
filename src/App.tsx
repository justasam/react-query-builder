import { ChakraProvider, Container, Spacer } from "@chakra-ui/react";
import { QueryBuilder, TableSelector } from "components";
import { QueryBuilderProvider } from "containers";
import { baseConfig } from "mocks";

function App() {
  return (
    <ChakraProvider>
      <Container maxW="4xl" borderWidth="2px" borderRadius="lg" p="8" mt="8">
        <QueryBuilderProvider baseConfig={baseConfig}>
          <TableSelector />
          <Spacer mt="8" />
          <QueryBuilder />
        </QueryBuilderProvider>
      </Container>
    </ChakraProvider>
  );
}

export default App;
