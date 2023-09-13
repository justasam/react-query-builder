import { ReactNode, createContext, useState } from "react";

import {
  QueryDataset,
  QueryBuilderContextValue,
  Query,
  QueryConfig,
  Combinator,
} from "types";

const QueryBuilderContext = createContext<Partial<QueryBuilderContextValue>>(
  {}
);
QueryBuilderContext.displayName = "QueryBuilderContext";

type Props = {
  queryDataset: QueryDataset;
  children: ReactNode;
  queryConfig?: QueryConfig;
  initialQuery?: Query;
};

const queryConfigDefaults: QueryConfig = {
  defaultCombinator: Combinator.AND,
};

const QueryBuilderProvider = ({
  queryDataset,
  queryConfig,
  initialQuery,
  children,
}: Props) => {
  const [query, setQuery] = useState<Query | undefined>(initialQuery);
  const [selectedTable, setSelectedTable] = useState<string | undefined>(
    initialQuery?.table || undefined
  );

  return (
    <QueryBuilderContext.Provider
      value={{
        queryDataset,
        queryConfig: { ...queryConfigDefaults, ...queryConfig },
        query,
        setQuery,
        selectedTable,
        setSelectedTable,
      }}
    >
      {children}
    </QueryBuilderContext.Provider>
  );
};

export { QueryBuilderContext };
export default QueryBuilderProvider;
