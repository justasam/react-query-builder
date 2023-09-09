import { QueryBuilderContext } from "containers";
import { useContext, useMemo } from "react";

const useQueryBuilder = () => {
  const { baseConfig, selectedTable, setSelectedTable } =
    useContext(QueryBuilderContext);

  const tables = useMemo(() => {
    if (!baseConfig?.tables) return [];

    return baseConfig.tables.map((table) => ({
      value: table.name,
      label: table.label || table.name,
    }));
  }, [baseConfig?.tables]);

  const associatedTables = useMemo(() => {
    if (!selectedTable || !baseConfig?.associations) return [];

    return baseConfig?.associations
      .filter(({ fromTable }) => fromTable === selectedTable)
      .map(({ toTable }) => toTable);
  }, [selectedTable, baseConfig?.associations]);

  return {
    tables,
    associatedTables,
    selectedTable,
    setSelectedTable,
  };
};

export default useQueryBuilder;
