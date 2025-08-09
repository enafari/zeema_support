#!/usr/bin/env python3
"""
Chat API - Python implementation
Connects to Supabase chats table and handles chat_id operations
"""

import os
import sys
import json
import requests
import uuid
from typing import Dict, List, Optional, Union
from dataclasses import dataclass
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import logging
from datetime import datetime, timezone

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

class ChatAPI:
    """API class for interacting with Supabase chats table"""
    
    def __init__(self, config: SupabaseConfig = None):
        self.config = config or SupabaseConfig()
    
    def generate_chat_id(self) -> str:
        """
        Generate a unique chat_id using timestamp and random number
        
        Returns:
            str: A unique chat_id
        """
        import time
        import random
        
        # Generate a unique ID using timestamp and random number
        timestamp = int(time.time() * 1000)  # Current time in milliseconds
        random_num = random.randint(1000, 9999)  # Random 4-digit number
        chat_id = f"{timestamp}{random_num}"
        
        return chat_id
    
    def insert_chat_id(self) -> Dict:
        """
        Generate a new chat_id and insert it into the chats table
        
        Returns:
            Dict containing success status, data, and message
        """
        try:
            logger.info("🔍 Generating new chat_id...")
            
            # Generate a unique chat_id
            chat_id = self.generate_chat_id()
            logger.info(f"🧹 Generated chat_id: {chat_id}")
            
            # Prepare the data to insert (chat_id and created_at)
            current_time = datetime.now(timezone.utc)
            chat_data = {
                "chat_id": chat_id,
                "created_at": current_time.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
            }
            
            logger.info("📋 Inserting chat_id into chats table...")
            insert_url = f"{self.config.url}/rest/v1/chats"
            logger.info(f"Insert URL: {insert_url}")
            
            response = requests.post(
                insert_url,
                headers=self.config.headers,
                json=chat_data,
                timeout=30
            )
            
            logger.info(f"Insert response status: {response.status_code}")
            
            if not response.ok:
                logger.error(f"Insert failed: {response.text}")
                raise Exception(f"HTTP error! status: {response.status_code}, details: {response.text}")
            
            # Handle response - it might be empty or not JSON
            data = None
            response_text = response.text.strip()
            
            if response_text:
                try:
                    data = json.loads(response_text)
                except json.JSONDecodeError:
                    logger.warning("Response is not valid JSON, treating as empty")
                    data = {}
            else:
                logger.info("Response is empty, treating as successful")
                data = {}
            
            logger.info(f"✅ Insert successful, data: {data}")
            
            return {
                "success": True,
                "data": {
                    "chat_id": chat_id,
                    "created_at": chat_data["created_at"]
                },
                "message": "Chat ID generated and inserted successfully"
            }
            
        except Exception as error:
            logger.error(f"❌ Error inserting chat_id: {error}")
            
            return {
                "success": False,
                "data": None,
                "message": f"Error: {str(error)}",
                "error": {
                    "name": type(error).__name__,
                    "message": str(error)
                }
            }
    
    def get_chat_by_id(self, chat_id: str) -> Dict:
        """
        Get chat information by chat_id
        
        Args:
            chat_id (str): The chat_id to look up
            
        Returns:
            Dict containing success status, data, and message
        """
        try:
            logger.info(f"🔍 Looking up chat_id: {chat_id}")
            
            # Query the chats table for the specific chat_id
            query_url = f"{self.config.url}/rest/v1/chats?chat_id=eq.{chat_id}&select=*"
            logger.info(f"Query URL: {query_url}")
            
            response = requests.get(
                query_url,
                headers=self.config.headers,
                timeout=30
            )
            
            logger.info(f"Query response status: {response.status_code}")
            
            if not response.ok:
                logger.error(f"Query failed: {response.text}")
                raise Exception(f"HTTP error! status: {response.status_code}, details: {response.text}")
            
            data = response.json()
            logger.info(f"Query response data: {data}")
            
            if data and len(data) > 0:
                chat_data = data[0]
                logger.info(f"✅ Found chat: {chat_data}")
                
                return {
                    "success": True,
                    "data": chat_data,
                    "message": "Chat found successfully"
                }
            else:
                logger.warning(f"❌ No chat found for chat_id: {chat_id}")
                
                return {
                    "success": False,
                    "data": None,
                    "message": f"No chat found for chat_id: {chat_id}"
                }
                
        except Exception as error:
            logger.error(f"❌ Error getting chat by ID: {error}")
            
            return {
                "success": False,
                "data": None,
                "message": f"Error: {str(error)}"
            }

    def insert_national_id(self, national_id: str, chat_id: str) -> Dict:
        """
        Insert national_id into chats table based on chat_id
        
        Args:
            national_id (str): The national_id to insert
            chat_id (str): The chat_id to update
            
        Returns:
            Dict containing success status, data, and message
        """
        try:
            logger.info(f"🔍 Inserting national_id: {national_id} for chat_id: {chat_id}")
            
            # Validate inputs
            if not national_id or not national_id.strip():
                logger.warning(f"❌ Invalid national_id provided: {national_id}")
                return {
                    "success": False,
                    "data": None,
                    "message": f"Invalid national_id provided: {national_id}"
                }
            
            if not chat_id or not chat_id.strip():
                logger.warning(f"❌ Invalid chat_id provided: {chat_id}")
                return {
                    "success": False,
                    "data": None,
                    "message": f"Invalid chat_id provided: {chat_id}"
                }
            
            # Clean the inputs
            clean_national_id = national_id.strip()
            clean_chat_id = chat_id.strip()
            
            logger.info(f"🧹 Cleaned national_id: {clean_national_id}, chat_id: {clean_chat_id}")
            
            # Update the chats table with the national_id
            update_url = f"{self.config.url}/rest/v1/chats?chat_id=eq.{clean_chat_id}"
            logger.info(f"Update URL: {update_url}")
            
            update_data = {
                "national_id": clean_national_id
            }
            
            logger.info(f"📋 Update data: {update_data}")
            
            update_response = requests.patch(
                update_url,
                headers=self.config.headers,
                json=update_data,
                timeout=30
            )
            
            logger.info(f"Update response status: {update_response.status_code}")
            
            if not update_response.ok:
                logger.error(f"Update failed: {update_response.text}")
                raise Exception(f"HTTP error! status: {update_response.status_code}, details: {update_response.text}")
            
            # Handle response - it might be empty or not JSON
            data = None
            response_text = update_response.text.strip()
            if response_text:
                try:
                    data = json.loads(response_text)
                except json.JSONDecodeError:
                    logger.warning("Response is not valid JSON, treating as empty")
                    data = {}
            else:
                logger.info("Response is empty, treating as successful")
                data = {}
            
            logger.info(f"✅ Successfully updated chat {clean_chat_id} with national_id {clean_national_id}")
            
            return {
                "success": True,
                "data": {
                    "chat_id": clean_chat_id,
                    "national_id": clean_national_id
                },
                "message": "National ID inserted successfully"
            }
                
        except Exception as error:
            logger.error(f"❌ Error inserting national_id: {error}")
            
            return {
                "success": False,
                "data": None,
                "message": f"Error: {str(error)}"
            }

