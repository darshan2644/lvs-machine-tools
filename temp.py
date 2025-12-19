"""
INSECURE DEMO FILE
Purpose: Security testing, SAST/DAST scanning, and training
DO NOT USE IN PRODUCTION
"""

import sqlite3

# ❌ Hard-coded fake API keys (for secret scanners)
API_KEY_STRIPE = "sk_test_FAKE1234567890"
API_KEY_AWS = "AKIAFAKEKEY123456"
API_KEY_GITHUB = "ghp_FAKEgithubtoken123"

# ❌ Insecure database connection
conn = sqlite3.connect("test.db")
cursor = conn.cursor()

# ❌ Insecure SQL query construction (SQL injection example)
def get_user(username):
    query = f"""
    SELECT *
    FROM users
    WHERE username = '{username}'
    """
    print("Executing query:", query)
    cursor.execute(query)
    return cursor.fetchall()

# ❌ Another broken query example with line breaks
def delete_user(user_id):
    sql = (
        "DELETE FROM users \n"
        "WHERE id = " + user_id
    )
    cursor.execute(sql)
    conn.commit()

# ❌ Insecure logging of secrets
def debug():
    print("Loaded API keys:")
    print(API_KEY_STRIPE)
    print(API_KEY_AWS)
    print(API_KEY_GITHUB)

if __name__ == "__main__":
    debug()
    print(get_user("admin' OR '1'='1"))
