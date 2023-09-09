import { HStack, Select, Text } from "@chakra-ui/react";

type Option = {
  label?: string;
  value: string;
};

type Props = {
  options: Array<Option>;
  onSelect: (table: string) => void;
};

const TableSelector = ({ options, onSelect }: Props) => {
  const renderOption = (option: Option) => (
    <option value={option.value} key={option.value}>
      {option.label || option.value}
    </option>
  );

  return (
    <HStack spacing="12px">
      <Select
        variant="filled"
        onChange={(event) => {
          onSelect(event.target.value);
        }}
        maxW="200px"
      >
        {options.map(renderOption)}
      </Select>
      <Text>where...</Text>
    </HStack>
  );
};

export default TableSelector;
