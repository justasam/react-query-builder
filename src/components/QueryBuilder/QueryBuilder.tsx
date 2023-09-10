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

const QueryBuilder = () => {
  const { selectedTable, query, setQuery, associatedTables } =
    useQueryBuilder();

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
    console.log("r", rule);
    newQuery.rules[ruleIndex] = rule;

    setQuery?.(newQuery);
  };

  const handleRuleDelete = (ruleIndex: number) => () => {
    newQuery.rules.splice(ruleIndex, 1);

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
    const associatedTable = associatedTables[0];

    if (!associatedTable) return;

    newQuery.rules.push({
      type: "RuleAssociation",
      id: uuidv4(),
      table: associatedTable,
      rules: [
        {
          type: "Rule",
          id: uuidv4(),
          table: associatedTable,
        },
      ],
      combinator: Combinator.AND,
    });

    setQuery?.(newQuery);
  };

  const formatToSQL = () => {
    let isFirstDone = false;

    return (
      query.rules.reduce<string>((prevSQL, rule, index) => {
        if (rule.type === "Rule") {
          if (!rule.field || !rule.operator || !rule.value) return prevSQL;

          if (isFirstDone) {
            prevSQL += ` ${query.combinator} `;
          }

          isFirstDone = true;

          return prevSQL + `${rule.field} ${rule.operator} ${rule.value}`;
        }

        let isInnerFirstDone = false;

        if (isFirstDone) {
          prevSQL += ` ${query.combinator} `;
        }

        prevSQL += rule.rules.reduce((innerSQL, innerRule) => {
          if (!innerRule.field || !innerRule.operator || !innerRule.value)
            return innerSQL;

          if (isInnerFirstDone) {
            innerSQL += ` ${rule.combinator} `;
          }

          isInnerFirstDone = true;

          return (
            innerSQL +
            `${innerRule.field} ${innerRule.operator} ${innerRule.value}`
          );
        }, "(");
        prevSQL += `)`;

        return prevSQL;
      }, "(") + ")"
    );
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
      <div>Query: {formatToSQL()}</div>
    </>
  );
};

export default QueryBuilder;
