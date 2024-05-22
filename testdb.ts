import { readdir } from "fs/promises";
import { join } from "path";
import { string } from "zod";

const jsonServerPort = "http://localhost:9000";

type RequestParamsWithoutId = {
  method: "GET" | "POST";
  headers?: { "Content-Type": string };
  body?: any;
};

type RequestParamsWithId = {
  method: "PATCH" | "DELETE";
  headers?: { "Content-Type": string };
  body?: any;
};

async function DB(params: RequestParamsWithoutId): Promise<void>;
async function DB(params: RequestParamsWithId, id: string): Promise<void>;

async function DB(
  {
    method,
    headers = { "Content-Type": "application/json" },
    body,
  }: RequestParamsWithoutId | RequestParamsWithId,
  id?: string
): Promise<void> {
  // Implementation here
  const idx = id ? `/${id}` : "";
  const response = await fetch(`${jsonServerPort}/images` + idx, {
    method,
    headers,
    body: JSON.stringify(body),
  });
  return response.json();
}
await DB({ method: "PATCH", body: { test: "patch" } }, "5");
console.log(await DB({ method: "GET" }));
