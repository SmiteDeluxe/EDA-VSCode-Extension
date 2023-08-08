import type { Table } from "../../../types/types";

export async function GetHtmlTable(): Promise<string> {
  try {
    const responseText = await (await fetch("http://127.0.0.1:5000/TableAsHtml", { method: "GET" })).text();
    console.log(responseText);
    return responseText;
  } catch (error) {
    console.error(error);
    return "";
  }
}

export async function GetJsonTable(tableName: string): Promise<Table> {
  try {
    const responseText = await (
      await fetch("http://127.0.0.1:5000/TableAsJson?" + new URLSearchParams({ tableName: tableName }), {
        method: "GET",
      })
    ).text();
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
    throw new Error(`Could not get Table ${tableName}`);
  }
}
