import { DeleteIcon } from "@chakra-ui/icons";
import { Box, HStack, IconButton, Tag, Text, VStack } from "@chakra-ui/react";

import { useQueryBuilder } from "hooks";
import FieldSelect from "./FieldSelect";

const QueryBuilder = () => {
  const { selectedTable } = useQueryBuilder();

  if (!selectedTable) return <Text as="i">Select data to start query.</Text>;

  const renderTableTitle = () => (
    <HStack spacing="12px">
      <Tag colorScheme="purple">{selectedTable}</Tag>
      <Text>where...</Text>
    </HStack>
  );

  return (
    <VStack spacing="4" align="stretch">
      {renderTableTitle()}
      <HStack alignSelf="stretch">
        <Box borderWidth="2px" borderRadius="lg" p="4" w="100%">
          <FieldSelect
            onSelect={(field) => console.log("selected", field)}
            selectedField={undefined}
            tableName={selectedTable}
          />
        </Box>
        <IconButton
          aria-label="Delete data"
          variant="ghost"
          icon={<DeleteIcon />}
        />
      </HStack>
    </VStack>
  );
};

export default QueryBuilder;
