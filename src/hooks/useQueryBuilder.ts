import { useCallback, useContext, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

import { QueryBuilderContext } from "containers";
import { Combinator } from "types";

const useQueryBuilder = () => {
  const {
    baseConfig,
    selectedTable,
    setSelectedTable: setSelectedTableContext,
    query,
    setQuery,
  } = useContext(QueryBuilderContext);

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

  const getTableFields = useCallback(
    (tableName: string) => {
      const table = baseConfig?.tables.find(({ name }) => name === tableName);

      return table?.fields || [];
    },
    [baseConfig?.tables]
  );

  const resetQuery = (newTable: string) => {
    console.log("RESET");

    if (!newTable) return;

    setQuery?.({
      type: "RuleGroup",
      id: uuidv4(),
      table: newTable,
      combinator: Combinator.AND,
      rules: [
        // start with initial rule line
        {
          type: "Rule",
          id: uuidv4(),
          table: newTable,
        },
      ],
    });
  };

  const setSelectedTable = (table: string | undefined) => {
    if (table && table !== selectedTable) {
      resetQuery(table);
    }
    setSelectedTableContext?.(table);
  };

  return {
    tables,
    associatedTables,
    selectedTable,
    setSelectedTable,
    getTableFields,
    query,
    resetQuery,
    setQuery,
  };
};

export default useQueryBuilder;
