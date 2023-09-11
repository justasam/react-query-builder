import { Select } from "@chakra-ui/react";
import { Combinator } from "types";

type Props = {
  value: Combinator;
  onChange: (newCombinator: Combinator) => void;
  disabled?: boolean;
};

const CombinatorSelect = ({ value, onChange, disabled = false }: Props) => {
  const renderOption = (combinator: string) => (
    <option value={combinator} key={combinator}>
      {combinator}
    </option>
  );

  return (
    <Select
      variant="filled"
      fontWeight="medium"
      w="105px"
      isTruncated
      value={value}
      disabled={disabled}
      onChange={(event) => {
        onChange(event.target.value as Combinator);
      }}
    >
      {Object.keys(Combinator).map(renderOption)}
    </Select>
  );
};

export default CombinatorSelect;
