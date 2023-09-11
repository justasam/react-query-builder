import { Input, Switch } from "@chakra-ui/react";
import { FieldType } from "types";

export const OPERATOR_MAP: Record<
  FieldType,
  Array<{
    value: string;
    label: string;
  }>
> = {
  [FieldType.Boolean]: [
    { value: "=", label: "Equals" },
    { value: "<>", label: "Not Equals" },
  ],
  [FieldType.Date]: [
    { value: "=", label: "Equals" },
    { value: "<>", label: "Not Equals" },
    { value: ">", label: "After" },
    { value: "<", label: "Before" },
    { value: ">=", label: "On or After" },
    { value: "<=", label: "On or Before" },
  ],
  [FieldType.Number]: [
    { value: "=", label: "Equals" },
    { value: "<>", label: "Not Equals" },
    { value: ">", label: "Greater Than" },
    { value: "<", label: "Less Than" },
    { value: ">=", label: "Greater Than or Equal To" },
    { value: "<=", label: "Less Than or Equal To" },
  ],
  [FieldType.String]: [
    { value: "LIKE", label: "Contains" },
    { value: "=", label: "Equals" },
    { value: "<>", label: "Not Equals" },
    { value: ">", label: "Greater Than" },
    { value: "<", label: "Less Than" },
  ],
};

export const DEFAULT_VALUE_MAP: Record<FieldType, string> = {
  [FieldType.Boolean]: "true",
  [FieldType.Date]: new Date().toISOString(),
  [FieldType.Number]: "0",
  [FieldType.String]: "Text",
};

export type InputProps = {
  value: string | undefined;
  onChange: (newValue: string) => void;
};

export const INPUT_MAP: Record<FieldType, (props: InputProps) => JSX.Element> =
  {
    [FieldType.Boolean]: (props: InputProps) => (
      <Switch
        as="button"
        isChecked={props.value === "true"}
        onClick={() =>
          props.onChange(props.value === "true" ? "false" : "true")
        }
        maxW="300px"
      />
    ),
    [FieldType.Date]: (props: InputProps) => (
      <Input
        type="date"
        variant="unstyled"
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        maxW="300px"
      />
    ),
    [FieldType.Number]: (props: InputProps) => (
      <Input
        type="number"
        variant="unstyled"
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        maxW="300px"
      />
    ),
    [FieldType.String]: (props: InputProps) => (
      <Input
        type="text"
        variant="unstyled"
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        maxW="300px"
      />
    ),
  };
