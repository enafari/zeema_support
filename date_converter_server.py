#!/usr/bin/env python3
"""
Date Converter Server for Zeema Chatbot
Provides HTTP API endpoints for date conversion
"""

import json
import sys
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from jalaali import Jalaali

class DateConverterHandler(BaseHTTPRequestHandler):
    """HTTP request handler for date conversion API"""
    
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
            if path == '/api/convert_date':
                # Extract date from query parameters
                gregorian_date = query_params.get('date', [None])[0]
                
                if not gregorian_date:
                    response = {
                        "success": False,
                        "message": "Missing date parameter"
                    }
                else:
                    # Convert date
                    solar_date = self.convert_to_solar(gregorian_date)
                    response = {
                        "success": True,
                        "gregorian_date": gregorian_date,
                        "solar_date": solar_date
                    }
                
                # Send response
                self.wfile.write(json.dumps(response, indent=2).encode())
                
            elif path == '/api/health':
                # Health check endpoint
                response = {
                    "success": True,
                    "message": "Date Converter API is running",
                    "endpoints": {
                        "convert_date": "/api/convert_date?date=YYYY-MM-DD",
                        "health": "/api/health"
                    }
                }
                self.wfile.write(json.dumps(response, indent=2).encode())
                
            else:
                # 404 for unknown endpoints
                response = {
                    "success": False,
                    "message": "Endpoint not found",
                    "available_endpoints": [
                        "/api/convert_date?date=YYYY-MM-DD",
                        "/api/health"
                    ]
                }
                self.wfile.write(json.dumps(response, indent=2).encode())
                
        except Exception as error:
            response = {
                "success": False,
                "message": f"Internal server error: {str(error)}"
            }
            self.wfile.write(json.dumps(response, indent=2).encode())
    
    def convert_to_solar(self, gregorian_date):
        """
        Convert Gregorian date to Solar (Persian) calendar
        
        Args:
            gregorian_date (str): Date in format 'YYYY-MM-DD'
            
        Returns:
            str: Date in Solar calendar format 'YYYY/MM/DD'
        """
        try:
            # Validate input
            if not gregorian_date or gregorian_date.strip() == '':
                raise ValueError("Empty date provided")
            
            # Parse the input date
            if 'T' in gregorian_date:
                # ISO format
                dt = datetime.fromisoformat(gregorian_date.replace('Z', '+00:00'))
            else:
                # YYYY-MM-DD format
                dt = datetime.strptime(gregorian_date, '%Y-%m-%d')
            
            # Validate date components
            if dt.year < 1900 or dt.year > 2100:
                raise ValueError("Year out of valid range (1900-2100)")
            
            # Convert to Solar calendar using jalaali library
            j = Jalaali.to_jalaali(dt.year, dt.month, dt.day)
            
            # Format as YYYY/MM/DD
            return f"{j['jy']}/{j['jm']:02d}/{j['jd']:02d}"
            
        except ValueError as e:
            print(f"Invalid date format {gregorian_date}: {e}", file=sys.stderr)
            return 'نامشخص'
        except Exception as e:
            print(f"Error converting date {gregorian_date}: {e}", file=sys.stderr)
            return 'نامشخص'

def run_server(port=8001):
    """Run the date converter server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, DateConverterHandler)
    print(f"🚀 Date Converter Server running on port {port}")
    print(f"📋 Available endpoints:")
    print(f"  - GET /api/convert_date?date=YYYY-MM-DD")
    print(f"  - GET /api/health")
    print(f"🌐 Server URL: http://localhost:{port}")
    httpd.serve_forever()

if __name__ == "__main__":
    port = 8001
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"Invalid port number: {sys.argv[1]}")
            sys.exit(1)
    
    run_server(port) 