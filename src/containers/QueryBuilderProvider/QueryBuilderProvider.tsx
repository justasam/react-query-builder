import { ReactNode, createContext, useState } from "react";

import { BaseConfig, QueryBuilderContextValue, Query } from "types";

const QueryBuilderContext = createContext<Partial<QueryBuilderContextValue>>(
  {}
);
QueryBuilderContext.displayName = "QueryBuilderContext";

type Props = {
  baseConfig: BaseConfig;
  children: ReactNode;
};

const QueryBuilderProvider = ({ baseConfig, children }: Props) => {
  const [query, setQuery] = useState<Query>();
  const [selectedTable, setSelectedTable] = useState<string>();

  return (
    <QueryBuilderContext.Provider
      value={{
        baseConfig,
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
