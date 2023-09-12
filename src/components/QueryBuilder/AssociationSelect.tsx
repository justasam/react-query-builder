import { Select } from "@chakra-ui/react";
import { Association } from "types";

type Props = {
  value: string;
  onChange: (newId: string) => void;
  associations: Array<Association>;
};

const AssociationSelect = ({ value, onChange, associations }: Props) => {
  const renderOption = (association: Association) => (
    <option value={association.id} key={association.id}>
      {association.toTable}
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
      {associations.map(renderOption)}
    </Select>
  );
};

export default AssociationSelect;
