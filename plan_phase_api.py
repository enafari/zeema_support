#!/usr/bin/env python3
"""
Plan Phase API - Python implementation
Connects to Supabase plan_phase table and retrieves data by plan_id
"""

import os
import sys
import json
import requests
from typing import Dict, List, Optional, Union
from dataclasses import dataclass
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class SupabaseConfig:
    """Supabase configuration"""
    url: str = 'https://woobghuekrbzilcdmijv.supabase.co'
    api_key: str = 'sb_publishable_H0UBKWC3vpPfBIFkTBKWgQ_Xxd28nG8'
    
    @property
    def headers(self) -> Dict[str, str]:
        return {
            'apikey': self.api_key,
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

class PlanPhaseAPI:
    """API class for interacting with Supabase plan_phase table"""
    
    def __init__(self, config: SupabaseConfig = None):
        self.config = config or SupabaseConfig()
    
    def get_plan_phase(self, plan_id: Union[str, int]) -> Dict:
        """
        Retrieve plan phases by plan_id from Supabase
        
        Args:
            plan_id: The plan ID to search for (can be string or number)
            
        Returns:
            Dict containing success status, data, and message
        """
        try:
            logger.info(f"🔍 Fetching plan phases for plan ID: {plan_id}")
            
            # Validate input
            if not plan_id:
                raise ValueError("Invalid plan ID provided")
            
            # Convert to string and clean the plan ID
            clean_plan_id = str(plan_id).strip()
            logger.info(f"🧹 Cleaned plan ID: {clean_plan_id}")
            
            # Query the plan_phase table
            logger.info("📋 Querying plan_phase table...")
            query_url = f"{self.config.url}/rest/v1/plan_phase?plan_id=eq.{clean_plan_id}&select=*"
            logger.info(f"Query URL: {query_url}")
            
            response = requests.get(
                query_url,
                headers=self.config.headers,
                timeout=30
            )
            
            logger.info(f"Query response status: {response.status_code}")
            
            if not response.ok:
                logger.error(f"Query failed: {response.text}")
                
                # Try alternative query format
                logger.info("🔄 Trying alternative query format...")
                alt_query_url = f"{self.config.url}/rest/v1/plan_phase?select=*&plan_id=eq.{clean_plan_id}"
                logger.info(f"Alternative query URL: {alt_query_url}")
                
                alt_response = requests.get(
                    alt_query_url,
                    headers=self.config.headers,
                    timeout=30
                )
                
                logger.info(f"Alternative query status: {alt_response.status_code}")
                
                if not alt_response.ok:
                    logger.error(f"Alternative query also failed: {alt_response.text}")
                    raise Exception(f"HTTP error! status: {alt_response.status_code}, details: {alt_response.text}")
                
                data = alt_response.json()
                logger.info(f"✅ Alternative query successful, data count: {len(data)}")
                
                return {
                    "success": True,
                    "data": data,
                    "message": "Plan phases retrieved successfully" if data else "No plan phases found for this plan ID"
                }
            
            data = response.json()
            logger.info(f"✅ Query successful, data count: {len(data)}")
            
            return {
                "success": True,
                "data": data,
                "message": "Plan phases retrieved successfully" if data else "No plan phases found for this plan ID"
            }
            
        except Exception as error:
            logger.error(f"❌ Error fetching plan phases: {error}")
            
            # Provide more detailed error information
            error_message = str(error)
            if "requests.exceptions" in str(type(error)):
                error_message = "Network error - please check your internet connection"
            elif "timeout" in str(error).lower():
                error_message = "Request timeout - please try again"
            
            return {
                "success": False,
                "data": None,
                "message": f"Error: {error_message}",
                "error": {
                    "name": type(error).__name__,
                    "message": str(error)
                }
            }

class PlanPhaseHTTPHandler(BaseHTTPRequestHandler):
    """HTTP request handler for plan phase API"""
    
    def __init__(self, *args, api: PlanPhaseAPI = None, **kwargs):
        self.api = api or PlanPhaseAPI()
        super().__init__(*args, **kwargs)
    
    def do_GET(self):
        """Handle GET requests"""
        # Parse URL
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        query_params = parse_qs(parsed_url.query)
        
        # Set CORS headers
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        
        try:
            if path == '/api/get_plan_phase':
                # Extract plan_id from query parameters
                plan_id = query_params.get('plan_id', [None])[0]
                
                if not plan_id:
                    response = {
                        "success": False,
                        "data": None,
                        "message": "Missing plan_id parameter"
                    }
                else:
                    # Call the API
                    response = self.api.get_plan_phase(plan_id)
                
                # Send response
                self.wfile.write(json.dumps(response, indent=2).encode())
                
            elif path == '/api/health':
                # Health check endpoint
                response = {
                    "success": True,
                    "message": "Plan Phase API is running",
                    "endpoints": {
                        "get_plan_phase": "/api/get_plan_phase?plan_id=<plan_id>"
                    }
                }
                self.wfile.write(json.dumps(response, indent=2).encode())
                
            else:
                # 404 for unknown endpoints
                response = {
                    "success": False,
                    "message": "Endpoint not found",
                    "available_endpoints": [
                        "/api/get_plan_phase?plan_id=<plan_id>",
                        "/api/health"
                    ]
                }
                self.wfile.write(json.dumps(response, indent=2).encode())
                
        except Exception as error:
            logger.error(f"Error handling request: {error}")
            response = {
                "success": False,
                "message": f"Internal server error: {str(error)}"
            }
            self.wfile.write(json.dumps(response, indent=2).encode())
    
    def do_OPTIONS(self):
        """Handle OPTIONS requests for CORS"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def run_api_server(port: int = 8001):
    """Run the API server"""
    server_address = ('', port)
    
    # Create custom handler class with API instance
    class Handler(PlanPhaseHTTPHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, api=PlanPhaseAPI(), **kwargs)
    
    httpd = HTTPServer(server_address, Handler)
    
    print(f"🚀 Plan Phase API Server")
    print(f"📍 Server running at: http://localhost:{port}")
    print(f"🔗 API Endpoints:")
    print(f"   - GET /api/get_plan_phase?plan_id=<plan_id>")
    print(f"   - GET /api/health")
    print(f"⏹️  Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        httpd.shutdown()

def test_api():
    """Test the API functionality"""
    api = PlanPhaseAPI()
    
    # Test cases
    test_cases = [
        "123",
        "ABC123",
        "TEST_PLAN",
        456
    ]
    
    print("🧪 Testing Plan Phase API...")
    print("-" * 50)
    
    for plan_id in test_cases:
        print(f"\n📝 Testing with plan_id: {plan_id}")
        result = api.get_plan_phase(plan_id)
        
        if result["success"]:
            print(f"✅ Success: {result['message']}")
            print(f"📊 Data count: {len(result['data']) if result['data'] else 0}")
        else:
            print(f"❌ Error: {result['message']}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        if sys.argv[1] == "test":
            test_api()
        else:
            try:
                port = int(sys.argv[1])
                run_api_server(port)
            except ValueError:
                print("❌ Invalid port number. Using default port 8001.")
                run_api_server()
    else:
        run_api_server() 