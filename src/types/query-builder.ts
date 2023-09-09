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

type BasicRule = {
  field: string;
  value: string | boolean;
  operator: string;
};

type GroupRule = {
  rules: Array<BasicRule | GroupRule>;
  combinator: string;
};

type AssociationRule = GroupRule & { table: string };

export type Rules = {
  rules: Array<BasicRule | GroupRule | AssociationRule>;
  combinator: string;
  not: boolean;
};

export type QueryBuilderContextValue = {
  baseConfig: BaseConfig;
  selectedTable: string;
  rules: Rules;
  setSelectedTable: Dispatch<SetStateAction<string | undefined>>;
  setRules: Dispatch<SetStateAction<Rules | undefined>>;
};
