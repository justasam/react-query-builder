import { Dispatch, SetStateAction } from "react";

export enum FieldType {
  String = "string",
  Number = "number",
  Boolean = "boolean",
  Date = "date",
}

export type Field = {
  type: FieldType;
  name: string;
  label?: string;
  category?: string;
};

export type Association = {
  id: string;
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
};

export type Table = {
  name: string;
  label?: string;
  fields: Array<Field>;
};

export type QueryDataset = {
  tables: Array<Table>;
  associations: Array<Association>;
};

export type Rule = {
  type: "Rule";
  id: string;
  table: string;
  field?: string;
  value?: string;
  operator?: string;
  fieldType?: FieldType;
  label?: string;
};

export type RuleGroup = {
  type: "RuleGroup";
  id: string;
  table: string;
  combinator: Combinator;
  rules: Array<Rule>;
};

export type RuleAssociation = {
  type: "RuleAssociation";
  id: string;
  combinator: Combinator;
  table: string;
  associationId: string;
  rules: Array<Rule>;
};

export type AnyRule = Rule | RuleGroup | RuleAssociation;

export type RuleParent = RuleAssociation | RuleGroup | Query;

export enum Combinator {
  AND = "AND",
  OR = "OR",
}

export type Query = {
  table: string;
  id: string;
  rules: Array<AnyRule>;
  combinator: Combinator;
  associations: Array<Association>;
};

export type QueryBuilderContextValue = {
  queryDataset: QueryDataset;
  queryConfig: QueryConfig;
  selectedTable: string;
  query: Query;
  setSelectedTable: Dispatch<SetStateAction<string | undefined>>;
  setQuery: Dispatch<SetStateAction<Query | undefined>>;
};

export type QueryConfig = {
  defaultCombinator: Combinator;
};
