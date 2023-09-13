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

  const tablesInQuery = useMemo(() => {
    if (!query?.rules) return [];

    const tables: string[] = [];

    for (const rule of query.rules) {
      if (tables.includes(rule.table)) continue;
      tables.push(rule.table);
    }

    return tables;
  }, [query?.rules]);

  const getAssociationsForRule = useCallback(
    (ruleId?: string) => {
      if (!selectedTable || !baseConfig?.associations) return [];

      const tables = [selectedTable];

      let ruleAssociationId: string | undefined;

      for (const rule of query?.rules || []) {
        if (rule.id === ruleId) {
          if (rule.type === "RuleAssociation")
            ruleAssociationId = rule.associationId;
          break;
        }
        if (rule.type === "Rule") continue;
        if (tables.includes(rule.table)) continue;

        tables.push(rule.table);
      }

      return baseConfig?.associations.filter(
        ({ fromTable, id }) =>
          tables.includes(fromTable) &&
          !query?.associations.find(
            ({ id: qId }) => qId === id && qId !== ruleAssociationId
          )
      );
    },
    [selectedTable, baseConfig?.associations, query?.rules, query?.associations]
  );

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

      const association = baseConfig?.associations.find(
        ({ id }) => id === associationId
      );

      if (!association) return;

      const newAssociations = [...query.associations, association];

      setQuery?.({
        ...query,
        associations: newAssociations,
      });
    },
    [query, setQuery, baseConfig?.associations]
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
    getAssociationsForRule,
    selectedTable,
    setSelectedTable,
    getTableFields,
    query,
    resetQuery,
    setQuery,
    tablesInQuery,
    removeAssociation,
    addAssociation,
  };
};

export default useQueryBuilder;
