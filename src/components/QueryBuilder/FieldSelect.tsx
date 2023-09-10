import { Fragment, useMemo, useState } from "react";
import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Tag,
  UseMenuItemProps,
  useMenuItem,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@chakra-ui/icons";

import { useQueryBuilder } from "hooks";
import { Field } from "types";

type Props = {
  onSelect: (field: Field) => void;
  selectedField: string | undefined;
  tableName: string;
};

const SearchBar = (
  props: UseMenuItemProps & {
    query: string;
    onQueryChange: (newQuery: string) => void;
  }
) => {
  const { role, ...rest } = useMenuItem(props);

  return (
    <Box pl="2" pr="2" bgColor="InfoBackground" role={role}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          {...rest}
          type="search"
          placeholder="Search for a trait"
          value={props.query}
          onChange={(event) => props.onQueryChange(event.target.value)}
        />
      </InputGroup>
    </Box>
  );
};

const FieldSelect = ({ selectedField, onSelect, tableName }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { getTableFields } = useQueryBuilder();

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  const fields = getTableFields(tableName).filter((field) => {
    if (!searchQuery) return true;

    const fieldLabel = (field.label || field.name).toLowerCase();

    return fieldLabel.includes(searchQuery.toLowerCase());
  });

  const categoryToFieldMap = useMemo(() => {
    const categoryToFieldMap: Record<string, Array<Field>> = {
      Uncategorized: [],
    };

    fields.forEach((field) => {
      const fieldCategory = field.category || "Uncategorized";
      if (categoryToFieldMap[fieldCategory]) {
        categoryToFieldMap[fieldCategory].push(field);

        return;
      }

      categoryToFieldMap[fieldCategory] = [field];
    });

    return categoryToFieldMap;
  }, [fields]);

  const categories = Object.keys(categoryToFieldMap);

  const renderField = (field: Field) => {
    return (
      <MenuItem
        key={field.name}
        onClick={() => {
          onSelect(field);
        }}
      >
        {field.label}
      </MenuItem>
    );
  };

  const renderCategoryFields = (category: string, index: number) => {
    const isLastCategory = index === categories.length - 1;

    return (
      <Fragment key={category}>
        <MenuGroup title={category}>
          {categoryToFieldMap[category].map(renderField)}
        </MenuGroup>
        {!isLastCategory ? <MenuDivider /> : null}
      </Fragment>
    );
  };

  return (
    <Menu placement="right-start" isOpen={isMenuOpen} onClose={closeMenu}>
      <MenuButton
        as={Button}
        rightIcon={isMenuOpen ? <ChevronRightIcon /> : <ChevronDownIcon />}
        onClick={openMenu}
      >
        {selectedField || "Select Data"}
      </MenuButton>
      <MenuList>
        <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />

        <MenuGroup title="Categories">
          <HStack spacing="2" ml="2">
            {categories.map((category) => (
              <Tag colorScheme="purple" key={category}>
                {category}
              </Tag>
            ))}
          </HStack>
        </MenuGroup>
        <MenuDivider />

        {categories.map(renderCategoryFields)}
      </MenuList>
    </Menu>
  );
};

export default FieldSelect;