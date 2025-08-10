# Plan Phase Timeline API Documentation

This document describes the `get_plan_phase_timeline` API that retrieves plan phase timeline data from the Supabase `plan_phase_timeline` table based on a list of plan IDs.

## Overview

The `get_plan_phase_timeline` API connects to the Supabase database and filters rows from the `plan_phase_timeline` table where the `plan_id` column matches any of the provided plan IDs. The API returns the filtered rows in JSON format.

## Implementation Options

### 1. JavaScript Implementation (Recommended)

The API is implemented in the `ZeemaAPIService` class in `api_service.js`.

#### Usage

```javascript
// Initialize the API service
const apiService = new ZeemaAPIService();

// Call the API with a list of plan IDs
const response = await apiService.get_plan_phase_timeline(['123', '456', '789']);

// Handle the response
if (response.success) {
    console.log('Data:', response.data);
    console.log('Message:', response.message);
} else {
    console.error('Error:', response.message);
}
```

#### Response Format

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "plan_id": "123",
            "timeline_date": "2024-01-15",
            "timeline_description": "Phase 1 completed",
            "created_at": "2024-01-01T00:00:00Z",
            // ... other fields from plan_phase_timeline table
        },
        {
            "id": 2,
            "plan_id": "456",
            "timeline_date": "2024-02-15",
            "timeline_description": "Phase 2 started",
            "created_at": "2024-02-01T00:00:00Z",
            // ... other fields from plan_phase_timeline table
        }
    ],
    "message": "Plan phase timeline retrieved successfully"
}
```

### 2. Python Implementation

The API is also implemented as a Python HTTP server in `plan_phase_timeline_api.py`.

#### Running the Python Server

```bash
# Activate conda environment
conda activate my_conda_env

# Install dependencies
pip install -r requirements.txt

# Run the server
python plan_phase_timeline_api.py

# Or specify a custom port
python plan_phase_timeline_api.py 8003

# Test the API functionality
python plan_phase_timeline_api.py test
```

#### API Endpoints

- `GET /api/get_plan_phase_timeline?plan_ids=<plan_id1>,<plan_id2>,...` - Get plan phase timeline by plan IDs
- `GET /api/health` - Health check endpoint

#### Example Usage

```bash
# Test with curl
curl "http://localhost:8003/api/get_plan_phase_timeline?plan_ids=123,456,789"

# Test health endpoint
curl "http://localhost:8003/api/health"
```

## Testing

### JavaScript Testing

Use the provided test file `test_plan_phase_timeline_api.html`:

1. Open `test_plan_phase_timeline_api.html` in a web browser
2. Enter plan IDs in the input field (comma-separated)
3. Click "Test API"
4. View the results in the response area

### Python Testing

```bash
# Run the test function
python plan_phase_timeline_api.py test
```

## Input Parameters

- **plan_ids** (required): List of plan IDs to search for
  - Type: array of strings or numbers
  - Examples: `["123", "456"]`, `["ABC123", "DEF456"]`, `[123, 456]`

## Output Format

The API returns a JSON object with the following structure:

```json
{
    "success": boolean,
    "data": array | null,
    "message": string,
    "error": {
        "name": string,
        "message": string
    } // Only present when success is false
}
```

### Success Response

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "plan_id": "123",
            "timeline_date": "2024-01-15",
            "timeline_description": "Phase 1 completed",
            "created_at": "2024-01-01T00:00:00Z"
        },
        {
            "id": 2,
            "plan_id": "456",
            "timeline_date": "2024-02-15",
            "timeline_description": "Phase 2 started",
            "created_at": "2024-02-01T00:00:00Z"
        }
    ],
    "message": "Plan phase timeline retrieved successfully"
}
```

### Error Response

```json
{
    "success": false,
    "data": null,
    "message": "Error: Network error - please check your internet connection",
    "error": {
        "name": "TypeError",
        "message": "Network error"
    }
}
```

