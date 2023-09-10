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
  fromTable: string;
  toTable: string;
};

export type Table = {
  name: string;
  label?: string;
  fields: Array<Field>;
};

export type BaseConfig = {
  tables: Array<Table>;
  associations: Array<Association>;
};

export type Rule = {
  type: "Rule";
  id: string;
  table: string;
  field?: string;
  value?: string | boolean;
  operator?: string;
};

export type RuleGroup = {
  type: "RuleGroup";
  id: string;
  table: string; // <- when undefined, we assume it is associated & show dropdown
  combinator: Combinator;
  rules: Array<Rule>;
};

export type RuleAssociation = {
  type: "RuleAssociation";
  id: string;
  table: string; // <- when undefined, we assume it is associated & show dropdown
  combinator: Combinator;
  rules: Array<Rule>;
};

export type AnyRule = Rule | RuleGroup | RuleAssociation;

export enum Combinator {
  AND = "and",
  OR = "or",
}

export type Query = {
  table: string;
  id: string;
  rules: Array<AnyRule>;
  combinator: Combinator;
};

export type QueryBuilderContextValue = {
  baseConfig: BaseConfig;
  selectedTable: string;
  query: Query;
  setSelectedTable: Dispatch<SetStateAction<string | undefined>>;
  setQuery: Dispatch<SetStateAction<Query | undefined>>;
};
