import { v4 as uuidv4 } from "uuid";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { DeleteIcon, SmallAddIcon } from "@chakra-ui/icons";

import { Combinator, Rule, RuleAssociation, RuleGroup } from "types";
import QueryRule from "./QueryRule";
import CombinatorSelect from "./CombinatorSelect";
import { useQueryBuilder } from "hooks";
import AssociationSelect from "./AssociationSelect";

type Props = {
  ruleGroup: RuleGroup | RuleAssociation;
  onChange: (newRuleGroup: RuleGroup | RuleAssociation) => void;
  onDelete?: () => void;
};

const QueryRuleGroup = ({ ruleGroup, onChange, onDelete }: Props) => {
  const { getAssociationsForRule, removeAssociation, addAssociation } =
    useQueryBuilder();
  const newRuleGroup = {
    ...ruleGroup,
    rules: [...ruleGroup.rules],
  };

  const associations = getAssociationsForRule(ruleGroup.id);

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

    onChange(newRuleGroup);
  };

  const handleRuleChange = (ruleIndex: number) => (rule: Rule) => {
    newRuleGroup.rules[ruleIndex] = rule;

    onChange(newRuleGroup);
  };

  const handleRuleDelete = (ruleIndex: number) => () => {
    newRuleGroup.rules.splice(ruleIndex, 1);

    onChange(newRuleGroup);
  };

  const handleAssociationChange = (newAssociationId: string) => {
    const newAssociation = associations.find(
      ({ id }) => id === newAssociationId
    );

    if (!newAssociation || !(newRuleGroup.type === "RuleAssociation")) return;

    removeAssociation(newRuleGroup.associationId);
    addAssociation(newAssociationId);

    newRuleGroup.table = newAssociation.toTable;
    newRuleGroup.associationId = newAssociation.id;
    newRuleGroup.rules = [
      {
        type: "Rule",
        id: uuidv4(),
        table: newAssociation.toTable,
      },
    ];

    onChange(newRuleGroup);
  };

  const renderRule = (rule: Rule, index: number) => (
    <QueryRule
      rule={rule}
      onDelete={index !== 0 ? handleRuleDelete(index) : undefined}
      onChange={handleRuleChange(index)}
      key={rule.id}
    />
  );

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

  const renderAssociationHeader = () => {
    if (!(ruleGroup.type === "RuleAssociation")) return null;

    return (
      <>
        <HStack alignSelf="stretch">
          <Text>Associated to a </Text>
          <AssociationSelect
            associations={associations}
            value={ruleGroup.associationId}
            onChange={handleAssociationChange}
          />
          <Text>where... </Text>
        </HStack>
      </>
    );
  };

  return (
    <>
      <HStack alignSelf="stretch">
        <VStack
          borderWidth="2px"
          borderRadius="lg"
          p="4"
          w="100%"
          backgroundColor="gray.100"
          alignSelf="stretch"
          alignItems="stretch"
        >
          {renderAssociationHeader()}

          {renderRules()}

          <Button
            size="sm"
            variant="ghost"
            colorScheme="purple"
            leftIcon={<SmallAddIcon />}
            onClick={handleAddNewRule}
            alignSelf="flex-start"
          >
            Add filter
          </Button>
        </VStack>
        <IconButton
          aria-label="Delete data"
          variant="ghost"
          icon={<DeleteIcon />}
          onClick={onDelete}
        />
      </HStack>
    </>
  );
};

export default QueryRuleGroup;
