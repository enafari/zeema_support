# Plan Phase API Documentation

This document describes the `get_plan_phase` API that retrieves plan phases from the Supabase `plan_phase` table based on a plan ID.

## Overview

The `get_plan_phase` API connects to the Supabase database and filters rows from the `plan_phase` table where the `plan_id` column matches the provided input. The API returns the filtered rows in JSON format.

## Implementation Options

### 1. JavaScript Implementation (Recommended)

The API is implemented in the `ZeemaAPIService` class in `api_service.js`.

#### Usage

```javascript
// Initialize the API service
const apiService = new ZeemaAPIService();

// Call the API
const response = await apiService.get_plan_phase(planId);

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
            "phase_name": "Phase 1",
            "phase_description": "Initial phase",
            "created_at": "2024-01-01T00:00:00Z",
            // ... other fields from plan_phase table
        }
    ],
    "message": "Plan phases retrieved successfully"
}
```

### 2. Python Implementation

The API is also implemented as a Python HTTP server in `plan_phase_api.py`.

#### Running the Python Server

```bash
# Activate conda environment
conda activate my_conda_env

# Install dependencies
pip install -r requirements.txt

# Run the server
python plan_phase_api.py

# Or specify a custom port
python plan_phase_api.py 8002

# Test the API functionality
python plan_phase_api.py test
```

#### API Endpoints

- `GET /api/get_plan_phase?plan_id=<plan_id>` - Get plan phases by plan ID
- `GET /api/health` - Health check endpoint

#### Example Usage

```bash
# Test with curl
curl "http://localhost:8001/api/get_plan_phase?plan_id=123"

# Test health endpoint
curl "http://localhost:8001/api/health"
```

## Testing

### JavaScript Testing

Use the provided test file `test_plan_phase_api.html`:

1. Open `test_plan_phase_api.html` in a web browser
2. Enter a plan ID in the input field
3. Click "Test Get Plan Phase API"
4. View the results in the response area

### Python Testing

```bash
# Run the test function
python plan_phase_api.py test
```

## Input Parameters

- **plan_id** (required): The plan ID to search for
  - Type: string or number
  - Examples: "123", "ABC123", 456, "TEST_PLAN"

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
            "phase_name": "Phase 1",
            "phase_description": "Initial phase",
            "created_at": "2024-01-01T00:00:00Z"
        }
    ],
    "message": "Plan phases retrieved successfully"
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

- Invalid input parameters
- Network connectivity issues
- Supabase API errors
- CORS issues
- Timeout errors

## Database Schema

The API connects to the `plan_phase` table in Supabase with the following expected structure:

```sql
CREATE TABLE plan_phase (
    id SERIAL PRIMARY KEY,
    plan_id VARCHAR NOT NULL,
    phase_name VARCHAR,
    phase_description TEXT,
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

async function getPlanPhases(planId) {
    try {
        const response = await apiService.get_plan_phase(planId);
        
        if (response.success) {
            console.log('Found phases:', response.data.length);
            response.data.forEach(phase => {
                console.log(`- ${phase.phase_name}: ${phase.phase_description}`);
            });
        } else {
            console.error('API Error:', response.message);
        }
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

// Usage
getPlanPhases("123");
```

### Python Example

```python
from plan_phase_api import PlanPhaseAPI

# Initialize API
api = PlanPhaseAPI()

# Get plan phases
result = api.get_plan_phase("123")

if result["success"]:
    print(f"Found {len(result['data'])} phases")
    for phase in result["data"]:
        print(f"- {phase['phase_name']}: {phase['phase_description']}")
else:
    print(f"Error: {result['message']}")
```

## Troubleshooting

### Common Issues

1. **Network Error**: Check internet connection and Supabase URL
2. **Authentication Error**: Verify API key is correct
3. **CORS Error**: Ensure proper headers are set
4. **No Data Found**: Verify plan_id exists in the database

### Debug Mode

Both implementations include detailed logging. Check the browser console (JavaScript) or terminal output (Python) for debugging information.

## Support

For issues or questions about the API implementation, check:

1. Browser console for JavaScript errors
2. Terminal output for Python errors
3. Supabase dashboard for database connectivity
4. Network tab in browser dev tools for HTTP requests 