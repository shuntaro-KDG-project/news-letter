import fs from "fs";
import path from "path";

export function getEmail (
  filename: string,
  variable: Record<string, string>
) {
  const filePath = path.join(process.cwd(), "emails", filename);
  let html = fs.readFileSync(filePath, "utf-8")
  for (const [key, value] of Object.entries(variable))
    const regex = new RegExp(`{{${key}}}`, "g");
  html = html.replace(regex)
}