## Error Handling

The API includes comprehensive error handling for:

- Invalid input parameters (empty array, null, non-array)
- Network connectivity issues
- Supabase API errors
- CORS issues
- Timeout errors

## Database Schema

The API connects to the `plan_phase_timeline` table in Supabase with the following expected structure:

```sql
CREATE TABLE plan_phase_timeline (
    id SERIAL PRIMARY KEY,
    plan_id VARCHAR NOT NULL,
    timeline_date DATE,
    timeline_description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    -- ... other fields as needed
);
```

## Security

- The API uses the Supabase API key for authentication
- CORS headers are properly configured
- Input validation is implemented
- Error messages are sanitized for security

## Dependencies

### JavaScript
- No additional dependencies required (uses native fetch API)

### Python
- `requests>=2.25.1`

## Configuration

The API uses the following Supabase configuration:

- **URL**: `https://woobghuekrbzilcdmijv.supabase.co`
- **API Key**: `sb_publishable_H0UBKWC3vpPfBIFkTBKWgQ_Xxd28nG8`

## Examples

### JavaScript Example

```javascript
// Complete example
const apiService = new ZeemaAPIService();

async function getPlanPhaseTimeline(planIds) {
    try {
        const response = await apiService.get_plan_phase_timeline(planIds);
        
        if (response.success) {
            console.log('Found timeline entries:', response.data.length);
            response.data.forEach(entry => {
                console.log(`- Plan ${entry.plan_id}: ${entry.timeline_description} on ${entry.timeline_date}`);
            });
        } else {
            console.error('API Error:', response.message);
        }
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

// Usage
getPlanPhaseTimeline(['123', '456', '789']);
```

### Python Example

```python
from plan_phase_timeline_api import PlanPhaseTimelineAPI

# Initialize API
api = PlanPhaseTimelineAPI()

# Get plan phase timeline
result = api.get_plan_phase_timeline(['123', '456', '789'])

if result["success"]:
    print(f"Found {len(result['data'])} timeline entries")
    for entry in result["data"]:
        print(f"- Plan {entry['plan_id']}: {entry['timeline_description']} on {entry['timeline_date']}")
else:
    print(f"Error: {result['message']}")
```

## Troubleshooting

### Common Issues

1. **Network Error**: Check internet connection and Supabase URL
2. **Authentication Error**: Verify API key is correct
3. **CORS Error**: Ensure proper headers are set
4. **No Data Found**: Verify plan_ids exist in the database

### Debug Mode

Both implementations include detailed logging. Check the browser console (JavaScript) or terminal output (Python) for debugging information.

## Integration with Existing APIs

This API complements the existing `get_plan_phase` API:

- `get_plan_phase`: Retrieves phase information for a single plan
- `get_plan_phase_timeline`: Retrieves timeline data for multiple plans

## Future Enhancements

1. **Pagination**: Support for large datasets with pagination
2. **Filtering**: Additional filtering options (date range, status, etc.)
3. **Sorting**: Custom sorting options
4. **Caching**: Implement caching for frequently accessed data

## Testing Scenarios

### Valid Test Cases

1. **Single Plan ID**: `['123']`
2. **Multiple Plan IDs**: `['123', '456', '789']`
3. **Mixed Types**: `['123', 'ABC123', 456]`
4. **Large List**: `['1', '2', '3', '4', '5']`

### Error Test Cases

1. **Empty Array**: `[]`
2. **Null Input**: `null`
3. **Invalid Type**: `'123'` (string instead of array)
4. **Empty Strings**: `['', '123', '']`

## Performance Considerations

- The API uses efficient SQL queries with `IN` operator
- Multiple fallback strategies for different query formats
- Proper error handling to avoid timeouts
- Logging for performance monitoring

## Monitoring and Logging

Both implementations include comprehensive logging:

- Request/response logging
- Error logging with stack traces
- Performance metrics
- Debug information for troubleshooting 