import { HStack, IconButton, Select } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import FieldSelect from "./FieldSelect";
import { Field, FieldType, Rule } from "types";

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

const QueryRule = ({ rule, onChange, onDelete }: Props) => {
  const newRule = { ...rule };

  const handleFieldSelect = (field: Field) => {
    newRule.field = field.name;
    newRule.fieldType = field.type;
    newRule.label = field.label || field.name;
    newRule.operator = OPERATOR_MAP[field.type][0].value;

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

  return (
    <>
      <HStack alignSelf="stretch">
        <HStack
          borderWidth="2px"
          borderRadius="lg"
          p="4"
          w="100%"
          backgroundColor="white"
        >
          <FieldSelect
            selectedField={rule.label}
            onSelect={handleFieldSelect}
            tableName={rule.table}
          />
          {renderOperatorSelect()}
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
