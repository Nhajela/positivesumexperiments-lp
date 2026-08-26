import { json, preflight } from "@/lib/content/responses";
import { serializeTagsDocument } from "@/lib/content/serialize";

export const dynamic = "force-static";

export async function GET() {
  return json(await serializeTagsDocument());
}

export const OPTIONS = preflight;
