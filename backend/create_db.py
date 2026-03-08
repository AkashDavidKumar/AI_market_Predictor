import pymysql

try:
    connection = pymysql.connect(host='localhost', user='root', password='')
    cursor = connection.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS farm_ai;")
    connection.commit()
    print("Database farm_ai created successfully.")
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'connection' in locals() and connection.open:
        cursor.close()
        connection.close()
