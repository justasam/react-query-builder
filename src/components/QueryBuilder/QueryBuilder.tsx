import { HStack, Tag, Text, VStack } from "@chakra-ui/react";

import QueryRuleGroup from "./QueryRuleGroup";
import { useQueryBuilder } from "hooks";
import { Query } from "types";

const QueryBuilder = () => {
  const { selectedTable, query, setQuery } = useQueryBuilder();

  if (!selectedTable) return <Text as="i">Select data to start query.</Text>;

  const renderTableTitle = () => (
    <HStack spacing="12px">
      <Tag colorScheme="purple">{selectedTable}</Tag>
      <Text>where...</Text>
    </HStack>
  );

  const renderQuery = () => {
    if (!query) return null;

    return (
      <QueryRuleGroup
        ruleGroup={query}
        onChange={(newQuery) => {
          console.log("Change", newQuery);
          setQuery?.(newQuery as Query);
        }}
        level={0}
      />
    );
  };

  return (
    <VStack spacing="4" align="stretch">
      {renderTableTitle()}
      {renderQuery()}
    </VStack>
  );
};

export default QueryBuilder;
