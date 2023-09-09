import React from "react";
import { ChakraProvider, Container } from "@chakra-ui/react";
import { TableSelector } from "components";

function App() {
  return (
    <ChakraProvider>
      <Container maxW="4xl" borderWidth="1px" borderRadius="lg" p="4" mt="4">
        <TableSelector
          options={[
            { label: "Accounts", value: "accounts" },
            { label: "Sales", value: "sales" },
          ]}
          onSelect={(table) => console.log("selected", table)}
        />
      </Container>
    </ChakraProvider>
  );
}

export default App;
