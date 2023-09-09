import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  HStack,
  IconButton,
  Select,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";

const QueryBuilder = () => {
  const renderTableTitle = () => (
    <HStack spacing="12px">
      <Tag colorScheme="purple">Accounts</Tag>
      <Text>where...</Text>
    </HStack>
  );

  return (
    <VStack spacing="4" align="stretch">
      {renderTableTitle()}
      <HStack alignSelf="stretch">
        <Box borderWidth="2px" borderRadius="lg" p="4" w="100%">
          <Select
            variant="filled"
            w="fit-content"
            placeholder="Select data"
          ></Select>
        </Box>
        <IconButton
          aria-label="Delete data"
          variant="ghost"
          icon={<DeleteIcon />}
        />
      </HStack>
    </VStack>
  );
};

export default QueryBuilder;
