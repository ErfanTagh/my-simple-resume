"""
Utility functions for views
"""
from datetime import datetime


def format_mongo_date(date_value):
    """Convert MongoDB date to ISO string format"""
    if not date_value:
        return None
    
    # Handle bson datetime objects first (they're common in MongoDB)
    try:
        from bson import datetime as bson_datetime
        if isinstance(date_value, bson_datetime.datetime):
            # BSON datetime already has isoformat() method
            return date_value.isoformat()
    except (ImportError, AttributeError, TypeError):
        pass
    
    # Handle Python datetime objects
    if hasattr(date_value, 'isoformat'):
        try:
            result = date_value.isoformat()
            # Ensure it's a string
            if result:
                return result
        except (AttributeError, TypeError):
            pass
    
    # Handle string dates - if already ISO format, return as is
    if isinstance(date_value, str):
        # If it's already an ISO string, return it
        if 'T' in date_value:
            return date_value
        # Try to parse common formats
        try:
            # Try parsing as ISO format
            dt = datetime.fromisoformat(date_value.replace('Z', '+00:00'))
            return dt.isoformat()
        except (ValueError, AttributeError):
            # If parsing fails, return the string as is
            return date_value
    
    # Last resort: convert to string
    try:
        return str(date_value)
    except Exception:
        return None


def get_date_or_now(date_value):
    """Get date from MongoDB or return current date if missing"""
    formatted = format_mongo_date(date_value)
    if formatted:
        return formatted
    # Return current date as fallback
    return datetime.utcnow().isoformat()

