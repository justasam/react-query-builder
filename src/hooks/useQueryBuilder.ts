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

  const associations = useMemo(() => {
    if (!selectedTable || !baseConfig?.associations) return [];

    return baseConfig?.associations.filter(
      ({ fromTable }) => fromTable === selectedTable
    );
  }, [selectedTable, baseConfig?.associations]);

  const removeAssociation = useCallback(
    (associationId: string) => {
      if (!query) return;

      const newAssociations = query.associations.filter(
        ({ id }) => id !== associationId
      );

      setQuery?.({
        ...query,
        associations: newAssociations,
      });
    },
    [query, setQuery]
  );

  const addAssociation = useCallback(
    (associationId: string) => {
      if (!query) return;

      const association = associations.find(({ id }) => id === associationId);

      if (!association) return;

      const newAssociations = [...query.associations, association];

      setQuery?.({
        ...query,
        associations: newAssociations,
      });
    },
    [query, setQuery, associations]
  );

  const getTableFields = useCallback(
    (tableName: string) => {
      const table = baseConfig?.tables.find(({ name }) => name === tableName);

      return table?.fields || [];
    },
    [baseConfig?.tables]
  );

  const resetQuery = (newTable: string) => {
    if (!newTable) return;

    setQuery?.({
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
      associations: [],
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
    associations,
    selectedTable,
    setSelectedTable,
    getTableFields,
    query,
    resetQuery,
    setQuery,
    removeAssociation,
    addAssociation,
  };
};

export default useQueryBuilder;
