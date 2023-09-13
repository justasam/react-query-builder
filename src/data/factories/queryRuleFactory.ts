import { Combinator, Rule, RuleAssociation, RuleGroup } from "types";
import { v4 as uuidv4 } from "uuid";

export const generateRule = (table: string): Rule => ({
  type: "Rule",
  id: uuidv4(),
  table,
});

export const generateRuleGroup = (
  table: string,
  combinator: Combinator
): RuleGroup => ({
  type: "RuleGroup",
  id: uuidv4(),
  table,
  combinator,
  rules: [generateRule(table)],
});

export const generateAssociationRuleGroup = (
  table: string,
  associationId: string,
  combinator: Combinator
): RuleAssociation => ({
  type: "RuleAssociation",
  id: uuidv4(),
  table,
  combinator,
  associationId,
  rules: [generateRule(table)],
});
