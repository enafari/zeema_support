#!/usr/bin/env python3
"""
Date Conversion Debug Test
Tests the date conversion functionality
"""

import requests
import json
import sys

def test_api_health():
    """Test the API health endpoint"""
    print('🔍 Testing API Health...')
    
    try:
        response = requests.get('http://localhost:8001/api/health', timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print('✅ API Health Check: OK')
                print(f"📋 Message: {data.get('message')}")
                return True
            else:
                print('❌ API Health Check: Failed')
                return False
        else:
            print(f'❌ API Health Check: HTTP {response.status_code}')
            return False
            
    except requests.exceptions.ConnectionError:
        print('❌ API Health Check: Connection failed - server may not be running')
        return False
    except Exception as e:
        print(f'❌ API Health Check Error: {e}')
        return False

def test_date_conversion():
    """Test date conversion functionality"""
    print('\n🧪 Testing Date Conversion...')
    print('-' * 50)
    
    test_dates = [
        '2024-01-15',
        '2023-12-20',
        '2024-03-01',
        '2024-06-15',
        '2024-09-22',
        '2024-12-31',
        '2023-03-21',  # Persian New Year
        '2023-06-21',  # Summer Solstice
        '2023-09-23',  # Autumn Equinox
        '2023-12-21'   # Winter Solstice
    ]
    
    success_count = 0
    total_count = len(test_dates)
    
    for gregorian_date in test_dates:
        try:
            response = requests.get(
                f'http://localhost:8001/api/convert_date?date={gregorian_date}',
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    solar_date = data.get('solar_date')
                    print(f"📅 {gregorian_date} → {solar_date}")
                    success_count += 1
                else:
                    print(f"❌ {gregorian_date}: {data.get('message')}")
            else:
                print(f"❌ {gregorian_date}: HTTP {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print(f"❌ {gregorian_date}: Connection failed")
        except Exception as e:
            print(f"❌ {gregorian_date}: {e}")
    
    print(f'\n📊 Results: {success_count}/{total_count} successful conversions')
    
    if success_count == total_count:
        print('✅ All date conversions successful!')
        return True
    else:
        print('⚠️ Some date conversions failed')
        return False

def test_error_handling():
    """Test error handling with invalid dates"""
    print('\n⚠️ Testing Error Handling...')
    print('-' * 50)
    
    invalid_dates = [
        'invalid-date',
        '2024-13-01',  # Invalid month
        '2024-02-30',  # Invalid day
        '2024-00-01',  # Invalid month
        '2024-01-00',  # Invalid day
        '',  # Empty date
        'not-a-date'
    ]
    
    for invalid_date in invalid_dates:
        try:
            response = requests.get(
                f'http://localhost:8001/api/convert_date?date={invalid_date}',
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    print(f"⚠️ {invalid_date} → {data.get('solar_date')} (unexpected success)")
                else:
                    print(f"✅ {invalid_date}: {data.get('message')} (expected error)")
            else:
                print(f"✅ {invalid_date}: HTTP {response.status_code} (expected error)")
                
        except Exception as e:
            print(f"✅ {invalid_date}: {e} (expected error)")
    
    print('✅ Error handling test completed!')

def test_python_converter():
    """Test the Python date converter directly"""
    print('\n🐍 Testing Python Date Converter...')
    print('-' * 50)
    
    try:
        from date_converter import DateConverter
        
        converter = DateConverter()
        test_dates = [
            '2024-01-15',
            '2023-12-20',
            '2024-03-01'
        ]
        
        for gregorian_date in test_dates:
            solar_date = converter.gregorian_to_solar(gregorian_date)
            print(f"📅 {gregorian_date} → {solar_date}")
        
        print('✅ Python converter test completed!')
        return True
        
    except ImportError as e:
        print(f'❌ Python converter import error: {e}')
        return False
    except Exception as e:
        print(f'❌ Python converter error: {e}')
        return False

def main():
    """Run all tests"""
    print('🚀 Starting Date Conversion Debug Tests...')
    print('=' * 60)
    
    # Test 1: API Health
    api_healthy = test_api_health()
    
    if not api_healthy:
        print('\n❌ API is not healthy. Please start the date converter server:')
        print('   python3 date_converter_server.py')
        return
    
    # Test 2: Date Conversion
    conversion_success = test_date_conversion()
    
    # Test 3: Error Handling
    test_error_handling()
    
    # Test 4: Python Converter
    python_success = test_python_converter()
    
    # Summary
    print('\n' + '=' * 60)
    print('📊 TEST SUMMARY')
    print('=' * 60)
    print(f"✅ API Health: {'PASS' if api_healthy else 'FAIL'}")
    print(f"✅ Date Conversion: {'PASS' if conversion_success else 'FAIL'}")
    print(f"✅ Python Converter: {'PASS' if python_success else 'FAIL'}")
    
    if api_healthy and conversion_success and python_success:
        print('\n🎉 All tests passed! Date conversion is working correctly.')
    else:
        print('\n⚠️ Some tests failed. Please check the issues above.')

if __name__ == "__main__":
    main() 