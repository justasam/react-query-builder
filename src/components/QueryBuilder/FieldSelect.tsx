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
  TagCloseButton,
  TagLabel,
  Text,
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
  const [categoryFilter, setCategoryFilter] = useState<Set<string>>(new Set());
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

  const filteredCategories = categories.filter((category) => {
    if (!categoryFilter.size) return true;

    return categoryFilter.has(category);
  });

  const toggleFilterCategory = (category: string) => {
    if (!categoryFilter.size) {
      setCategoryFilter(new Set([category]));

      return;
    }

    const newCategoryFilter = new Set(...new Array(categoryFilter));

    if (newCategoryFilter.has(category)) {
      newCategoryFilter.delete(category);
    } else {
      newCategoryFilter.add(category);
    }

    setCategoryFilter(newCategoryFilter);
  };

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
        onClick={openMenu}
        rightIcon={isMenuOpen ? <ChevronRightIcon /> : <ChevronDownIcon />}
        isTruncated
        w="fit-content"
        maxW="200px"
        flexShrink={0}
      >
        <Text isTruncated>{selectedField || "Select Data"}</Text>
      </MenuButton>
      <MenuList>
        <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />

        <MenuGroup title="Categories">
          <HStack spacing="2" ml="2">
            {categories.map((category) => (
              <Tag
                colorScheme="purple"
                key={category}
                as="button"
                onClick={() => toggleFilterCategory(category)}
              >
                <TagLabel>{category}</TagLabel>
                {categoryFilter?.has(category) ? <TagCloseButton /> : null}
              </Tag>
            ))}
          </HStack>
        </MenuGroup>
        <MenuDivider />

        {filteredCategories.map(renderCategoryFields)}
      </MenuList>
    </Menu>
  );
};

export default FieldSelect;
