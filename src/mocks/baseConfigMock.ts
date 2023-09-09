// Thanks chatGPT for generating this :)

import { Association, Field, FieldType, BaseConfig, Table } from "types";

const firstName: Field = {
  type: FieldType.String,
  name: "first_name",
  label: "First Name",
};

const lastName: Field = {
  type: FieldType.String,
  name: "last_name",
  label: "Last Name",
};

const birthDate: Field = {
  type: FieldType.Date,
  name: "birth_date",
  label: "Birth Date",
};

// Sample Association Data
const employeeToDepartment: Association = {
  fromTable: "employees",
  toTable: "departments",
};

const departmentToManager: Association = {
  fromTable: "departments",
  toTable: "employees",
};

// Sample Table Data
const employeesTable: Table = {
  name: "employees",
  label: "Employee Information",
  fields: [firstName, lastName, birthDate],
};

const departmentsTable: Table = {
  name: "departments",
  label: "Department Information",
  fields: [firstName, lastName],
};

const managersTable: Table = {
  name: "managers",
  label: "Manager Information",
  fields: [firstName, lastName, birthDate],
};

// Sample BaseConfig
const baseConfig: BaseConfig = {
  tables: [employeesTable, departmentsTable, managersTable],
  associations: [employeeToDepartment, departmentToManager],
};

export { baseConfig };
