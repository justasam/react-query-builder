import { Box, HStack, IconButton } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import FieldSelect from "./FieldSelect";
import { Rule } from "types";

type Props = {
  rule: Rule;
  onChange: (newRule: Rule) => void;
  onDelete: () => void;
};

const QueryRule = ({ rule, onChange, onDelete }: Props) => {
  const handleFieldSelect = (field: string) => {
    const newRule = { ...rule };

    newRule.field = field;

    onChange(newRule);
  };

  return (
    <>
      <HStack alignSelf="stretch">
        <Box
          borderWidth="2px"
          borderRadius="lg"
          p="4"
          w="100%"
          backgroundColor="white"
        >
          <FieldSelect
            selectedField={rule.field}
            onSelect={handleFieldSelect}
            tableName={rule.table}
          />
        </Box>
        <IconButton
          aria-label="Delete data"
          variant="ghost"
          icon={<DeleteIcon />}
          onClick={onDelete}
        />
      </HStack>
    </>
  );
};

export default QueryRule;
