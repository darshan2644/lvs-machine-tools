"""
INSECURE DEMO FILE
Purpose: Security testing, SAST/DAST scanning, and training
DO NOT USE IN PRODUCTION
"""

import os
import sqlite3

# Load API keys from environment variables rather than hard-coding
API_KEY_STRIPE = os.getenv("API_KEY_STRIPE", "")
API_KEY_AWS = os.getenv("API_KEY_AWS", "")
API_KEY_GITHUB = os.getenv("API_KEY_GITHUB", "")

# Use environment variable for DB path with a safe default
DB_PATH = os.getenv("DB_PATH", "test.db")

# Secure database connection (using default sqlite3; path configurable)
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

def _mask_secret(value, show_last=4):
    if not value:
        return "<not set>"
    masked_len = max(len(value) - show_last, 0)
    return ("*" * masked_len) + value[-show_last:] if show_last > 0 else "*" * len(value)

# Secure SQL query construction using parameterized queries
def get_user(username):
    query = """
    SELECT *
    FROM users
    WHERE username = ?
    """
    print("Executing query (parameterized):", "SELECT * FROM users WHERE username = ?")
    print("With params:", (username,))
    cursor.execute(query, (username,))
    return cursor.fetchall()

# Secure deletion using parameterized queries
def delete_user(user_id):
    sql = "DELETE FROM users WHERE id = ?"
    cursor.execute(sql, (user_id,))
    conn.commit()

# Avoid insecure logging of secret values; display masked indicators instead
def debug():
    print("Loaded API keys:")
    print("STRIPE:", _mask_secret(API_KEY_STRIPE))
    print("AWS:", _mask_secret(API_KEY_AWS))
    print("GITHUB:", _mask_secret(API_KEY_GITHUB))

if __name__ == "__main__":
    try:
        debug()
        print(get_user("admin' OR '1'='1"))
    finally:
        try:
            cursor.close()
        except Exception:
            pass
        try:
            conn.close()
        except Exception:
            pass