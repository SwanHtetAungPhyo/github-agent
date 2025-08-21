import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
async function initializeDatabase() {
  console.log("🔧 Initializing LibSQL database...");
  try {
    const storage = new LibSQLStore({
      url: "file:./mastra.db",
    });
    const memory = new Memory({
      storage,
    });
    const testThreadId = "test-thread-" + Date.now();
    await memory.addMessage({
      threadId: testThreadId,
      role: "user",
      content: "Hello, this is a test message to initialize the database.",
    });
    console.log("✅ Database initialized successfully!");
    console.log("📁 Database file: ./mastra.db");
    console.log("🧵 Test thread ID:", testThreadId);
    const messages = await memory.getMessages(testThreadId);
    console.log("📝 Retrieved messages:", messages.length);
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    process.exit(1);
  }
}
initializeDatabase();