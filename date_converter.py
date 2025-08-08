#!/usr/bin/env python3
"""
Date Converter Utility for Zeema Chatbot
Uses jalaali-python library for accurate Solar calendar conversion
"""

import json
import sys
from datetime import datetime
from jalaali import Jalaali

class DateConverter:
    """Utility class for converting dates between Gregorian and Solar calendars"""
    
    @staticmethod
    def gregorian_to_solar(gregorian_date):
        """
        Convert Gregorian date to Solar (Persian) calendar
        
        Args:
            gregorian_date (str): Date in format 'YYYY-MM-DD' or ISO string
            
        Returns:
            str: Date in Solar calendar format 'YYYY/MM/DD'
        """
        try:
            # Validate input
            if not gregorian_date or (isinstance(gregorian_date, str) and gregorian_date.strip() == ''):
                raise ValueError("Empty date provided")
            
            # Parse the input date
            if isinstance(gregorian_date, str):
                # Handle different date formats
                if 'T' in gregorian_date:
                    # ISO format
                    dt = datetime.fromisoformat(gregorian_date.replace('Z', '+00:00'))
                else:
                    # YYYY-MM-DD format
                    dt = datetime.strptime(gregorian_date, '%Y-%m-%d')
            else:
                dt = gregorian_date
            
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
    
    @staticmethod
    def solar_to_gregorian(solar_date):
        """
        Convert Solar (Persian) calendar date to Gregorian
        
        Args:
            solar_date (str): Date in format 'YYYY/MM/DD'
            
        Returns:
            str: Date in Gregorian format 'YYYY-MM-DD'
        """
        try:
            # Parse Solar date
            year, month, day = map(int, solar_date.split('/'))
            
            # Convert to Gregorian using jalaali library
            g = Jalaali.to_gregorian(year, month, day)
            
            # Format as YYYY-MM-DD
            return f"{g['gy']}-{g['gm']:02d}-{g['gd']:02d}"
            
        except Exception as e:
            print(f"Error converting Solar date {solar_date}: {e}", file=sys.stderr)
            return 'نامشخص'
    
    @staticmethod
    def format_solar_date(solar_date, format_type='full'):
        """
        Format Solar date in different styles
        
        Args:
            solar_date (str): Date in format 'YYYY/MM/DD'
            format_type (str): 'full', 'short', or 'month_year'
            
        Returns:
            str: Formatted date string
        """
        try:
            year, month, day = map(int, solar_date.split('/'))
            
            # Persian month names
            month_names = {
                1: 'فروردین', 2: 'اردیبهشت', 3: 'خرداد',
                4: 'تیر', 5: 'مرداد', 6: 'شهریور',
                7: 'مهر', 8: 'آبان', 9: 'آذر',
                10: 'دی', 11: 'بهمن', 12: 'اسفند'
            }
            
            if format_type == 'full':
                return f"{day} {month_names[month]} {year}"
            elif format_type == 'short':
                return f"{year}/{month:02d}/{day:02d}"
            elif format_type == 'month_year':
                return f"{month_names[month]} {year}"
            else:
                return solar_date
                
        except Exception as e:
            print(f"Error formatting Solar date {solar_date}: {e}", file=sys.stderr)
            return 'نامشخص'

def test_date_conversion():
    """Test the date conversion functionality"""
    print("🧪 Testing Date Conversion...")
    print("-" * 50)
    
    # Test cases
    test_dates = [
        '2024-01-15',
        '2023-12-20',
        '2024-03-01',
        '2024-06-15',
        '2024-09-22',
        '2024-12-31'
    ]
    
    converter = DateConverter()
    
    for gregorian_date in test_dates:
        solar_date = converter.gregorian_to_solar(gregorian_date)
        formatted_date = converter.format_solar_date(solar_date, 'full')
        
        print(f"📅 {gregorian_date} → {solar_date} ({formatted_date})")
    
    print("\n✅ Date conversion test completed!")

def convert_dates_from_json(input_file, output_file):
    """
    Convert dates in a JSON file from Gregorian to Solar
    
    Args:
        input_file (str): Path to input JSON file
        output_file (str): Path to output JSON file
    """
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        converter = DateConverter()
        
        def convert_dates_in_object(obj):
            """Recursively convert dates in JSON object"""
            if isinstance(obj, dict):
                for key, value in obj.items():
                    if isinstance(value, str) and '-' in value and len(value) == 10:
                        # Check if it looks like a date (YYYY-MM-DD)
                        try:
                            datetime.strptime(value, '%Y-%m-%d')
                            obj[key] = converter.gregorian_to_solar(value)
                        except ValueError:
                            # Not a date, leave as is
                            pass
                    elif isinstance(value, (dict, list)):
                        convert_dates_in_object(value)
            elif isinstance(obj, list):
                for item in obj:
                    convert_dates_in_object(item)
        
        convert_dates_in_object(data)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Dates converted and saved to {output_file}")
        
    except Exception as e:
        print(f"❌ Error processing file: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "test":
            test_date_conversion()
        elif command == "convert" and len(sys.argv) == 4:
            input_file = sys.argv[2]
            output_file = sys.argv[3]
            convert_dates_from_json(input_file, output_file)
        else:
            print("Usage:")
            print("  python date_converter.py test")
            print("  python date_converter.py convert input.json output.json")
    else:
        test_date_conversion() 