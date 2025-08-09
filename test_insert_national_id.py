#!/usr/bin/env python3
"""
Test script for insert_national_id API
"""

import requests
import json

def test_insert_national_id():
    """Test the insert_national_id API"""
    
    # Test data
    test_data = {
        "national_id": "0372829163",
        "chat_id": "17547727164781886"  # Use the chat_id from the previous test
    }
    
    print("🧪 Testing insert_national_id API...")
    print(f"📋 Test data: {json.dumps(test_data, indent=2)}")
    
    try:
        # Make the API call
        response = requests.post(
            "http://localhost:8002/api/insert_national_id",
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            json=test_data,
            timeout=30
        )
        
        print(f"📊 Response status: {response.status_code}")
        print(f"📊 Response headers: {dict(response.headers)}")
        
        if response.ok:
            try:
                data = response.json()
                print(f"✅ Success: {json.dumps(data, indent=2)}")
            except json.JSONDecodeError:
                print(f"⚠️ Response is not JSON: {response.text}")
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")

if __name__ == "__main__":
    test_insert_national_id() 