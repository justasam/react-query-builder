import {
  Box,
  Button,
  ColorProps,
  HStack,
  IconButton,
  Select,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import FieldSelect from "./FieldSelect";
import { AnyRule, Combinator, Rule, RuleAssociation, RuleGroup } from "types";
import QueryRule from "./QueryRule";
import CombinatorSelect from "./CombinatorSelect";
import { v4 as uuidv4 } from "uuid";
import { useQueryBuilder } from "hooks";
import AssociationSelect from "./AssociationSelect";

type Props = {
  ruleGroup: RuleGroup | RuleAssociation;
  onChange: (newRuleGroup: RuleGroup | RuleAssociation) => void;
  onDelete?: () => void;
  level: number;
};

const QueryRuleGroup = ({ ruleGroup, onChange, level, onDelete }: Props) => {
  const { associatedTables } = useQueryBuilder();
  const newRuleGroup = {
    ...ruleGroup,
    rules: [...ruleGroup.rules],
  };

  const isInitialRuleGroup = level === 0;

  const handleCombinatorChange = (newCombinator: Combinator) => {
    newRuleGroup.combinator = newCombinator;

    onChange(newRuleGroup);
  };

  const handleAddNewRule = () => {
    if (!ruleGroup.table) return;

    newRuleGroup.rules.push({
      type: "Rule",
      id: uuidv4(),
      table: ruleGroup.table,
    });

    console.log(newRuleGroup);
    onChange(newRuleGroup);
  };

  const handleAddNewRuleGroup = () => {
    if (!ruleGroup.table) return;

    newRuleGroup.rules.push({
      type: "RuleGroup",
      id: uuidv4(),
      table: ruleGroup.table,
      rules: [{ type: "Rule", id: uuidv4(), table: ruleGroup.table }],
      combinator: Combinator.AND,
    });

    onChange(newRuleGroup);
  };

  const handleAddNewRuleAssociation = () => {
    if (!ruleGroup.table) return;

    const associatedTable = associatedTables[0];

    if (!associatedTable) return;

    newRuleGroup.rules.push({
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

    onChange(newRuleGroup);
  };

  const handleRuleChange = (rule: AnyRule, ruleIndex: number) => () => {
    ruleGroup.rules[ruleIndex] = rule;

    onChange(newRuleGroup);
  };

  const handleRuleDelete = (ruleIndex: number) => () => {
    console.log("Delete ");
    newRuleGroup.rules.splice(ruleIndex, 1);
    console.log("new Rule group", newRuleGroup);
    onChange(newRuleGroup);
  };

  const handleAssociationTableChange = (newTable: string) => {
    newRuleGroup.table = newTable;
    newRuleGroup.rules = [
      {
        type: "Rule",
        id: uuidv4(),
        table: newTable,
      },
    ];

    onChange(newRuleGroup);
  };

  const renderRule = (rule: AnyRule, index: number) => {
    if (rule.type === "Rule")
      return (
        <QueryRule
          rule={rule}
          onDelete={index !== 0 ? handleRuleDelete(index) : undefined}
          onChange={handleRuleChange(rule, index)}
          key={rule.id}
        />
      );
    return (
      <QueryRuleGroup
        ruleGroup={rule}
        onDelete={handleRuleDelete(index)}
        onChange={handleRuleChange(rule, index)}
        level={level + 1}
        key={rule.id}
      />
    );
  };

  const renderRules = () => {
    return ruleGroup.rules.map((rule, index) => {
      if (index === 0) {
        return renderRule(rule, index);
      }

      if (index === 1) {
        return (
          <HStack key={rule.id}>
            <CombinatorSelect
              value={ruleGroup.combinator}
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
            value={ruleGroup.combinator}
            onChange={handleCombinatorChange}
            disabled
          />
          <Spacer />
          <Box w="100%">{renderRule(rule, index)}</Box>
        </HStack>
      );
    });
  };

  if (isInitialRuleGroup) {
    return (
      <>
        {renderRules()} <Button onClick={handleAddNewRule}>Add new rule</Button>
        <Button onClick={handleAddNewRuleGroup}>Add new rule group</Button>
        <Button onClick={handleAddNewRuleAssociation}>
          Add new rule association
        </Button>
      </>
    );
  }

  const renderAssociationHeader = () => {
    if (!(ruleGroup.type === "RuleAssociation")) return null;

    return (
      <>
        <HStack alignSelf="stretch">
          <Text>Associated to a </Text>
          <AssociationSelect
            tables={associatedTables}
            value={ruleGroup.table}
            onChange={handleAssociationTableChange}
          />
          <Text>where... </Text>
        </HStack>
      </>
    );
  };

  return (
    <>
      <HStack alignSelf="stretch">
        <Box
          borderWidth="2px"
          borderRadius="lg"
          p="4"
          w="100%"
          backgroundColor={level !== 0 ? "gray.100" : undefined}
        >
          {renderAssociationHeader()}

          {renderRules()}
        </Box>
        <IconButton
          aria-label="Delete data"
          variant="ghost"
          icon={<DeleteIcon />}
          onClick={onDelete}
        />
      </HStack>
      <Button onClick={handleAddNewRule}>Add new rule</Button>
    </>
  );
};

export default QueryRuleGroup;
