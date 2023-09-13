import { v4 as uuidv4 } from "uuid";
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

import QueryRuleGroup from "./QueryRuleGroup";
import { useQueryBuilder } from "hooks";
import { AnyRule, Combinator } from "types";
import CombinatorSelect from "./CombinatorSelect";
import QueryRule from "./QueryRule";
import { formatQueryToSQL } from "utils";
import { SQL_KEYWORDS } from "constants/sql";

const QueryBuilder = () => {
  const {
    selectedTable,
    query,
    setQuery,
    getAssociationsForRule,
    removeAssociation,
    addAssociation,
  } = useQueryBuilder();

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

    setQuery?.(newQuery);
  };

  const handleRuleChange = (ruleIndex: number) => (rule: AnyRule) => {
    newQuery.rules[ruleIndex] = rule;

    setQuery?.(newQuery);
  };

  const handleRuleDelete = (ruleIndex: number) => () => {
    const deletedRule = newQuery.rules.splice(ruleIndex, 1)[0];

    if (deletedRule.type === "RuleAssociation") {
      const obsoleteAssocations = newQuery.associations
        .filter((association) => association.fromTable === deletedRule.table)
        .map((association) => association.id);
      const newRules = newQuery.rules.filter(
        (rule) =>
          rule.type !== "RuleAssociation" ||
          !obsoleteAssocations.includes(rule.associationId)
      );

      newQuery.rules = newRules;
      newQuery.associations = newQuery.associations.filter(
        (association) =>
          association.id !== deletedRule.associationId &&
          association.fromTable !== deletedRule.table
      );
    }

    setQuery?.(newQuery);
  };

  const handleAddNewRule = () => {
    newQuery.rules.push({
      type: "Rule",
      id: uuidv4(),
      table: newQuery.table,
    });

    setQuery?.(newQuery);
  };

  const handleAddNewRuleGroup = () => {
    newQuery.rules.push({
      type: "RuleGroup",
      id: uuidv4(),
      table: newQuery.table,
      rules: [{ type: "Rule", id: uuidv4(), table: newQuery.table }],
      combinator: Combinator.AND,
    });

    setQuery?.(newQuery);
  };

  const handleAddNewRuleAssociation = () => {
    const association = getAssociationsForRule().filter(
      (association) => !newQuery.associations.includes(association)
    )[0];

    if (!association) return;

    newQuery.associations.push(association);
    newQuery.rules.push({
      type: "RuleAssociation",
      id: uuidv4(),
      table: association.toTable,
      associationId: association.id,
      rules: [
        {
          type: "Rule",
          id: uuidv4(),
          table: association.toTable,
        },
      ],
      combinator: Combinator.AND,
    });

    setQuery?.(newQuery);
  };

  const renderRule = (rule: AnyRule, index: number) => {
    if (rule.type === "Rule") {
      return (
        <QueryRule
          rule={rule}
          onDelete={index !== 0 ? handleRuleDelete(index) : undefined}
          onChange={handleRuleChange(index)}
          key={rule.id}
        />
      );
    }

    return (
      <QueryRuleGroup
        ruleGroup={rule}
        onDelete={handleRuleDelete(index)}
        onChange={handleRuleChange(index)}
        key={rule.id}
      />
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
      </div>
    </>
  );
};

export default QueryBuilder;
