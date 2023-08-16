import type { Table } from "../../../types/types";

export async function GetHtmlTable(): Promise<string> {
  try {
    const response = await fetch("http://127.0.0.1:" + window.pythonServerPort + "/TableAsHtml", { method: "GET" });
    const responseText = await response.text();
    if (!response.ok) throw new Error(responseText);

    return responseText;
  } catch (error) {
    console.error(error);
    throw new Error(`Could not get Table`);
  }
}

export async function GetJsonTable(tableName: string): Promise<Table> {
  try {
    const response = await await fetch(
      "http://127.0.0.1:" + window.pythonServerPort + "/TableAsJson?" + new URLSearchParams({ tableName: tableName }),
      {
        method: "GET",
      },
    );
    const responseText = await response.text();
    if (!response.ok) throw new Error(responseText);

    let table: Table = { columns: [] };
    for (const column of Object.entries(JSON.parse(responseText))) {
      table.columns.push({
        name: column[0],
        values: Object.values(column[1]),
      });
    }
    return table;
  } catch (error) {
    console.error(error);
    throw new Error(`Could not get Table "${tableName}"`);
  }
}
