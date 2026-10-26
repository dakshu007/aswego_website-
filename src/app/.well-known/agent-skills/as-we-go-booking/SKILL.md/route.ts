import { bookingSkill } from "@/lib/agents";

export const dynamic = "force-static";

export function GET() {
  return new Response(bookingSkill(), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
