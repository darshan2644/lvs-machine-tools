"""
INSECURE DEMO FILE
Purpose: Security testing, SAST/DAST scanning, and training
DO NOT USE IN PRODUCTION
"""

import os
import sqlite3

# Load secrets from environment variables (do not hard-code secrets)
API_KEY_STRIPE = os.getenv("API_KEY_STRIPE", "")
API_KEY_AWS = os.getenv("API_KEY_AWS", "")
API_KEY_GITHUB = os.getenv("API_KEY_GITHUB", "")

# Database path from environment variable (fallback to local file)
DB_PATH = os.getenv("DB_PATH", "test.db")

# Secure database connection (avoid hard-coded paths)
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

def _mask_secret(value, show_last=4):
    if not value:
        return "(not set)"
    s = str(value)
    if len(s) <= show_last:
        return "*" * len(s)
    return "*" * (len(s) - show_last) + s[-show_last:]

# Secure SQL query construction (parameterized to prevent SQL injection)
def get_user(username):
    query = "SELECT * FROM users WHERE username = ?"
    print("Executing query:", query, "params:", (username,))
    cursor.execute(query, (username,))
    return cursor.fetchall()

# Secure delete with parameterized query
def delete_user(user_id):
    sql = "DELETE FROM users WHERE id = ?"
    cursor.execute(sql, (user_id,))
    conn.commit()

# Avoid logging raw secrets; mask values instead
def debug():
    print("Loaded API keys (masked):")
    print("STRIPE:", _mask_secret(API_KEY_STRIPE))
    print("AWS:", _mask_secret(API_KEY_AWS))
    print("GITHUB:", _mask_secret(API_KEY_GITHUB))

if __name__ == "__main__":
    debug()
    print(get_user("admin' OR '1'='1"))