# LibSQL Memory and Storage Integration

This project has been configured to use LibSQL for local memory and storage, replacing the previous PostgreSQL setup.

## Features

- **Local SQLite Database**: Uses `mastra.db` file for persistent storage
- **Semantic Recall**: Retrieves relevant past conversations based on similarity
- **Working Memory**: Maintains user profiles and session state
- **Message History**: Stores conversation threads with configurable retention

## Configuration

### Memory Options

The memory is configured with the following options:

```typescript
{
  lastMessages: 10, // Number of recent messages to include
  semanticRecall: {
    topK: 3, // Number of similar messages to retrieve
    messageRange: {
      before: 2,
      after: 1,
    },
  },
  workingMemory: {
    enabled: true,
    template: `...` // Custom user profile template
  }
}
```

### Database Location

- **File**: `./mastra.db` (in the project root)
- **Type**: SQLite database using LibSQL
- **Backup**: Automatically ignored by `.gitignore`

## Usage

### Initialize Database

To initialize the database and test the setup:

```bash
pnpm init-db
```

This will:
1. Create the `mastra.db` file
2. Set up the necessary tables
3. Add a test message
4. Verify the setup works

### Development

The database is automatically used when you run:

```bash
pnpm dev
```

The Mastra framework will:
- Connect to the LibSQL database
- Store conversation history
- Enable semantic recall for better context
- Maintain working memory across sessions

## Benefits

1. **Local Storage**: No external database dependencies
2. **Fast Performance**: SQLite is optimized for local operations
3. **Persistent Memory**: Conversations are saved between sessions
4. **Semantic Search**: Find relevant past conversations
5. **User Profiles**: Maintain context about users and their preferences

## Migration from PostgreSQL

The project has been migrated from PostgreSQL to LibSQL:

- ✅ Removed PostgreSQL dependencies
- ✅ Configured LibSQL storage
- ✅ Updated agent memory configuration
- ✅ Added database initialization script
- ✅ Updated CORS configuration

## Troubleshooting

### Database File Issues

If you encounter database file issues:

1. Delete the `mastra.db` file
2. Run `pnpm init-db` to recreate it
3. Restart the development server

### Memory Not Working

If memory features aren't working:

1. Check that the database file exists
2. Verify the agent is using the memory instance
3. Check console logs for any errors

## File Structure

```
ResearchAssistant/
├── src/mastra/
│   ├── memory/
│   │   ├── memory.ts          # Main memory configuration
│   │   └── init-db.ts         # TypeScript initialization
│   └── agents/
│       └── weather-agent.ts   # Agent with memory integration
├── scripts/
│   └── init-db.js             # JavaScript initialization script
├── mastra.db                  # SQLite database file (auto-generated)
└── LIBSQL_SETUP.md           # This documentation
```
