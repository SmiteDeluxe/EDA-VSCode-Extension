import logging
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "vscode-webview://*"}})

@app.route("/")
def hello_world():
    logging.error("test")
    return "Hello from se server!"

if __name__ == "__main__":
    app.run()