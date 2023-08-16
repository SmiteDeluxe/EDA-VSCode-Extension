import logging
from flask import Flask, request
from flask_cors import CORS
from safeds.data.tabular.containers import Table
import argparse

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "vscode-webview://*"}})


@app.route("/TableAsJson")
def TableAsJson():
    tableName = request.args.get("tableName")
    if not tableName:
        return "No tableName parameter given", 400

    table_data = {
        letter: [i * 10 + ord(letter) - ord("a") for i in range(4)]
        for letter in tableName
    }
    table = Table.from_dict(table_data)
    data_to_json = table._data.copy()
    data_to_json.columns = table._schema.column_names
    return data_to_json.to_json()


@app.route("/TableAsHtml")
def TableAsHtml():
    logging.error("test")
    table = Table.from_dict({"a": [1, 2], "b": [3, 4]})
    return table.to_html()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Start Flask App on a specific port.")
    parser.add_argument('--port', type=int, default=5000, help='Port on which to run the server.')
    args = parser.parse_args()

    app.run(port=args.port)
