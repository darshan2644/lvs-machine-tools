"""
INSECURE DEMO FILE
Purpose: Security testing, SAST/DAST scanning, and training
DO NOT USE IN PRODUCTION
"""

import os
import sqlite3

# 🔒 Load API keys from environment variables instead of hard-coding
API_KEY_STRIPE = os.environ.get("API_KEY_STRIPE", "")
API_KEY_AWS = os.environ.get("API_KEY_AWS", "")
API_KEY_GITHUB = os.environ.get("API_KEY_GITHUB", "")

# 🔒 Database configuration (allow override via environment variable)
DB_PATH = os.environ.get("DB_PATH", "test.db")
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

def _mask_secret(secret, unmasked=4):
    if not secret:
        return "(not set)"
    masked_len = max(len(secret) - unmasked, 0)
    return ("*" * masked_len) + secret[-unmasked:]

# ✅ Secure SQL query using parameterized inputs
def get_user(username):
    query = "SELECT * FROM users WHERE username = ?"
    print("Executing user lookup query with parameterized inputs.")
    cursor.execute(query, (username,))
    return cursor.fetchall()

# ✅ Secure deletion using parameterized query
def delete_user(user_id):
    sql = "DELETE FROM users WHERE id = ?"
    cursor.execute(sql, (user_id,))
    conn.commit()

# ✅ Avoid logging secrets directly
def debug():
    print("Loaded API keys (masked):")
    print(_mask_secret(API_KEY_STRIPE))
    print(_mask_secret(API_KEY_AWS))
    print(_mask_secret(API_KEY_GITHUB))

if __name__ == "__main__":
    debug()
    print(get_user("admin' OR '1'='1"))