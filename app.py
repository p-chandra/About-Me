from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# Create a simple database and table
def init_db():
    conn = sqlite3.connect("hello.db")
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, text TEXT)")
    cursor.execute("INSERT INTO messages (text) VALUES ('Hello, World!')")
    conn.commit()
    conn.close()

@app.route("/message", methods=["GET"])
def get_message():
    conn = sqlite3.connect("hello.db")
    cursor = conn.cursor()
    cursor.execute("SELECT text FROM messages ORDER BY id DESC LIMIT 1")
    message = cursor.fetchone()
    conn.close()
    return jsonify({"message": message[0] if message else "No message found"})

if __name__ == "__main__":
    init_db()
    app.run(debug=True)
