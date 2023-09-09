import { HStack, Select, Text } from "@chakra-ui/react";
import { useQueryBuilder } from "hooks";

type Option = {
  label?: string;
  value: string;
};

const TableSelector = () => {
  const { tables, setSelectedTable, selectedTable } = useQueryBuilder();

  const renderOption = (option: Option) => (
    <option value={option.value} key={option.value}>
      {option.label || option.value}
    </option>
  );

  return (
    <HStack spacing="12px" fontWeight="medium">
      <Select
        variant="filled"
        fontWeight="medium"
        placeholder="Select data"
        w="fit-content"
        value={selectedTable}
        onChange={(event) => {
          setSelectedTable?.(event.target.value);
        }}
      >
        {tables.map(renderOption)}
      </Select>
      <Text>where...</Text>
    </HStack>
  );
};

export default TableSelector;
