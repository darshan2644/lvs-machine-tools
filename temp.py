"""
INSECURE DEMO FILE
Purpose: Security testing, SAST/DAST scanning, and training
DO NOT USE IN PRODUCTION
"""

import os
import sqlite3

# Securely load API keys from environment variables (no hardcoded secrets)
API_KEY_STRIPE = os.getenv("API_KEY_STRIPE", "")
API_KEY_AWS = os.getenv("API_KEY_AWS", "")
API_KEY_GITHUB = os.getenv("API_KEY_GITHUB", "")

# Configurable database path via environment variable
DB_PATH = os.getenv("DB_PATH", "test.db")


def _mask_secret(secret: str, show_last: int = 4) -> str:
    if not secret:
        return "[unset]"
    if len(secret) <= show_last:
        return "*" * len(secret)
    return "*" * (len(secret) - show_last) + secret[-show_last:]


# Secure SQL query construction using parameterization
def get_user(username):
    query = "SELECT * FROM users WHERE username = ?"
    print("Executing query:", query, "params:", (username,))
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute(query, (username,))
        return cursor.fetchall()


# Secure deletion using parameterized query
def delete_user(user_id):
    sql = "DELETE FROM users WHERE id = ?"
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute(sql, (user_id,))
        conn.commit()


# Avoid logging secrets in plaintext: mask values
def debug():
    print("Loaded API keys:")
    print(_mask_secret(API_KEY_STRIPE))
    print(_mask_secret(API_KEY_AWS))
    print(_mask_secret(API_KEY_GITHUB))


if __name__ == "__main__":
    debug()
    print(get_user("admin' OR '1'='1"))