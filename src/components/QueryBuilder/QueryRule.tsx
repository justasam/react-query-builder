import { HStack, IconButton, Select } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import FieldSelect from "./FieldSelect";
import { Field, Rule } from "types";
import { useMemo, useState } from "react";
import { useDebounce, useQueryBuilder } from "hooks";
import { DEFAULT_VALUE_MAP, INPUT_MAP, OPERATOR_MAP } from "./fieldPresets";

type Props = {
  rule: Rule;
  parentId: string;
  isDeletable?: boolean;
};

const QueryRule = ({ rule, parentId, isDeletable = true }: Props) => {
  const { updateQueryRule, deleteQueryRule } = useQueryBuilder();

  const [value, setValue] = useState(rule.value || "");

  const newRule = { ...rule };

  useDebounce(
    () => {
      newRule.value = value;
      updateQueryRule(parentId, newRule);
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

    updateQueryRule(parentId, newRule);
  };

  const handleOperatorSelect = (operator: string) => {
    newRule.operator = operator;

    updateQueryRule(parentId, newRule);
  };

  const handleDeleteClick = () => {
    deleteQueryRule(rule.id);
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
        {isDeletable ? (
          <IconButton
            aria-label="Delete data"
            variant="ghost"
            icon={<DeleteIcon />}
            onClick={handleDeleteClick}
          />
        ) : null}
      </HStack>
    </>
  );
};

export default QueryRule;
