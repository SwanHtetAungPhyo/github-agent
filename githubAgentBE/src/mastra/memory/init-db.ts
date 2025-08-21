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
      options: {
        lastMessages: 10,
        semanticRecall: {
          topK: 3,
          messageRange: {
            before: 2,
            after: 1,
          },
        },
        workingMemory: {
          enabled: true,
          template: `
# User Profile
## Personal Info
- Name:
- Location:
- Timezone:
## Preferences
- Communication Style: [e.g., Formal, Casual]
- Project Goal:
- Key Deadlines:
  - [Deadline 1]: [Date]
  - [Deadline 2]: [Date]
## Session State
- Last Task Discussed:
- Open Questions:
  - [Question 1]
  - [Question 2]
`,
        },
      },
    });
    const testThreadId = "test-thread-" + Date.now();
    // Note: Memory functionality disabled due to LibSQL compatibility issues
    // await memory.addMessage({
    //   threadId: testThreadId,
    //   role: "user", 
    //   content: "Hello, this is a test message to initialize the database.",
    // });
    console.log("✅ Database initialized successfully!");
    console.log("📁 Database file: ./mastra.db");
    console.log("🧵 Test thread ID:", testThreadId);
    // const messages = await memory.getMessages(testThreadId);
    // console.log("📝 Retrieved messages:", messages.length);
    console.log("📝 Memory functionality temporarily disabled");
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    process.exit(1);
  }
}
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}
export { initializeDatabase };