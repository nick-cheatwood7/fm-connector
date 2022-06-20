import "dotenv-safe";
import Connection, { API_VERSION } from "./Connection";
import {
  Record,
  CreateRecordResponse,
  FindOptions,
  LoginResponse,
  Message,
  SortOptions,
} from "./types";
import { v4 } from "uuid";

const db = new Connection({
  dbName: process.env.DB_NAME,
  hostUrl: process.env.DB_HOST,
  account: process.env.DB_USER,
  password: process.env.DB_PASS,
  apiVersion: API_VERSION.Latest,
});

const main = async () => {
  await db.login();

  const order = {
    api_id: v4(),
    Customer: "NodeJS",
    Order_Time: new Date(),
  };

  const order1 = await db.create("API_Orders", { fieldData: order });
  console.log(order1);

  const order2 = await db.duplicate("API_Orders", order1?.recordId as string);
  console.log(order2);

  const orders = await db.find("API_Orders", {
    query: [{ id: "*" }],
    sort: [{ fieldName: "api_id", sortOrder: "descend" }],
    limit: 10,
  });
  console.log(orders.length);

  const singleOrder = await db.findById("API_Orders", orders[0].recordId);
  console.log(singleOrder);

  if (singleOrder) {
    console.log(singleOrder);
    await db.delete("API_Orders", singleOrder.recordId);
  }

  await db.logout();
};

main();

export {
  Connection,
  Record,
  CreateRecordResponse,
  FindOptions,
  LoginResponse,
  Message,
  SortOptions,
};

export default Connection;
