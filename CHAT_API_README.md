# Chat API - Zeema Chatbot

This document describes the implementation of the Chat API for the Zeema Chatbot, which handles chat_id generation and management in the Supabase database.

## 🎯 Overview

The Chat API provides functionality to:
1. Generate unique chat_id using timestamp and random number
2. Insert new chat_id into the "chats" table in Supabase
3. Retrieve chat information by chat_id
4. Manage chat sessions for the chatbot

## 🔧 Implementation Details

### 1. Python API (`chat_api.py`)

The Python implementation provides a complete HTTP server with the following endpoints:

#### Endpoints

- **POST `/api/insert_chat_id`** - Generate and insert a new chat_id
- **GET `/api/get_chat?chat_id=<chat_id>`** - Retrieve chat information by chat_id
- **GET `/api/health`** - Health check endpoint

#### Features

- **Numeric ID Generation**: Uses timestamp and random number to generate unique chat_ids
- **Supabase Integration**: Connects to Supabase using REST API
- **Error Handling**: Comprehensive error handling and logging
- **CORS Support**: Full CORS support for web applications
- **Logging**: Detailed logging for debugging and monitoring

#### Usage

```bash
# Run the API server (default port 8002)
python chat_api.py

# Run on custom port
python chat_api.py 8003

# Test the API functionality
python chat_api.py test
```

### 2. JavaScript API (`api_service.js`)

The JavaScript implementation extends the existing `ZeemaAPIService` class with chat functionality:

#### Methods

- **`insert_chat_id()`** - Generate and insert a new chat_id
- **`get_chat_by_id(chat_id)`** - Retrieve chat information by chat_id
- **`generateUUID()`** - Generate numeric ID for chat_id

#### Usage

```javascript
// Initialize the API service
const apiService = new ZeemaAPIService();

// Insert a new chat_id
const result = await apiService.insert_chat_id();
if (result.success) {
    console.log('Chat ID:', result.data.chat_id);
}

// Get chat by ID
const chatResult = await apiService.get_chat_by_id(chatId);
if (chatResult.success) {
    console.log('Chat data:', chatResult.data);
}
```

## 🗄️ Database Schema

The "chats" table in Supabase should have the following structure:

```sql
CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    chat_id BIGINT UNIQUE NOT NULL,
    user_id BIGINT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Add additional columns as needed
);
```

### Required Columns

- **`chat_id`** (BIGINT): Unique identifier for the chat session (generated using timestamp + random number)
- **`user_id`** (BIGINT, optional): User ID associated with the chat session
- **`created_at`** (TIMESTAMP WITH TIME ZONE): When the chat was created (automatically set by API)

## 🚀 Integration with Chatbot

### 1. New Chat Session

When a new chat starts, the chatbot should:

1. Call the `insert_chat_id` API to generate a new chat_id
2. Store the chat_id for the current session
3. Use the chat_id for all subsequent operations

### 2. Example Integration

```javascript
class ZeemaChatbot {
    constructor() {
        this.chatId = null;
        this.apiService = new ZeemaAPIService();
        this.init();
    }

    async init() {
        // Generate new chat_id when chatbot starts
        const result = await this.apiService.insert_chat_id();
        if (result.success) {
            this.chatId = result.data.chat_id;
            this.chatCreatedAt = result.data.created_at;
            console.log('New chat session started:', this.chatId, 'at:', this.chatCreatedAt);
        }
    }

    async handleMessage(message) {
        // Use chat_id for message processing
        if (this.chatId) {
            // Process message with chat_id context
            console.log('Processing message for chat:', this.chatId);
        }
    }
}
```

## 🧪 Testing

### 1. Python API Testing

```bash
# Test the Python API
python chat_api.py test
```

This will:
- Generate a new chat_id
- Insert it into the database
- Retrieve it to verify the operation

### 2. JavaScript API Testing

Use the `test_chat_api.html` file to test the JavaScript implementation:

1. Open `test_chat_api.html` in a web browser
2. Click "Test Connection" to verify API connectivity
3. Click "Insert Chat ID" to test chat_id generation
4. Click "Get Chat" to test chat retrieval
5. Click "Test Full Flow" to test the complete workflow

## 📊 API Response Format

### Success Response

```json
{
    "success": true,
    "data": {
        "chat_id": "17547678231199633",
        "created_at": "2025-08-09T19:35:32.238Z"
    },
    "message": "Chat ID generated and inserted successfully"
}
```

### Error Response

```json
{
    "success": false,
    "data": null,
    "message": "Error: Database connection failed",
    "error": {
        "name": "ConnectionError",
        "message": "Database connection failed"
    }
}
```

## 🔒 Security Considerations

1. **API Key Management**: Ensure Supabase API keys are properly secured
2. **Input Validation**: All inputs are validated before processing
3. **Error Handling**: Sensitive information is not exposed in error messages
4. **CORS Configuration**: CORS is properly configured for web applications

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check Supabase URL and API key
   - Verify network connectivity
   - Check Supabase project status

2. **CORS Errors**
   - Ensure CORS headers are properly set
   - Check browser console for CORS errors
   - Verify API endpoint accessibility

3. **Chat ID Generation Failed**
   - Check ID generation function
   - Verify database table structure
   - Check for duplicate chat_id constraints

### Debug Mode

Enable debug logging by setting the log level:

```python
# In chat_api.py
logging.basicConfig(level=logging.DEBUG)
```

## 📝 Future Enhancements

1. **Chat History**: Store and retrieve chat message history
2. **User Sessions**: Link chats to user sessions
3. **Analytics**: Track chat metrics and usage patterns
4. **Real-time Updates**: WebSocket support for real-time chat updates
5. **Multi-language Support**: Support for multiple languages in chat sessions

## 🤝 Contributing

When contributing to the Chat API:

1. Follow the existing code structure and patterns
2. Add comprehensive error handling
3. Include logging for debugging
4. Write tests for new functionality
5. Update documentation

## 📞 Support

For issues and questions:

1. Check the troubleshooting section
2. Review the test files for examples
3. Check the Supabase documentation
4. Contact the development team 