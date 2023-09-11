import { HStack, IconButton, Select } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import FieldSelect from "./FieldSelect";
import { Field, Rule } from "types";
import { useMemo, useState } from "react";
import { useDebounce } from "hooks";
import { DEFAULT_VALUE_MAP, INPUT_MAP, OPERATOR_MAP } from "./fieldPresets";

type Props = {
  rule: Rule;
  onChange: (newRule: Rule) => void;
  onDelete?: () => void;
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
    setValue(newRule.value);

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
