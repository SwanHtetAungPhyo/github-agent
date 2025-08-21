import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
export const memory = new Memory({
  storage: new LibSQLStore({
    url: "file:./mastra.db", 
  }),
});
export const storage = new LibSQLStore({
  url: "file:./mastra.db",
});
export const pgVector = null;