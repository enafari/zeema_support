#!/usr/bin/env python3
"""
Plan Phase Timeline API - Python implementation
Connects to Supabase plan_phase_timeline table and retrieves data by plan_id list
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

class PlanPhaseTimelineAPI:
    """API class for interacting with Supabase plan_phase_timeline table"""
    
    def __init__(self, config: SupabaseConfig = None):
        self.config = config or SupabaseConfig()
    
    def get_plan_phase_timeline(self, plan_ids: List[Union[str, int]]) -> Dict:
        """
        Retrieve plan phase timeline data by plan_id list from Supabase
        
        Args:
            plan_ids: List of plan IDs to search for (can be strings or numbers)
            
        Returns:
            Dict containing success status, data, and message
        """
        try:
            logger.info(f"🔍 Fetching plan phase timeline for plan IDs: {plan_ids}")
            
            # Validate input
            if not plan_ids or not isinstance(plan_ids, list):
                raise ValueError("Invalid plan_ids provided - must be a non-empty list")
            
            if len(plan_ids) == 0:
                raise ValueError("Plan IDs list cannot be empty")
            
            # Convert to strings and clean the plan IDs
            clean_plan_ids = [str(plan_id).strip() for plan_id in plan_ids if plan_id]
            logger.info(f"🧹 Cleaned plan IDs: {clean_plan_ids}")
            
            if not clean_plan_ids:
                raise ValueError("No valid plan IDs provided")
            
            # Build the query with multiple plan_ids using 'in' operator
            logger.info("📋 Querying plan_phase_timeline table...")
            
            # Create the query parameters for multiple plan_ids
            plan_id_filters = []
            for plan_id in clean_plan_ids:
                plan_id_filters.append(f"plan_id=eq.{plan_id}")
            
            # Join multiple conditions with 'or'
            query_filter = "&".join(plan_id_filters)
            query_url = f"{self.config.url}/rest/v1/plan_phase_timeline?{query_filter}&select=*"
            logger.info(f"Query URL: {query_url}")
            
            response = requests.get(
                query_url,
                headers=self.config.headers,
                timeout=30
            )
            
            logger.info(f"Query response status: {response.status_code}")
            
            if not response.ok:
                logger.error(f"Query failed: {response.text}")
                
                # Try alternative query format using 'in' operator
                logger.info("🔄 Trying alternative query format with 'in' operator...")
                
                # Format plan_ids for 'in' operator
                plan_ids_str = ",".join([f'"{plan_id}"' for plan_id in clean_plan_ids])
                alt_query_url = f"{self.config.url}/rest/v1/plan_phase_timeline?plan_id=in.({plan_ids_str})&select=*"
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
                    "message": "Plan phase timeline retrieved successfully" if data else "No plan phase timeline found for the provided plan IDs"
                }
            
            data = response.json()
            logger.info(f"✅ Query successful, data count: {len(data)}")
            
            return {
                "success": True,
                "data": data,
                "message": "Plan phase timeline retrieved successfully" if data else "No plan phase timeline found for the provided plan IDs"
            }
            
        except Exception as error:
            logger.error(f"❌ Error fetching plan phase timeline: {error}")
            
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

class PlanPhaseTimelineHTTPHandler(BaseHTTPRequestHandler):
    """HTTP request handler for plan phase timeline API"""
    
    def __init__(self, *args, api: PlanPhaseTimelineAPI = None, **kwargs):
        self.api = api or PlanPhaseTimelineAPI()
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
            if path == '/api/get_plan_phase_timeline':
                # Extract plan_ids from query parameters
                plan_ids_param = query_params.get('plan_ids', [None])[0]
                
                if not plan_ids_param:
                    response = {
                        "success": False,
                        "data": None,
                        "message": "Missing plan_ids parameter"
                    }
                else:
                    # Parse the plan_ids parameter (comma-separated values)
                    try:
                        plan_ids = [plan_id.strip() for plan_id in plan_ids_param.split(',') if plan_id.strip()]
                        if not plan_ids:
                            response = {
                                "success": False,
                                "data": None,
                                "message": "Invalid plan_ids parameter - must be comma-separated values"
                            }
                        else:
                            # Call the API
                            response = self.api.get_plan_phase_timeline(plan_ids)
                    except Exception as e:
                        response = {
                            "success": False,
                            "data": None,
                            "message": f"Error parsing plan_ids parameter: {str(e)}"
                        }
                
                # Send response
                self.wfile.write(json.dumps(response, indent=2).encode())
                
            elif path == '/api/health':
                # Health check endpoint
                response = {
                    "success": True,
                    "message": "Plan Phase Timeline API is running",
                    "endpoints": {
                        "get_plan_phase_timeline": "/api/get_plan_phase_timeline?plan_ids=<plan_id1>,<plan_id2>,..."
                    }
                }
                self.wfile.write(json.dumps(response, indent=2).encode())
                
            else:
                # 404 for unknown endpoints
                response = {
                    "success": False,
                    "message": "Endpoint not found",
                    "available_endpoints": [
                        "/api/get_plan_phase_timeline?plan_ids=<plan_id1>,<plan_id2>,...",
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

def run_api_server(port: int = 8003):
    """Run the API server"""
    server_address = ('', port)
    
    # Create custom handler class with API instance
    class Handler(PlanPhaseTimelineHTTPHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, api=PlanPhaseTimelineAPI(), **kwargs)
    
    httpd = HTTPServer(server_address, Handler)
    
    print(f"🚀 Plan Phase Timeline API Server")
    print(f"📍 Server running at: http://localhost:{port}")
    print(f"🔗 API Endpoints:")
    print(f"   - GET /api/get_plan_phase_timeline?plan_ids=<plan_id1>,<plan_id2>,...")
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
    api = PlanPhaseTimelineAPI()
    
    # Test cases
    test_cases = [
        ["123", "456"],
        ["ABC123", "DEF456"],
        ["TEST_PLAN_1", "TEST_PLAN_2"],
        ["123"]
    ]
    
    print("🧪 Testing Plan Phase Timeline API...")
    print("-" * 50)
    
    for plan_ids in test_cases:
        print(f"\n📝 Testing with plan_ids: {plan_ids}")
        result = api.get_plan_phase_timeline(plan_ids)
        
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
                print("❌ Invalid port number. Using default port 8003.")
                run_api_server()
    else:
        run_api_server() 