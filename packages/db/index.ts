import * as schema from "./schema";
import { drizzle } from "drizzle-orm/libsql";
import { sql, eq, and } from "drizzle-orm";

const connectToDB = ({
  url,
  authoToken,
}: {
  url: string;
  authoToken: string;
}) => {
  return drizzle({
    connection: {
      url: url,
      authToken: authoToken,
    },
    schema,
  });
};

export { sql, eq, connectToDB, and };
