import { z } from "zod";

const visitorIdSchema = z.string().uuid();

export function getVisitorId(request: Request) {
  const visitorId = request.headers.get("x-recall-visitor-id");
  const parsed = visitorIdSchema.safeParse(visitorId);
  if (!parsed.success) throw new Error("VISITOR_SESSION_MISSING");
  return parsed.data;
}
