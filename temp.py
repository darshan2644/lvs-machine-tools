"""
INSECURE DEMO FILE
Purpose: Security testing, SAST/DAST scanning, and training
DO NOT USE IN PRODUCTION
"""

import os
import sqlite3
import atexit
from typing import List, Any

# 🔒 Load API keys from environment variables instead of hard-coding
API_KEY_STRIPE = os.environ.get("API_KEY_STRIPE", "")
API_KEY_AWS = os.environ.get("API_KEY_AWS", "")
API_KEY_GITHUB = os.environ.get("API_KEY_GITHUB", "")

# 🔒 Database configuration (allow override via environment variable)
DB_PATH = os.environ.get("DB_PATH", "test.db")
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

def _mask_secret(secret: str, unmasked: int = 4) -> str:
    if not secret:
        return "(not set)"
    s = str(secret)
    try:
        unmasked_int = int(unmasked)
    except (TypeError, ValueError):
        unmasked_int = 4
    if unmasked_int < 0:
        unmasked_int = 0
    if len(s) <= unmasked_int:
        return "*" * len(s)
    masked_len = len(s) - unmasked_int
    return ("*" * masked_len) + s[-unmasked_int:]

# ✅ Secure SQL query using parameterized inputs
def get_user(username: str) -> List[Any]:
    if username is None:
        raise ValueError("username cannot be None")
    username_str = str(username)
    query = "SELECT * FROM users WHERE username = ?"
    print("Executing user lookup query with parameterized inputs.")
    cursor.execute(query, (username_str,))
    return cursor.fetchall()

# ✅ Secure deletion using parameterized query
def delete_user(user_id: int) -> None:
    try:
        uid = int(user_id)
    except (TypeError, ValueError):
        raise ValueError("user_id must be an integer")
    sql = "DELETE FROM users WHERE id = ?"
    cursor.execute(sql, (uid,))
    conn.commit()

# ✅ Avoid logging secrets directly
def debug() -> None:
    print("Loaded API keys (masked):")
    print(_mask_secret(API_KEY_STRIPE))
    print(_mask_secret(API_KEY_AWS))
    print(_mask_secret(API_KEY_GITHUB))

@atexit.register
def _close_db() -> None:
    try:
        try:
            if cursor:
                cursor.close()
        except Exception:
            pass
        try:
            if conn:
                conn.close()
        except Exception:
            pass
    except Exception:
        pass

if __name__ == "__main__":
    debug()
    print(get_user("admin' OR '1'='1"))