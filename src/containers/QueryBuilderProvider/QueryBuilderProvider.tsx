import { ReactNode, createContext, useState } from "react";

import { BaseConfig, QueryBuilderContextValue, Rules } from "types";

const QueryBuilderContext = createContext<Partial<QueryBuilderContextValue>>(
  {}
);
QueryBuilderContext.displayName = "QueryBuilderContext";

type Props = {
  baseConfig: BaseConfig;
  children: ReactNode;
};

const QueryBuilderProvider = ({ baseConfig, children }: Props) => {
  const [rules, setRules] = useState<Rules>();
  const [selectedTable, setSelectedTable] = useState<string>();

  return (
    <QueryBuilderContext.Provider
      value={{
        baseConfig,
        rules,
        setRules,
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
