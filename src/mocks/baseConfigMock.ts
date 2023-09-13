import { BaseConfig, FieldType } from "types";
import { v4 as uuidv4 } from "uuid";

const baseConfig: BaseConfig = {
  tables: [
    {
      name: "users",
      label: "Users",
      fields: [
        {
          type: FieldType.String,
          name: "username",
          label: "Username",
        },
        {
          type: FieldType.Number,
          name: "age",
          label: "Age",
        },
        {
          type: FieldType.Number,
          name: "id",
          label: "User ID",
        },
      ],
    },
    {
      name: "orders",
      label: "Orders",
      fields: [
        {
          type: FieldType.Date,
          name: "order_date",
          label: "Order Date",
        },
        {
          type: FieldType.Boolean,
          name: "is_paid",
          label: "Is Paid",
        },
        {
          type: FieldType.Number,
          name: "buyer_id",
          label: "Buyer ID",
        },
        {
          type: FieldType.Number,
          name: "product_id",
          label: "Product ID",
        },
      ],
    },
    {
      name: "products",
      label: "Products",
      fields: [
        {
          type: FieldType.String,
          name: "product_name",
          label: "Product Name",
        },
        {
          type: FieldType.Number,
          name: "price",
          label: "Price",
        },
        {
          type: FieldType.Number,
          name: "id",
          label: "Product ID",
        },
      ],
    },
  ],
  associations: [
    {
      id: uuidv4(),
      fromTable: "users",
      fromColumn: "id",
      toTable: "orders",
      toColumn: "buyer_id",
    },
    {
      id: uuidv4(),
      fromTable: "orders",
      fromColumn: "product_id",
      toTable: "products",
      toColumn: "id",
    },
  ],
};

export { baseConfig };
