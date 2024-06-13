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

export async function DB(params: RequestParamsWithoutId): Promise<void>;
export async function DB(
  params: RequestParamsWithId,
  id: string
): Promise<void>;

export async function DB(
  {
    method,
    headers = { "Content-Type": "application/json" },
    body,
  }: RequestParamsWithoutId | RequestParamsWithId,
  id?: string
): Promise<void> {
  const idx = id ? `/${id}` : "";
  const response = await fetch(`${jsonServerPort}/images` + idx, {
    method,
    headers,
    body: JSON.stringify(body),
  });
  return response.json();
}
