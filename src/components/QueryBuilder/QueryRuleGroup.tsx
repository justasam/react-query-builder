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
import { useQueryBuilder } from "hooks";

import QueryRule from "./QueryRule";
import CombinatorSelect from "./CombinatorSelect";
import AssociationSelect from "./AssociationSelect";

type Props = {
  ruleGroup: RuleGroup | RuleAssociation;
  parentId: string;
};

const QueryRuleGroup = ({ ruleGroup, parentId }: Props) => {
  const {
    getAssociationsForRule,
    updateAssociationRule,
    updateQueryRule,
    deleteQueryRule,
    addQueryRule,
  } = useQueryBuilder();

  const associations = getAssociationsForRule(ruleGroup.id);

  const handleCombinatorChange = (newCombinator: Combinator) => {
    const newRuleGroup = {
      ...ruleGroup,
      rules: [...ruleGroup.rules],
    };
    newRuleGroup.combinator = newCombinator;

    updateQueryRule(parentId, newRuleGroup);
  };

  const handleAddNewRule = () => {
    addQueryRule(ruleGroup.id, "Rule");
  };

  const handleAssociationChange = (newAssociationId: string) => {
    if (ruleGroup.type !== "RuleAssociation") return;

    updateAssociationRule(parentId, ruleGroup, newAssociationId);
  };

  const handleDeleteClick = () => {
    deleteQueryRule(ruleGroup.id);
  };

  const renderRule = (rule: Rule, index: number) => (
    <QueryRule
      rule={rule}
      parentId={ruleGroup.id}
      isDeletable={index !== 0}
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
          onClick={handleDeleteClick}
        />
      </HStack>
    </>
  );
};

export default QueryRuleGroup;
