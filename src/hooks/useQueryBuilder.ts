import { useCallback, useContext, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

import { QueryBuilderContext } from "containers";
import { RuleParent, Combinator, AnyRule, Query, RuleAssociation } from "types";
import { appendOrCreate } from "utils";
import {
  generateAssociationRuleGroup,
  generateRule,
  generateRuleGroup,
} from "data/factories";

const useQueryBuilder = () => {
  const {
    queryDataset,
    selectedTable,
    setSelectedTable: setSelectedTableContext,
    query,
    setQuery,
    queryConfig,
  } = useContext(QueryBuilderContext);

  const tables = useMemo(() => {
    if (!queryDataset?.tables) return [];

    return queryDataset.tables.map((table) => ({
      value: table.name,
      label: table.label || table.name,
    }));
  }, [queryDataset?.tables]);

  const getAssociationsForRule = useCallback(
    (ruleId?: string) => {
      if (!selectedTable || !queryDataset?.associations) return [];

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

      return queryDataset?.associations.filter(
        ({ fromTable, id }) =>
          tables.includes(fromTable) &&
          !query?.associations.find(
            ({ id: qId }) => qId === id && qId !== ruleAssociationId
          )
      );
    },
    [
      selectedTable,
      queryDataset?.associations,
      query?.rules,
      query?.associations,
    ]
  );

  const updateAssociation = useCallback(
    (
      associationToAddId: string,
      associationToRemoveId: string,
      sQuery: Query | undefined = query
    ) => {
      if (!sQuery) return;

      const associationToAdd = queryDataset?.associations.find(
        ({ id }) => id === associationToAddId
      );

      if (!associationToAdd) return;

      const newAssociations = [...sQuery.associations, associationToAdd].filter(
        ({ id }) => id !== associationToRemoveId
      );

      setQuery?.({
        ...sQuery,
        associations: newAssociations,
      });

      return associationToAdd;
    },
    [query, queryDataset?.associations, setQuery]
  );

  const getTableFields = useCallback(
    (tableName: string) => {
      const table = queryDataset?.tables.find(({ name }) => name === tableName);

      return table?.fields || [];
    },
    [queryDataset?.tables]
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

  // new

  const availableAssociations = useMemo(() => {
    if (!query) return [];

    return getAssociationsForRule().filter(
      (association) => !query.associations.includes(association)
    );
  }, [getAssociationsForRule, query]);

  const getRuleById = useCallback((id: string, sQuery: Query) => {
    if (sQuery.id === id) return sQuery;

    if (!sQuery.rules) return null;

    return sQuery.rules.find((rule) => {
      if (rule.id === id) return true;

      if (!("rules" in rule)) return false;

      return rule.rules?.find((subRule) => subRule.id === id);
    });
  }, []);

  const getParentRule = useCallback(
    (ruleId: string, sQuery: Query): RuleParent | undefined => {
      if (!sQuery) return undefined;
      // Query has no parent rule
      if (sQuery.id === ruleId) return undefined;
      if (!sQuery.rules) return undefined;

      if (sQuery.rules.find((rule) => rule.id === ruleId)) return sQuery;

      return sQuery.rules.find((rule) => {
        if (!("rules" in rule)) return false;

        return rule.rules?.find((subRule) => subRule.id === ruleId);
      }) as RuleParent | undefined;
    },
    []
  );

  const getDependantAssociationIds = useCallback(
    (associationId: string, sQuery: Query) => {
      if (!sQuery) return;

      const association = sQuery.associations.find(
        ({ id }) => id === associationId
      );

      if (!association) return;

      return sQuery.associations
        .filter(
          ({ fromTable, id }) =>
            fromTable === association.toTable && id !== associationId
        )
        .map(({ id }) => id);
    },
    []
  );

  const addQueryRule = useCallback(
    (parentId: string, ruleType: AnyRule["type"]) => {
      if (!query || !queryConfig) return;

      const newQuery = { ...query };

      const parent = getRuleById(parentId, newQuery);

      if (!parent || !("rules" in parent)) {
        return;
      }

      let ruleToAdd: AnyRule;

      switch (ruleType) {
        case "RuleGroup":
          ruleToAdd = generateRuleGroup(
            parent.table,
            queryConfig.defaultCombinator
          );
          break;
        case "RuleAssociation":
          const availableAssociation = availableAssociations[0];
          if (!availableAssociation) return;

          ruleToAdd = generateAssociationRuleGroup(
            availableAssociation.toTable,
            availableAssociation.id,
            queryConfig.defaultCombinator
          );
          newQuery.associations.push(availableAssociation);
          break;
        case "Rule":
          ruleToAdd = generateRule(parent.table);
      }

      parent.rules = appendOrCreate(parent.rules, ruleToAdd);
      setQuery?.(newQuery);
    },
    [query, setQuery, getRuleById, queryConfig, availableAssociations]
  );

  const deleteQueryRule = useCallback(
    (ruleId: string, sQuery?: Query) => {
      if (!query) return;

      const newQuery = sQuery || { ...query };

      const rule = getRuleById(ruleId, newQuery);
      const parentRule = getParentRule(ruleId, newQuery);

      if (!rule || !parentRule) return;

      if ("associationId" in rule) {
        // remove association and it's dependant associations / association rules
        const dependantAssociationIds = getDependantAssociationIds(
          rule.associationId,
          newQuery
        );

        if (dependantAssociationIds) {
          dependantAssociationIds.forEach((id) => {
            const ruleToDeleteId = newQuery.rules.find(
              (rule) =>
                rule.type === "RuleAssociation" && rule.associationId === id
            )?.id;

            if (ruleToDeleteId) deleteQueryRule(ruleToDeleteId, newQuery);
          });
        }

        parentRule.rules = parentRule.rules.filter((r) => r.id !== ruleId);
        newQuery.associations = newQuery.associations.filter(
          ({ id }) =>
            id !== rule.associationId && !dependantAssociationIds?.includes(id)
        );
      } else {
        parentRule.rules = parentRule.rules.filter((r) => r.id !== ruleId);
      }

      if (sQuery) return;

      setQuery?.(newQuery);
    },
    [getParentRule, getRuleById, query, setQuery, getDependantAssociationIds]
  );

  const updateQueryRule = useCallback(
    (parentId: string, rule: AnyRule) => {
      if (!query || !queryConfig) return;

      const newQuery = { ...query };

      const parent = getRuleById(parentId, newQuery);

      if (!parent || !("rules" in parent)) {
        return;
      }

      const ruleIndex = parent.rules.findIndex((r) => r.id === rule.id);

      parent.rules[ruleIndex] = rule;

      setQuery?.(newQuery);
    },
    [query, setQuery, getRuleById, queryConfig]
  );

  const updateQuery = useCallback(
    (newQuery: Query) => {
      setQuery?.(newQuery);
    },
    [setQuery]
  );

  const updateAssociationRule = useCallback(
    (parentId: string, rule: RuleAssociation, newAssociationId: string) => {
      if (!query) return;

      const newQuery = { ...query };

      const updatedAssociation = updateAssociation(
        newAssociationId,
        rule.associationId,
        newQuery
      );

      if (!updatedAssociation) return;

      updateQueryRule(
        parentId,
        generateAssociationRuleGroup(
          updatedAssociation?.toTable,
          updatedAssociation.id,
          rule.combinator
        )
      );
    },
    [query, updateAssociation, updateQueryRule]
  );

  return {
    tables,
    getAssociationsForRule,
    selectedTable,
    setSelectedTable,
    getTableFields,
    query,
    updateAssociationRule,
    resetQuery,
    updateQuery,
    addQueryRule,
    updateQueryRule,
    deleteQueryRule,
  };
};

export default useQueryBuilder;
