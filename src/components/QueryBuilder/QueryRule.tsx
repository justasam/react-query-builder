import { HStack, IconButton, Input, Select, Switch } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import FieldSelect from "./FieldSelect";
import { Field, FieldType, Rule } from "types";
import { useMemo, useState } from "react";
import { useDebounce } from "hooks";

type Props = {
  rule: Rule;
  onChange: (newRule: Rule) => void;
  onDelete?: () => void;
};

const OPERATOR_MAP: Record<
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

const DEFAULT_VALUE_MAP: Record<FieldType, string> = {
  [FieldType.Boolean]: "true",
  [FieldType.Date]: new Date().toISOString(),
  [FieldType.Number]: "0",
  [FieldType.String]: "Text",
};

type InputProps = {
  value: string | undefined;
  onChange: (newValue: string) => void;
};

const INPUT_MAP: Record<FieldType, (props: InputProps) => JSX.Element> = {
  [FieldType.Boolean]: (props: InputProps) => (
    <Switch
      as="button"
      isChecked={props.value === "true"}
      onClick={() => props.onChange(props.value === "true" ? "false" : "true")}
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

const QueryRule = ({ rule, onChange, onDelete }: Props) => {
  const [value, setValue] = useState(rule.value || "");

  const newRule = { ...rule };

  useDebounce(
    () => {
      newRule.value = value;
      onChange(newRule);
    },
    200,
    [value]
  );

  const handleFieldSelect = (field: Field) => {
    newRule.field = field.name;
    newRule.fieldType = field.type;
    newRule.label = field.label || field.name;
    newRule.operator = OPERATOR_MAP[field.type][0].value;
    newRule.value = DEFAULT_VALUE_MAP[field.type];

    onChange(newRule);
  };

  const handleOperatorSelect = (operator: string) => {
    newRule.operator = operator;

    onChange(newRule);
  };

  const renderOperatorSelect = () => {
    if (!rule.fieldType) return null;

    return (
      <Select
        variant="filled"
        fontWeight="medium"
        w="fit-content"
        maxW="200px"
        isTruncated
        value={rule.operator}
        onChange={(event) => handleOperatorSelect(event.target.value)}
      >
        {OPERATOR_MAP[rule.fieldType].map((operator) => (
          <option key={operator.value} value={operator.value}>
            {operator.label}
          </option>
        ))}
      </Select>
    );
  };

  const renderInputElement = useMemo(() => {
    if (!rule.fieldType) return null;
    return INPUT_MAP[rule.fieldType];
  }, [rule.fieldType]);

  const renderInput = () => {
    if (!rule.field || !rule.fieldType || !rule.operator) return null;

    return renderInputElement?.({
      value: value,
      onChange: (newValue) => {
        setValue(newValue);
      },
    });
  };

  return (
    <>
      <HStack alignSelf="stretch">
        <HStack
          borderWidth="2px"
          borderRadius="lg"
          p="4"
          w="100%"
          backgroundColor="white"
          wrap="wrap"
        >
          <FieldSelect
            selectedField={rule.label}
            onSelect={handleFieldSelect}
            tableName={rule.table}
          />
          {renderOperatorSelect()}
          {renderInput()}
        </HStack>
        {onDelete ? (
          <IconButton
            aria-label="Delete data"
            variant="ghost"
            icon={<DeleteIcon />}
            onClick={onDelete}
          />
        ) : null}
      </HStack>
    </>
  );
};

export default QueryRule;
