export type TableFlowData = {
  Tables: Array<{
    table: string;
    description: string;
    fields: {
      [key: string]: string;
    };
    rows: number;
    dataSource: string;
  }>;
  Relationships: Array<{
    From: {
      Table: string;
      Field: string;
    };
    To: {
      Table: string;
      Field: string;
    };
    Type: string;
  }>;
};

// {
//   "Tables": {
//     "Accounts": {
//       "description": "This table holds all account-related information.",
//       "fields": {
//         "AccountId": "integer",
//         "OwnerId": "varchar",
//         "AccountName": "varchar",
//         ...
//       },
//       "rows": 1200,
//       "dataSource": "Postgres"
//     },
//     "Contacts": {
//       "description": "Table storing all contact details.",
//       "fields": {
//         "ContactId": "integer",
//         ...
//       },
//       "rows": 5000,
//       "dataSource": "Snowflake"
//     },
//     ...
//   },
//   "Relationships": [
//     {
//       "From": {
//         "Table": "Users",
//         "Field": "UserId"
//       },
//       "To": {
//         "Table": "Workspaces",
//         "Field": "WorkspaceId"
//       },
//       "Type": "many-to-one"
//     },
//     {
//       "From": {
//         "Table": "Contacts",
//         "Field": "AccountId"
//       },
//       "To": {
//         "Table": "Accounts",
//         "Field": "AccountId"
//       },
//       "Type": "many-to-one"
//     }
//   ]
// }