class ChatHTTPHandler(BaseHTTPRequestHandler):
    """HTTP request handler for chat API"""
    
    def __init__(self, *args, api: ChatAPI = None, **kwargs):
        self.api = api or ChatAPI()
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
            if path == '/api/get_chat':
                # Extract chat_id from query parameters
                chat_id = query_params.get('chat_id', [None])[0]
                
                if not chat_id:
                    response = {
                        "success": False,
                        "data": None,
                        "message": "Missing chat_id parameter"
                    }
                else:
                    # Call the API
                    response = self.api.get_chat_by_id(chat_id)
                
                # Send response
                self.wfile.write(json.dumps(response, indent=2).encode())
                
            elif path == '/api/health':
                # Health check endpoint
                response = {
                    "success": True,
                    "message": "Chat API is running",
                    "endpoints": {
                        "insert_chat_id": "/api/insert_chat_id (POST)",
                        "get_chat": "/api/get_chat?chat_id=<chat_id> (GET)"
                    }
                }
                self.wfile.write(json.dumps(response, indent=2).encode())
                
            else:
                # 404 for unknown endpoints
                response = {
                    "success": False,
                    "message": "Endpoint not found",
                    "available_endpoints": [
                        "/api/insert_chat_id (POST)",
                        "/api/get_chat?chat_id=<chat_id> (GET)",
                        "/api/health (GET)"
                    ]
                }
                self.wfile.write(json.dumps(response, indent=2).encode())
                
        except Exception as error:
            logger.error(f"Error handling GET request: {error}")
            response = {
                "success": False,
                "message": f"Internal server error: {str(error)}"
            }
            self.wfile.write(json.dumps(response, indent=2).encode())
    
    def do_POST(self):
        """Handle POST requests"""
        # Parse URL
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        # Set CORS headers
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        
        try:
            if path == '/api/insert_chat_id':
                # Call the API to insert new chat_id
                response = self.api.insert_chat_id()
                
                # Send response
                self.wfile.write(json.dumps(response, indent=2).encode())
                
            elif path == '/api/insert_national_id':
                # Get the request body
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length)
                
                try:
                    request_data = json.loads(post_data.decode('utf-8'))
                    national_id = request_data.get('national_id')
                    chat_id = request_data.get('chat_id')
                    
                    if not national_id or not chat_id:
                        response = {
                            "success": False,
                            "message": "Missing required parameters: national_id and chat_id"
                        }
                    else:
                        # Call the API to insert national_id
                        response = self.api.insert_national_id(national_id, chat_id)
                    
                except json.JSONDecodeError:
                    response = {
                        "success": False,
                        "message": "Invalid JSON in request body"
                    }
                
                # Send response
                self.wfile.write(json.dumps(response, indent=2).encode())
                
            else:
                # 404 for unknown endpoints
                response = {
                    "success": False,
                    "message": "Endpoint not found",
                    "available_endpoints": [
                        "/api/insert_chat_id (POST)",
                        "/api/insert_national_id (POST) - requires: national_id, chat_id",
                        "/api/get_chat?chat_id=<chat_id> (GET)",
                        "/api/health (GET)"
                    ]
                }
                self.wfile.write(json.dumps(response, indent=2).encode())
                
        except Exception as error:
            logger.error(f"Error handling POST request: {error}")
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

