import {
  Box,
  Button,
  HStack,
  Spacer,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";

import { useQueryBuilder } from "hooks";
import { AnyRule, Combinator } from "types";
import { formatQueryToSQL } from "utils";
import { SQL_KEYWORDS } from "constants/sql";

import QueryRuleGroup from "./QueryRuleGroup";
import CombinatorSelect from "./CombinatorSelect";
import QueryRule from "./QueryRule";

const QueryBuilder = () => {
  const { selectedTable, query, updateQuery, addQueryRule } = useQueryBuilder();

  if (!selectedTable || !query)
    return <Text as="i">Select data to start query.</Text>;

  const renderTableTitle = () => (
    <HStack spacing="12px">
      <Tag colorScheme="purple">{selectedTable}</Tag>
      <Text>where...</Text>
    </HStack>
  );

  const newQuery = {
    ...query,
    rules: [...query.rules],
  };

  const handleCombinatorChange = (newCombinator: Combinator) => {
    newQuery.combinator = newCombinator;

    updateQuery?.(newQuery);
  };

  const handleAddNewRule = () => {
    addQueryRule(query.id, "Rule");
  };

  const handleAddNewRuleGroup = () => {
    addQueryRule(query.id, "RuleGroup");
  };

  const handleAddNewRuleAssociation = () => {
    addQueryRule(query.id, "RuleAssociation");
  };

  const renderRule = (rule: AnyRule, index: number) => {
    if (rule.type === "Rule") {
      return (
        <QueryRule
          rule={rule}
          key={rule.id}
          parentId={query.id}
          isDeletable={index !== 0}
        />
      );
    }

    return (
      <QueryRuleGroup ruleGroup={rule} key={rule.id} parentId={query.id} />
    );
  };

  const renderQuery = () => {
    if (!query) return null;

    return query.rules.map((rule, index) => {
      if (index === 0) {
        return renderRule(rule, index);
      }

      if (index === 1) {
        return (
          <HStack key={rule.id}>
            <CombinatorSelect
              value={query.combinator}
              onChange={handleCombinatorChange}
            />
            <Spacer />
            <Box w="100%">{renderRule(rule, index)}</Box>
          </HStack>
        );
      }

      return (
        <HStack key={rule.id}>
          <CombinatorSelect
            value={query.combinator}
            onChange={handleCombinatorChange}
            disabled
          />
          <Spacer />
          <Box w="100%">{renderRule(rule, index)}</Box>
        </HStack>
      );
    });
  };

  return (
    <>
      <VStack spacing="4" align="stretch">
        {renderTableTitle()}
        {renderQuery()}
        <HStack>
          <Button
            size="sm"
            variant="ghost"
            colorScheme="purple"
            leftIcon={<SmallAddIcon />}
            onClick={handleAddNewRule}
          >
            Add filter
          </Button>
          <Button
            size="sm"
            variant="ghost"
            colorScheme="purple"
            leftIcon={<SmallAddIcon />}
            onClick={handleAddNewRuleGroup}
          >
            Add filter group
          </Button>
          <Button
            size="sm"
            variant="ghost"
            colorScheme="purple"
            leftIcon={<SmallAddIcon />}
            onClick={handleAddNewRuleAssociation}
          >
            Add association
          </Button>
        </HStack>
      </VStack>
      <div>
        Query:{" "}
        {formatQueryToSQL(query)
          .split(" ")
          .map((sqlStr, index) => (
            <Text
              key={index}
              as={SQL_KEYWORDS.includes(sqlStr) ? "b" : undefined}
              display="inline"
            >
              {sqlStr}&nbsp;
            </Text>
          ))}
        <p>Query: {JSON.stringify(query)}</p>
      </div>
    </>
  );
};

export default QueryBuilder;
