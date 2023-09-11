import { Select } from "@chakra-ui/react";

type Props = {
  value: string;
  onChange: (newTable: string) => void;
  tables: Array<string>;
};

const AssociationSelect = ({ value, onChange, tables }: Props) => {
  const renderOption = (table: string) => (
    <option value={table} key={table}>
      {table}
    </option>
  );

  return (
    <Select
      variant="filled"
      fontWeight="medium"
      w="fit-content"
      maxW="200px"
      isTruncated
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
      }}
    >
      {tables.map(renderOption)}
    </Select>
  );
};

export default AssociationSelect;