def run_api_server(port: int = 8002):
    """Run the API server"""
    server_address = ('', port)
    
    # Create custom handler class with API instance
    class Handler(ChatHTTPHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, api=ChatAPI(), **kwargs)
    
    httpd = HTTPServer(server_address, Handler)
    
    print(f"🚀 Chat API Server")
    print(f"📍 Server running at: http://localhost:{port}")
    print(f"🔗 API Endpoints:")
    print(f"   - POST /api/insert_chat_id")
    print(f"   - GET /api/get_chat?chat_id=<chat_id>")
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
    api = ChatAPI()
    
    print("🧪 Testing Chat API...")
    print("-" * 50)
    
    # Test insert_chat_id
    print("\n📝 Testing insert_chat_id...")
    result = api.insert_chat_id()
    
    if result["success"]:
        print(f"✅ Success: {result['message']}")
        print(f"📊 Chat ID: {result['data']['chat_id']}")
        
        # Test get_chat_by_id with the generated chat_id
        chat_id = result['data']['chat_id']
        print(f"\n📝 Testing get_chat_by_id with chat_id: {chat_id}")
        get_result = api.get_chat_by_id(chat_id)
        
        if get_result["success"]:
            print(f"✅ Success: {get_result['message']}")
            print(f"📊 Data: {get_result['data']}")
        else:
            print(f"❌ Error: {get_result['message']}")
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
                print("❌ Invalid port number. Using default port 8002.")
                run_api_server()
    else:
        run_api_server() 