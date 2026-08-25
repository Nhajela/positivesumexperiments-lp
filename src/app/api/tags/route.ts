import { json } from "@/lib/content/responses";
import { serializeTagsDocument } from "@/lib/content/serialize";

export const dynamic = "force-static";

export function GET() {
  return json(serializeTagsDocument());
}
