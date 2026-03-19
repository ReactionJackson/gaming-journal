type DataType = "entry" | "game" | "day";

export function kvKey(type: DataType, id: string): string {
  const env = process.env.GALAEA_ENV ?? "dev";
  return `${env}:${type}:${id}`;
}
