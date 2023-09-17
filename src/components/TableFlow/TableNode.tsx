import { Card, CardBody, CardFooter, CardHeader, Text } from "@chakra-ui/react";
import { Handle, Position } from "reactflow";
import { TableFlowData } from "types";

type Props = {
  data: TableFlowData["Tables"][0];
};

const TextUpdaterNode = ({ data }: Props) => {
  return (
    <>
      <Card maxW="250" maxH="250">
        <CardHeader>{data.table}</CardHeader>

        <CardBody>{data.description}</CardBody>

        <CardFooter>
          <Text as="b">{data.rows}</Text>
          <Text as="span">
            &nbsp;
            {(data.table.endsWith("s")
              ? data.table
              : data.table + "s"
            ).toLowerCase()}
          </Text>
        </CardFooter>
      </Card>
      <Handle type="source" position={Position.Bottom} id={data.table} />
      <Handle
        type="target"
        position={Position.Top}
        id={data.table + "target"}
      />
    </>
  );
};

export default TextUpdaterNode;
