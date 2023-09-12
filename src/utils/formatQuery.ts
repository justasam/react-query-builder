import { Association, FieldType, Query } from "types";

export const formatQueryToSQL = (query: Query) => {
  const START = `SELECT * FROM ${query.table}${query.associations
    .map(formatAssociation)
    .join(" ")} WHERE `;
  const END = `;`;

  return `${START}${rulesToSQL(
    query.rules,
    query.combinator,
    query.table
  )}${END}`;
};

const formatAssociation = (association: Association) => {
  return ` JOIN ${association.toTable} ON ${association.fromTable}.${association.fromColumn} = ${association.toTable}.${association.toColumn}`;
};

const formatFieldValue = (fieldType: FieldType, value: string) => {
  if (fieldType === FieldType.String || fieldType === FieldType.Date) {
    return `'${value}'`;
  }

  return value;
};

const rulesToSQL = (
  rules: Query["rules"],
  combinator: Query["combinator"],
  table: Query["table"]
): string => {
  return rules.reduce<string>((acc, rule, index) => {
    const isLastRule = index === rules.length - 1;

    if (rule.type === "Rule") {
      if (!rule.field || !rule.value || !rule.operator || !rule.fieldType)
        return acc;

      return `${acc}${table}.${rule.field} ${rule.operator} ${formatFieldValue(
        rule.fieldType,
        rule.value
      )} ${isLastRule ? "" : combinator} `;
    }
    if (rule.type === "RuleAssociation") {
      return `${acc}(${rulesToSQL(rule.rules, rule.combinator, rule.table)}) ${
        isLastRule ? "" : combinator
      } `;
    }
    return `${acc}(${rulesToSQL(rule.rules, rule.combinator, table)}) ${
      isLastRule ? "" : combinator
    } `;
  }, "");
};
